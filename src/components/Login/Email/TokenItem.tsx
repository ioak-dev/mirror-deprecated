import React, { useState, useEffect } from 'react';
import OakButton from '../../../oakui/OakButton';
import OakText from '../../../oakui/OakText';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import OakHeading from '../../../oakui/OakHeading';

interface Props {
  history: any;
  emailLogin: Function;
  asset: string;
  queryParam: any;
  cookies: any;
}
const TokenItem = (props: Props) => {
  const [state, setState] = useState({ token: '' });
  const [formErrors, setFormErrors] = useState<any>({
    token: '',
  });

  useEffect(() => {
    if (props.queryParam.auth_token) {
      console.log(props.queryParam.auth_token);

      props.cookies.set(
        `mirror_${props.asset}`,
        `email ${props.queryParam.auth_token}`
      );
      props.history.push(`/${props.asset}/home`);
    }
  }, [props.queryParam]);

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const login = event => {
    event.preventDefault();
    const errorFields: any = { token: '' };

    if (isEmptyOrSpaces(state.token)) {
      errorFields.token = 'Token cannot be empty';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      props.history.push(
        `/${props.asset}/login/email?type=token&auth_token=${state.token}`
      );
    }
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  return (
    <>
      <div className="page-header">
        <OakHeading
          title="Email authentication"
          subtitle="You would have received an authentication token in your email"
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
          label="Token"
          data={state}
          errorData={formErrors}
          id="token"
          handleChange={e => handleChange(e)}
        />
      </form>
      <div className="email-login-footer">
        <div>or</div>
        <div className="hyperlink" onClick={() => props.emailLogin()}>
          Get a token to your email, if you did not receive one
        </div>
      </div>
    </>
  );
};

export default TokenItem;
