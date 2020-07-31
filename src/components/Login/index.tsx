import React, { useEffect, useState } from 'react';
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
  location: any;
}

const queryString = require('query-string');

const Login = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [from, setFrom] = useState<string | undefined>();
  const oaLogin = () => {
    props.history.push(
      `/${props.asset}/login/oa${from ? `?from=${from}` : ''}`
    );
  };
  const emailLogin = () => {
    props.history.push(
      `/${props.asset}/login/email${from ? `?from=${from}` : ''}`
    );
  };

  const mirrorLogin = () => {
    console.log('not yet implemented');
  };

  useEffect(() => {
    if (authorization.isAuth) {
      props.history.push(`/${props.asset}/article`);
    }
  }, [authorization]);

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    query.from ? setFrom(query.from) : setFrom(undefined);
  }, [props.location.search]);

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
