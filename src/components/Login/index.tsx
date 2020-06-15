import React from 'react';
import './style.scss';
import LoginMethod from './LoginMethod';

interface Props {
  history: any;
  match: any;
  params: string;
  asset: string;
}

const Login = (props: Props) => {
  const oaLogin = () => {
    props.history.push(`/${props.asset}/login/oa`);
  };
  const emailLogin = () => {
    props.history.push(`/${props.asset}/login/email`);
  };

  const mirrorLogin = () => {
    console.log('not yet implemented');
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <div className="page-title">
            <div className="align-horizontal">
              {/* <i className="material-icons">fingerprint</i> */}
              Sign in
            </div>
            <div className="page-subtitle">
              Choose the preferred authentication method to continue
            </div>
            <div className="page-highlight" />
          </div>
          <div className="view-asset-item">
            <div className="space-top-3 mirror-signin">
              <div className="login-home">
                <LoginMethod action={oaLogin} icon="blur_on" label="Oneauth" />
                <LoginMethod action={emailLogin} icon="email" label="Email" />
                <LoginMethod
                  action={mirrorLogin}
                  icon="people"
                  label="Native"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
