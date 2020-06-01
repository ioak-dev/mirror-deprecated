import React, { useState, useEffect } from 'react';
import './Login.scss';

const queryString = require('query-string');

interface Props {
  setProfile: Function;
  cookies: any;
  history: any;
  profile: any;
  match: any;
  location: any;
}

const Login = (props: Props) => {
  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      props.cookies.set(`mirror_${query.space}`, query.authKey);
      props.history.push(`/${query.space}/home`);
    }
  }, []);

  return <></>;
};

export default Login;
