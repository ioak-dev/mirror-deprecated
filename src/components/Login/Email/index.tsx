import React, { useState, useEffect } from 'react';
import EmailItem from './EmailItem';
import AccountItem from './AccountItem';
import TokenItem from './TokenItem';

interface Props {
  history: any;
  location: any;
  asset: string;
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
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <div className="view-asset-item">
            <div className="page-title">Login Details</div>
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
              />
            )}
            {state.type === 'new' && (
              <AccountItem history={props.history} emailLogin={emailLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;
