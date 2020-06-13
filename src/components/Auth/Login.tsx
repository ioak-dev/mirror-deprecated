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
      console.log(query);
      const asset = query.space;
      props.cookies.set(`mirror_${asset}`, query.authKey);
      props.history.push(`/${asset}/home`);
    }
  }, []);

  return <></>;
};

export default Login;
