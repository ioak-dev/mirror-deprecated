import React, { useState, useEffect } from 'react';
import OakText from '../../../oakui/OakText';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import EmailItem from './EmailItem';

interface Props {
  history: any;
  location: any;
  match: any;
  param: string;
  asset: string;
}

const queryString = require('query-string');

const Email = (props: Props) => {
  const [state, setState] = useState({ email: '', token: '' });
  const [formErrors, setFormErrors] = useState<any>({
    email: '',
    token: '',
  });

  const [tokenLogin, setTokenLogin] = useState(false);

  const [newEmail, setNewEmail] = useState(false);

  useEffect(() => {
    const token = queryString.parse(props.location.search);
    if (token.auth_token) {
      console.log(token.auth_token);
    }
  }, [props.location.search]);

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  const login = () => {
    const errorFields: any = { email: '', token: '' };

    if (tokenLogin && isEmptyOrSpaces(state.token)) {
      errorFields.token = 'Token cannot be empty';
    }
    if (!tokenLogin && isEmptyOrSpaces(state.email)) {
      errorFields.email = 'Email cannot be empty';
    }
    if (
      !tokenLogin &&
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        state.email.trim().toLowerCase()
      )
    ) {
      errorFields.email = 'Invalid email';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      if (tokenLogin) {
        props.history.push(
          `/${props.asset}/login/email?auth_token=${state.token}`
        );
      } else if (state.email === 'josh.shrinivas@gmail.com') {
        setNewEmail(!newEmail);
      }
    }
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <div className="view-asset-item">
            {!newEmail && (
              <div className="page-title">
                Login Details
                {!tokenLogin && !newEmail && (
                  <div className="page-subtitle">
                    <div className="browse-article-subtitle">
                      <div
                        className="hyperlink"
                        onClick={() => setTokenLogin(!tokenLogin)}
                      >
                        already have an auth key?
                      </div>
                    </div>
                  </div>
                )}
                {tokenLogin && (
                  <div className="page-subtitle">
                    <div className="browse-article-subtitle">
                      <div
                        className="hyperlink"
                        onClick={() => setTokenLogin(!tokenLogin)}
                      >
                        Use email instead?
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {!newEmail && (
              <div className="action-header position-right">
                <OakButton action={login} theme="primary" variant="appear">
                  <i className="material-icons">double_arrow</i>Submit
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
            )}
            {!tokenLogin && !newEmail && (
              <OakText
                label="Email"
                data={state}
                errorData={formErrors}
                id="email"
                handleChange={e => handleChange(e)}
              />
            )}

            {tokenLogin && !newEmail && (
              <OakText
                label="Token"
                data={state}
                errorData={formErrors}
                id="token"
                handleChange={e => handleChange(e)}
              />
            )}
            {!tokenLogin && newEmail && <EmailItem history={props.history} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
