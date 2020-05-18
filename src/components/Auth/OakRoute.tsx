import React, { useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { getAuth, addAuth } from '../../actions/AuthActions';
import { Authorization } from '../Types/GeneralTypes';
import { httpGet } from '../Lib/RestTemplate';
import { setProfile } from '../../actions/ProfileActions';
import { sendMessage } from '../../events/MessageService';

interface Props {
  authorization: Authorization;
  path?: string;
  render?: any;
  component: any;
  match: any;
  history: any;
  middleware?: string[];
  cookies: any;
}

const OakRoute = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log(props.match.params.tenant);
  // }, []);
  // useEffect(() => {
  //   console.log(props.profile.appStatus, props.profile.loginPage);
  //   if (props.profile.appStatus === 'notmounted' && !props.profile.loginPage) {
  //     props.setProfile({
  //       tenant: props.match.params.tenant,
  //       appStatus: 'mounted',
  //     });
  //   } else {
  //     props.setProfile({ tenant: props.match.params.tenant });
  //   }
  //   middlewares(props.middleware);
  // }, []);

  // useEffect(() => {
  //   console.log(props.profile.appStatus, props.profile.loginPage);
  //   // middlewares(props.middleware);
  // }, []);

  // useEffect(() => {
  //   middlewares(props.middleware);
  // }, [props.profile.appStatus]);

  const middlewares = () => {
    // if (props.profile.appStatus === 'authenticated') {
    console.log(props.middleware);
    props.middleware?.forEach(middlewareName => {
      if (!runMidleware(middlewareName)) {
        return false;
      }
    });
    return true;
    // }
  };

  const runMidleware = middlewareName => {
    sendMessage('spaceChange', true, '');
    switch (middlewareName) {
      case 'readAuthentication':
        return readAuthenticationSpace();
      case 'authenticate':
        return authenticateSpace();
      case 'isAdmin':
        return isAdmin();
      default:
        return true;
    }
  };

  const authenticateSpace = () => {
    return authenticate('space');
  };
  const readAuthenticationSpace = () => {
    return authenticate('space', false);
  };

  const authenticate = (type, redirect = true) => {
    sendMessage('spaceChange', true, props.match.params.tenant);
    if (authorization.isAuth) {
      return true;
    }
    const cookieKey = `mirror_${props.match.params.tenant}`;
    const authKey = props.cookies.get(cookieKey);
    const baseAuthUrl = `/auth/${props.match.params.tenant}`;
    if (authKey) {
      httpGet(`${baseAuthUrl}/session/${authKey}`, null)
        .then(sessionResponse => {
          if (sessionResponse.status === 200) {
            dispatch(
              addAuth({
                isAuth: true,
                token: sessionResponse.data.token,
                secret: '',
                firstName: sessionResponse.data.firstName,
                lastName: sessionResponse.data.lastName,
                email: sessionResponse.data.email,
              })
            );
          }
        })
        .catch((error: any) => {
          props.cookies.remove(cookieKey);
          if (redirect && error.response.status === 404) {
            sendMessage('notification', true, {
              type: 'failure',
              message: 'Invalid session token',
              duration: 3000,
            });
            redirectToLogin(props.match.params.tenant);
          } else if (redirect && error.response.status === 401) {
            sendMessage('notification', true, {
              type: 'failure',
              message: 'Session expired',
              duration: 3000,
            });
            redirectToLogin(props.match.params.tenant);
          }
        });
    } else if (redirect) {
      redirectToLogin(props.match.params.tenant);
    } else {
      return true;
    }
  };

  const isAdmin = () => {
    redirectToUnauthorized();
    return false;
  };

  const redirectToLogin = spaceId => {
    window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${spaceId}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
  };

  const redirectToUnauthorized = () => {
    props.history.push(`/${profile.tenant}/unauthorized`);
  };

  return (
    <>
      {middlewares() && (
        <props.component
          {...props}
          profile={profile}
          space={props.match.params.tenant}
          // getProfile={getProfile}
          // setProfile={props.setProfile}
        />
      )}
    </>
  );
};

export default OakRoute;
