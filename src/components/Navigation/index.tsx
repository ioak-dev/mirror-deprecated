import React, { useEffect, useState } from 'react';
import { useSelector, connect } from 'react-redux';

import { withRouter } from 'react-router';
import { withCookies } from 'react-cookie';
import { getProfile, setProfile } from '../../actions/ProfileActions';

import './style.scss';
import Desktop from './Desktop';
import Mobile from './Mobile';

import { Authorization, Profile } from '../Types/GeneralTypes';
import { receiveMessage, sendMessage } from '../../events/MessageService';

interface Props {
  sendEvent: Function;
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  getProfile: Function;
  setProfile: Function;
  profile: Profile;
  login: Function;
  transparent: boolean;
  toggleSettings: any;
  history: any;
  cookies: any;
  location: any;
  match: any;
}

const Navigation = (props: Props) => {
  const [data, setData] = useState({
    visible: false,
    mobilemenu: 'hide',
    chooseTheme: false,
    showSettings: false,
    transparentNavBar: false,
    firstLoad: true,
  });

  const authorization = useSelector(state => state.authorization);

  const [space, setSpace] = useState('');

  useEffect(() => {
    receiveMessage().subscribe(event => {
      if (event.name === 'spaceChange') {
        setSpace(event.data);
      }
    });
  }, []);

  useEffect(() => {
    props.getProfile();
  }, []);

  useEffect(() => {
    receiveMessage().subscribe(message => {
      if (message.name === 'navbar-transparency') {
        setData({ ...data, transparentNavBar: message.signal });
      }
      if (message.name === 'loggedin') {
        // props.reloadProfile(nextProps.authorization);
        setData({ ...data, firstLoad: false });
      }
    });
  }, []);

  useEffect(() => {
    if (data.firstLoad && authorization && authorization.isAuth) {
      setData({ ...data, firstLoad: false });
    }
  }, [authorization.isAuth]);

  const logout = (
    event: any,
    type = 'success',
    message = 'You have been logged out'
  ) => {
    props.removeAuth();
    props.cookies.remove(`mirror_${space}`);
    sendMessage('notification', true, {
      type,
      message,
      duration: 3000,
    });
  };

  const toggleDarkMode = () => {
    if (props.profile.theme === 'theme_dark') {
      props.setProfile({
        ...props.profile,
        theme: 'theme_light',
      });
    } else {
      props.setProfile({
        ...props.profile,
        theme: 'theme_dark',
      });
    }
  };

  const login = type => {
    // props.history.push(`/${props.profile.tenant}/login?type=${type}`);
    // console.log(props.profile.tenant);
    window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${space}/login?type=${type}&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
  };

  const toggleSettings = () => {
    setData({ ...data, showSettings: !data.showSettings });
  };

  return (
    <div className="nav">
      <Desktop
        {...props}
        logout={logout}
        login={login}
        space={space}
        toggleSettings={toggleSettings}
        transparent={data.transparentNavBar}
        toggleDarkMode={toggleDarkMode}
      />
      <Mobile
        {...props}
        logout={logout}
        login={login}
        space={space}
        toggleSettings={toggleSettings}
        transparent={data.transparentNavBar}
        toggleDarkMode={toggleDarkMode}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfile, setProfile })(
  withCookies(withRouter(Navigation))
);
