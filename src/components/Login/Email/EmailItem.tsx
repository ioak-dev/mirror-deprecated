import React, { useState } from 'react';
import OakText from '../../../oakui/OakText';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';

interface Props {
  history: any;
}
const EmailItem = (props: Props) => {
  const [state, setState] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [formErrors, setFormErrors] = useState<any>({
    email: '',
    firstName: '',
    lastName: '',
  });

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  const submit = () => {
    const errorFields: any = { email: '', firstName: '', lastName: '' };

    if (isEmptyOrSpaces(state.firstName)) {
      errorFields.firstName = 'First name cannot be empty';
    }
    if (isEmptyOrSpaces(state.lastName)) {
      errorFields.lastName = 'Last name cannot be empty';
    }
    if (isEmptyOrSpaces(state.email)) {
      errorFields.email = 'Email cannot be empty';
    }
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        state.email.trim().toLowerCase()
      )
    ) {
      errorFields.email = 'Invalid email';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      console.log('Yet to be implemented');
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          Provide details
          <div className="page-highlight" />
        </div>

        <div className="action-header position-right">
          <OakButton action={submit} theme="primary" variant="appear">
            <i className="material-icons">double_arrow</i>Save
          </OakButton>
          {props.history.length > 2 && (
            <OakButton
              action={() => cancelLogin()}
              theme="default"
              variant="appear"
            >
              <i className="material-icons">close</i>Cancel
            </OakButton>
          )}
        </div>
      </div>
      <div className="create-article-item">
        <div className="user-form">
          <OakText
            label="First Name"
            data={state}
            errorData={formErrors}
            id="firstName"
            handleChange={e => handleChange(e)}
          />
          <OakText
            label="Last name"
            data={state}
            errorData={formErrors}
            id="lastName"
            handleChange={e => handleChange(e)}
          />
          <OakText
            label="Email"
            data={state}
            errorData={formErrors}
            id="email"
            handleChange={e => handleChange(e)}
          />
        </div>
      </div>
    </>
  );
};

export default EmailItem;
