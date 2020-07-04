import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import OakText from '../../../oakui/OakText';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import { NEW_EMAIL_SESSION } from '../../Types/schema';
import './style.scss';
import OakHeading from '../../../oakui/OakHeading';

interface Props {
  history: any;
  tokenLogin: Function;
  newAccount: Function;
}

const EmailItem = (props: Props) => {
  const gqlClient = useApolloClient();
  const [state, setState] = useState({ email: '' });
  const [formErrors, setFormErrors] = useState<any>({
    email: '',
  });

  const [isTokenSent, setIsTokenSent] = useState(false);

  // Temporary until email functionality is implemented
  const [token, setToken] = useState('');

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const login = async event => {
    event.preventDefault();
    const errorFields: any = { email: '' };

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
      const { data } = await gqlClient.query({
        query: NEW_EMAIL_SESSION,
        variables: { email: state.email },
      });
      if (data?.newEmailSession) {
        setToken(data?.newEmailSession.sessionId);
        setIsTokenSent(true);
      } else {
        props.newAccount();
      }
    }
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  return (
    <>
      {isTokenSent && (
        <>
          <div className="page-header">
            <OakHeading
              title="Email authentication"
              subtitle="You will receive an authentication token to your email"
            />
          </div>
          <div className="typhography-4 hyperlink-inline">
            Authentication token is generated and sent to your email. You can
            click on the login link from your email instruction or copy paste{' '}
            {token} the token id&nbsp;
            <div className="hyperlink" onClick={() => props.tokenLogin()}>
              here
            </div>
          </div>
        </>
      )}
      {!isTokenSent && (
        <>
          <div className="page-header">
            <OakHeading
              title="Email authentication"
              subtitle="You will receive an authentication token to your email"
            />
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
          </div>
          <form method="GET" onSubmit={login} noValidate>
            <OakText
              label="Email"
              data={state}
              errorData={formErrors}
              id="email"
              handleChange={e => handleChange(e)}
            />
          </form>
          <div className="email-login-footer">
            <div>or</div>
            <div className="hyperlink" onClick={() => props.tokenLogin()}>
              Enter authentication token, if you already have one
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EmailItem;
