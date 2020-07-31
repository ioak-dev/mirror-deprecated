import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import LoginMethod from './LoginMethod';
import OakHeading from '../../oakui/OakHeading';
import OakPage from '../../oakui/OakPage';
import OakSection from '../../oakui/OakSection';

interface Props {
  history: any;
  match: any;
  params: string;
  asset: string;
}

const Login = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const oaLogin = () => {
    props.history.push(`/${props.asset}/login/oa`);
  };
  const emailLogin = () => {
    props.history.push(`/${props.asset}/login/email`);
  };

  const mirrorLogin = () => {
    console.log('not yet implemented');
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.history.push(`/${props.asset}/home`);
    }
  }, [authorization]);

  return (
    <OakPage>
      <OakSection>
        <OakHeading
          title="Sign in"
          subtitle="Choose the preferred authentication method to continue"
        />
        <div className="view-asset-item">
          <div className="space-top-3 mirror-signin">
            <div className="login-home">
              <LoginMethod action={oaLogin} icon="blur_on" label="Oneauth" />
              <LoginMethod action={emailLogin} icon="email" label="Email" />
              <LoginMethod action={mirrorLogin} icon="people" label="Native" />
            </div>
          </div>
        </div>
      </OakSection>
    </OakPage>
  );
};

export default Login;
