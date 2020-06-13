import React, { useState, useEffect } from 'react';
import OakButton from '../../oakui/OakButton';

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
          <div className="view-asset-item">
            <div className="page-title">
              Login to Mirror
              <div className="space-top-3 mirror-signin">
                <div className="mirror-signin-container align-vertical">
                  <div className="icon space-bottom-1">
                    <OakButton
                      action={oaLogin}
                      theme="primary"
                      variant="appear"
                    >
                      <i className="material-icons">login</i>OneAuth Login
                    </OakButton>
                  </div>
                  <div className="icon space-bottom-1">
                    <OakButton
                      action={emailLogin}
                      theme="primary"
                      variant="appear"
                    >
                      <i className="material-icons">login</i>Email Login
                    </OakButton>
                  </div>
                  <div className="icon space-bottom-1">
                    <OakButton
                      action={mirrorLogin}
                      theme="primary"
                      variant="appear"
                    >
                      <i className="material-icons">login</i>Native Mirror Login
                    </OakButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
