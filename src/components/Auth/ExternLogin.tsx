import React, { useState, useEffect } from 'react';
import './Login.scss';
import { useApolloClient } from '@apollo/react-hooks';

import { NEW_EXTERN_SESSION } from '../Types/schema';
import OakPage from '../../oakui/OakPage';
import OakSection from '../../oakui/OakSection';

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
      variables: { token, asset: props.asset },
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
        <OakPage>
          <OakSection>
            <div className="extern-login">Invalid token</div>
          </OakSection>
        </OakPage>
      )}
    </>
  );
};

export default ExternLogin;
