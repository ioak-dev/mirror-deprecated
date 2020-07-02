import React, { useState, useEffect } from 'react';
import OakButton from '../../../oakui/OakButton';
import OakText from '../../../oakui/OakText';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import OakHeading from '../../../oakui/OakHeading';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';

interface Props {
  history: any;
  location: any;
  asset: string;
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
      window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${spaceData.space}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}&asset=${props.asset}`;
    }
  }, []);

  const oaLogin = () => {
    const errorFields: any = { space: '' };
    if (isEmptyOrSpaces(state.space)) {
      errorFields.space = 'Space cannot be empty';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${state.space}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}&asset=${props.asset}`;
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
    <OakPage>
      <OakSection>
        <div className="view-asset-item">
          <OakHeading
            title="Login via Oneauth"
            subtitle="You will be redirected to oneauth for signing in to your space"
          />
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
      </OakSection>
    </OakPage>
  );
};

export default OneAuth;
