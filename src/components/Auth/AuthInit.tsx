import { compose } from 'redux';
import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { withCookies, ReactCookieProps } from 'react-cookie';
import { withRouter } from 'react-router';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import { Authorization } from '../Types/GeneralTypes';
import { httpGet } from '../Lib/RestTemplate';
import { setProfile } from '../../actions/ProfileActions';

interface Props extends ReactCookieProps {
  authorization: Authorization;
  profile: any;
  addAuth: Function;
  getAuth: Function;
  removeAuth: Function;
  cookies: any;
  history: any;
  redirectIfNotAuthenticated: Boolean;
}

const AuthInit = (props: Props) => {
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (!props.authorization.isAuth && props.cookies.get('isAuth')) {
  //     props.addAuth({
  //       isAuth: true,
  //       token: props.cookies.get('token'),
  //       secret: props.cookies.get('secret'),
  //       name: props.cookies.get('name'),
  //     });
  //   }
  //   props.getAuth();
  // }, [props.authorization.isAuth]);

  useEffect(() => {
    console.log('*******');
    console.log(profile.appStatus);
    console.log(profile.tenant);
    if (profile.appStatus === 'mounted' && profile.tenant) {
      const authKey = props.cookies.get(`mirror_${profile.tenant}`);
      if (authKey) {
        httpGet(
          `/auth/${profile.tenant}/session/${authKey}`,
          null,
          process.env.REACT_APP_ONEAUTH_API_URL
        ).then(sessionResponse => {
          if (sessionResponse.status === 200) {
            dispatch(addAuth({
              isAuth: true,
              token: sessionResponse.data.token,
              secret: '',
              name: 'name',
            }));
            dispatch(setProfile({...profile, appStatus: 'authenticated'}));
          }
        });
      } 
      // else if (props.redirectIfNotAuthenticated) {
      //   window.location.href = `http://localhost:3010/#/${props.profile.tenant}/login?appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
      // } 
      else {
        dispatch(setProfile({...profile, appStatus: 'authenticated'}));
      }
    }
  }, [profile.appStatus]);

  return <></>;
};

const mapStateToProps = state => ({
  authorization: state.authorization,
});

export default connect(mapStateToProps, { getAuth, addAuth, removeAuth })(
  compose(withCookies, withRouter)(AuthInit)
);
