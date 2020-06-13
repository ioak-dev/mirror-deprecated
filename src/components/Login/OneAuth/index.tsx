import React, { useState, useEffect } from 'react';
import OakButton from '../../../oakui/OakButton';
import OakText from '../../../oakui/OakText';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';

interface Props {
  history: any;
  location: any;
}

const queryString = require('query-string');

const OneAuth = (props: Props) => {
  const [state, setState] = useState({ space: '' });
  const [formErrors, setFormErrors] = useState<any>({
    space: '',
  });

  useEffect(() => {
    const spaceData = queryString.parse(props.location.search);
    if (spaceData.space) {
      window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${spaceData.space}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
    }
  }, []);

  const oaLogin = () => {
    const errorFields: any = { space: '' };
    if (isEmptyOrSpaces(state.space)) {
      errorFields.name = 'Space cannot be empty';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${state.space}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
    }
  };

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <div className="view-asset-item">
            <div className="page-title">Login Details</div>
            <div className="action-header position-right">
              <OakButton action={oaLogin} theme="primary" variant="appear">
                <i className="material-icons">double_arrow</i>Submit
              </OakButton>
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
            <OakText
              label="Space"
              data={state}
              errorData={formErrors}
              id="space"
              handleChange={e => handleChange(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneAuth;
