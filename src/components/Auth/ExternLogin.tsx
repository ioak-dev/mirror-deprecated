import React, { useState, useEffect } from 'react';
import './Login.scss';
import { useApolloClient } from '@apollo/react-hooks';

import { NEW_EXTERN_SESSION } from '../Types/schema';

const queryString = require('query-string');

interface Props {
  cookies: any;
  history: any;
  location: any;
  asset: string;
}

const ExternLogin = (props: Props) => {
  const gqlClient = useApolloClient();
  const [isInvalidToken, setIsInvalidToken] = useState(false);
  useEffect(() => {
    if (props.location.search) {
      const query = queryString.parse(props.location.search);
      createSession(query.token);
    }
  }, []);

  const createSession = async (token: string) => {
    const { data } = await gqlClient.query({
      query: NEW_EXTERN_SESSION,
      variables: { token, asset: null },
    });
    if (data?.newExternSession?.sessionId) {
      props.cookies.set(
        `mirror_${props.asset}`,
        `extern ${data?.newExternSession?.sessionId}`
      );
      props.history.push(`/${props.asset}/home`);
    } else {
      setIsInvalidToken(true);
    }
  };

  return (
    <>
      {isInvalidToken && (
        <div className="app-page">
          <div className="app-content">
            <div className="app-text">
              <div className="extern-login">Invalid token</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExternLogin;
