import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { addAuth } from '../../actions/AuthActions';
import { Authorization } from '../Types/GeneralTypes';
import { sendMessage } from '../../events/MessageService';
import { GET_SESSION } from '../Types/schema';

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
  const gqlClient = useApolloClient();
  const authorization = useSelector(state => state.authorization);
  const profile = useSelector(state => state.profile);
  const dispatch = useDispatch();

  const middlewares = () => {
    props.middleware?.forEach(middlewareName => {
      if (!runMidleware(middlewareName)) {
        return false;
      }
    });
    return true;
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
    return authenticate('asset');
  };
  const readAuthenticationSpace = () => {
    return authenticate('asset', false);
  };

  const authenticate = async (type, redirect = true) => {
    sendMessage('spaceChange', true, props.match.params.asset);
    if (authorization.isAuth) {
      return true;
    }
    const cookieKey = `mirror_${props.match.params.asset}`;
    const authKey = props.cookies.get(cookieKey);
    const baseAuthUrl = `/auth/${props.match.params.asset}`;
    if (authKey) {
      const { data } = await gqlClient.query({
        query: GET_SESSION,
        variables: { key: authKey, asset: props.match.params.asset },
      });

      if (data?.session) {
        dispatch(
          addAuth({
            isAuth: true,
            token: data.session.token,
            secret: '',
            firstName: data.session.firstName,
            lastName: data.session.lastName,
            email: data.session.email,
          })
        );
      } else {
        props.cookies.remove(cookieKey);
        if (redirect) {
          sendMessage('notification', true, {
            type: 'failure',
            message: 'Invalid session token',
            duration: 3000,
          });
          redirectToLogin(props.match.params.asset);
        }
      }
    } else if (redirect) {
      redirectToLogin(props.match.params.asset);
    } else {
      return true;
    }
  };

  const isAdmin = () => {
    redirectToUnauthorized();
    return false;
  };

  const redirectToLogin = asset => {
    // window.location.href = `${process.env.REACT_APP_ONEAUTH_URL}/#/space/${spaceId}/login?type=signin&appId=${process.env.REACT_APP_ONEAUTH_APP_ID}`;
    props.history.push(`/${asset}/login/home`);
  };

  const redirectToUnauthorized = () => {
    props.history.push(`/${profile.asset}/unauthorized`);
  };

  return (
    <>
      {middlewares() && (
        <props.component
          {...props}
          profile={profile}
          asset={props.match.params.asset}
          // getProfile={getProfile}
          // setProfile={props.setProfile}
        />
      )}
    </>
  );
};

export default OakRoute;
