import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OakButton from '../../../oakui/OakButton';
import OakText from '../../../oakui/OakText';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import OakHeading from '../../../oakui/OakHeading';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import { fetchSpace } from '../../Auth/AuthService';
import SpaceItem from './SpaceItem';
import './style.scss';

interface Props {
  history: any;
  location: any;
  asset: string;
}

const queryString = require('query-string');

const OneAuth = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [view, setView] = useState<Array<any> | undefined>(undefined);
  const [searchCriteria, setSearchCriteria] = useState({ text: '' });

  useEffect(() => {
    const queryParam = queryString.parse(props.location.search);
    if (queryParam.space) {
      window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${queryParam.space}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}&asset=${props.asset}&from=${queryParam.from}`;
    }
  }, []);

  useEffect(() => {
    fetchSpace().then(response => {
      setView(search(response.data, searchCriteria.text));
    });
  }, [searchCriteria]);

  // const oaLogin = () => {
  //   const errorFields: any = { space: '' };
  //   if (isEmptyOrSpaces(state.space)) {
  //     errorFields.space = 'Space cannot be empty';
  //   }
  //   setFormErrors(errorFields);
  //   if (isEmptyAttributes(errorFields)) {
  //     const queryParam = queryString.parse(props.location.search);
  //     window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${
  //       state.space
  //     }/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}&asset=${
  //       props.asset
  //     }${queryParam.from ? `&from=${queryParam.from}` : ''}`;
  //   }
  // };

  const search = (existingSpace, criteria) => {
    if (isEmptyOrSpaces(criteria)) {
      return existingSpace;
    }
    return existingSpace.filter(
      item => item.name.toLowerCase().indexOf(criteria.toLowerCase()) !== -1
    );
  };

  const handleSearchCriteria = event => {
    setSearchCriteria({
      ...searchCriteria,
      [event.target.name]: event.target.value,
    });
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.history.push(`/${props.asset}/article`);
    }
  }, [authorization]);

  return (
    <OakPage>
      <OakSection>
        <div className="view-asset-item">
          <div className="page-header">
            <OakHeading
              title="Login via Oneauth"
              subtitle="You will be redirected to oneauth for signing in to your space"
            />
            <div className="action-header position-right">
              {/* <OakButton action={oaLogin} theme="primary" variant="appear">
                <i className="material-icons">double_arrow</i>Submit
              </OakButton> */}
              {props.history.length > 2 && (
                <OakButton
                  action={() => cancelCreation()}
                  theme="default"
                  variant="appear"
                >
                  <i className="material-icons">close</i>Cancel
                </OakButton>
              )}
            </div>
          </div>
          <OakText
            label="Type company name to filter"
            handleChange={handleSearchCriteria}
            id="text"
            data={searchCriteria}
          />
          <div className="list-spaces">
            <div className="list-spaces--content">
              {view?.map(space => (
                <SpaceItem
                  history={props.history}
                  space={space}
                  key={space._id}
                  asset={props.asset}
                />
              ))}
            </div>
          </div>
        </div>
      </OakSection>
    </OakPage>
  );
};

export default OneAuth;
