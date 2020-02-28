import React, { useState, useEffect } from 'react';
import './style.scss';
import { any } from 'prop-types';
import { sendMessage } from '../../events/MessageService';
import OakText from '../../oakui/OakText';
import { getTenant } from '../Tenant/TenantService';
import { Authorization } from '../Types/GeneralTypes';
import ViewResolver from '../../oakui/ViewResolver';
import View from '../../oakui/View';
import Sidebar from '../../oakui/Sidebar';
import Stages from '../Stages/index';

interface Props {
  match: any;
  setProfile: Function;
  profile: any;
  authorization: Authorization;
}

const Settings = (props: Props) => {
  const sidebarElements = {
    tenant: [
      {
        label: 'Profile',
        action: () => chooseSection('tenantProfile'),
        icon: 'home',
      },
      {
        label: 'Support levels',
        action: () => chooseSection('stage'),
        icon: 'fast_forward',
      },
      {
        label: 'Training dataset',
        action: () => chooseSection('trainingDataset'),
        icon: 'bubble_chart',
      },
      {
        label: 'Article categories',
        action: () => chooseSection('articleCategories'),
        icon: 'compare',
      },
    ],
    myProfile: [
      {
        label: 'Profile',
        action: () => chooseSection('userProfile'),
        icon: 'person',
      },
      {
        label: 'Password',
        action: () => chooseSection('userPassword'),
        icon: 'security',
      },
    ],
  };

  const [data, setData] = useState({
    name: '',
    email: '',
    jwtPassword: '',
    banner: any,
    errorFields: {
      name: false,
      email: false,
      jwtPassword: false,
    },
    section: 'tenantProfile',
  });

  useEffect(() => {
    if (props.authorization.isAuth) {
      getTenant(props.match.params.tenant, {
        headers: {
          Authorization: props.authorization.token,
        },
      }).then(response => {
        setData({
          ...data,
          name: response.data.name,
          email: response.data.ownerEmail,
          jwtPassword: response.data.jwtPassword,
        });
      });
    }

    props.setProfile({ ...props.profile, tenant: props.match.params.tenant });
  }, []);

  const chooseSection = section => {
    setData({ ...data, section });
    sendMessage('sidebar', false);
  };

  const handleImageChange = e => {
    setData({ ...data, banner: e.target.files[0] });
  };

  const handleChange = event => {
    setData({ ...data, [event.currentTarget.name]: event.currentTarget.value });
  };

  return (
    <div className="settings">
      <ViewResolver sideLabel="More options">
        <View main>
          {data.section === 'tenantProfile' && (
            <>
              <div className="typography-3 space-bottom-2">Tenant Profile</div>
              <div className="form">
                <OakText
                  id="email"
                  data={data}
                  label="Administrator Email"
                  handleChange={e => handleChange(e)}
                  errorFields={data.errorFields}
                />
                <OakText
                  id="jwtPassword"
                  type="password"
                  data={data}
                  label="JWT Password"
                  handleChange={e => handleChange(e)}
                  errorFields={data.errorFields}
                />
                <label className="file-upload space-top-1 space-bottom-4">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageChange}
                    required
                  />
                  <i className="material-icons">add_photo_alternate</i>
                  {!data.banner && 'Choose Banner/Cover Image'}
                  {data.banner && data.banner.name}
                </label>
              </div>
            </>
          )}

          {data.section === 'stage' && (
            <div className="stage">
              <Stages match={props.match} authorization={props.authorization} />
            </div>
          )}

          {data.section === 'userProfile' && (
            <>
              <div className="typography-3 space-bottom-2">User Profile</div>
            </>
          )}

          {data.section === 'userPassword' && (
            <>
              <div className="typography-3 space-bottom-2">
                Change Login Password
              </div>
            </>
          )}
        </View>
        <View side>
          <div className="filter-container">
            <div className="section-main">
              <Sidebar
                label="Tenant"
                elements={sidebarElements.tenant}
                icon="home"
                animate
              />
              <Sidebar
                label="My Profile"
                elements={sidebarElements.myProfile}
                icon="account_circle"
                animate
              />
            </div>
          </div>
        </View>
      </ViewResolver>
    </div>
  );
};

export default Settings;
