import React, { useState, useEffect } from 'react';
import './Login.scss';

const queryString = require('query-string');

interface Props {
  cookies: any;
  history: any;
  location: any;
}

const OaLogin = (props: Props) => {
  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      console.log(query);
      const asset = query.space;
      props.cookies.set(
        `mirror_${asset}`,
        `oa ${query.space} ${query.authKey}`
      );
      console.log(`oa ${query.space} ${query.authKey}`);
      props.history.push(`/${asset}/home`);
    }
  }, []);

  return <></>;
};

export default OaLogin;
