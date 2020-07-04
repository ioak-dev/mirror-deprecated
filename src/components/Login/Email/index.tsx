import React, { useState, useEffect } from 'react';
import EmailItem from './EmailItem';
import AccountItem from './AccountItem';
import TokenItem from './TokenItem';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';

interface Props {
  history: any;
  location: any;
  asset: string;
  cookies: any;
}

const queryString = require('query-string');

const Email = (props: Props) => {
  const [state, setState] = useState({ type: 'email' });
  const [queryParam, setQueryParam] = useState<any>({});

  useEffect(() => {
    const query = queryString.parse(props.location.search);
    query.type ? setState({ type: query.type }) : setState({ type: 'email' });
    setQueryParam(query);
  }, [props.location.search]);

  const emailLogin = () => {
    props.history.push(`/${props.asset}/login/email?type=email`);
  };

  const tokenLogin = () => {
    props.history.push(`/${props.asset}/login/email?type=token`);
  };

  const newAccount = () => {
    props.history.push(`/${props.asset}/login/email?type=new`);
  };

  return (
    <OakPage>
      <OakSection>
        <div className="view-asset-item">
          {state.type === 'email' && (
            <EmailItem
              history={props.history}
              tokenLogin={tokenLogin}
              newAccount={newAccount}
            />
          )}
          {state.type === 'token' && (
            <TokenItem
              history={props.history}
              emailLogin={emailLogin}
              asset={props.asset}
              queryParam={queryParam}
              cookies={props.cookies}
            />
          )}
          {state.type === 'new' && (
            <AccountItem history={props.history} emailLogin={emailLogin} />
          )}
        </div>
      </OakSection>
    </OakPage>
  );
};

export default Email;
