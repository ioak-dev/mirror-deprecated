import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import './Login.scss';
import { Authorization } from '../Types/GeneralTypes';
import { sendMessage } from '../../events/MessageService';
import { httpGet } from '../Lib/RestTemplate';

const queryString = require('query-string');

interface Props {
  setProfile: Function;
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  cookies: any;
  history: any;
  profile: any;
  match: any;
  location: any;
  authorization: Authorization;
}

const Login = (props: Props) => {
  useEffect(() => {
    console.log('INSIDE LOGIN');
    props.setProfile({...props.profile, loginPage: true});
    console.log(props.profile.loginPage);
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      httpGet(
        `/auth/${query.space}/session/${query.authKey}`,
        null,
        process.env.REACT_APP_ONEAUTH_API_URL
      ).then(sessionResponse => {
        if (sessionResponse.status === 200) {
          success({
            token: sessionResponse.data.token,
            // secret: '',
            name: 'name',
            email: '',
            authKey: query.authKey,
            space: query.space,
          });
          props.history.push(`/${query.space}/home`);
          sendMessage('notification', true, {
            type: 'success',
            message: 'logged in',
            duration: 3000,
          });
        }
      });
      // if (query && query.jwt) {
      //   loginViaJwt(query.jwt);
      // }
    }
    // props.setProfile({ ...props.profile, tenant: props.match.params.tenant });
  }, []);

  const success = data => {
    props.addAuth({
      isAuth: true,
      token: data.token,
      secret: data.secret,
      name: data.name,
    });
    props.setProfile({appStatus: 'authenticated'});
    sendMessage('loggedin', true);
    props.cookies.set(`mirror_${data.space}`, data.authKey);
    props.history.push('/');
  };

  return <></>;
};

const mapStateToProps = state => ({
  authorization: state.authorization,
});

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(
  withCookies(Login)
);
