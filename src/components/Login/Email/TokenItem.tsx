import React, { useState, useEffect } from 'react';
import OakButton from '../../../oakui/OakButton';
import OakText from '../../../oakui/OakText';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';

interface Props {
  history: any;
  emailLogin: Function;
  asset: string;
  queryParam: any;
}
const TokenItem = (props: Props) => {
  const [state, setState] = useState({ token: '' });
  const [formErrors, setFormErrors] = useState<any>({
    token: '',
  });

  useEffect(() => {
    if (props.queryParam.auth_token) {
      console.log(props.queryParam.auth_token);
    }
  }, [props.queryParam]);

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const login = () => {
    const errorFields: any = { token: '' };

    if (isEmptyOrSpaces(state.token)) {
      errorFields.token = 'Token cannot be empty';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      props.history.push(
        `/${props.asset}/login/email?type=token&auth_token=${state.token}`
      );
    }
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  return (
    <>
      <div className="page-subtitle">
        <div className="browse-article-subtitle">
          <div className="hyperlink" onClick={() => props.emailLogin()}>
            Use email instead?
          </div>
        </div>
      </div>
      <div className="action-header position-right">
        <OakButton action={login} theme="primary" variant="appear">
          <i className="material-icons">double_arrow</i>Submit
        </OakButton>
        {props.history.length > 2 && (
          <OakButton
            action={() => cancelLogin()}
            theme="default"
            variant="appear"
          >
            <i className="material-icons">close</i>Cancel
          </OakButton>
        )}
      </div>
      <OakText
        label="Token"
        data={state}
        errorData={formErrors}
        id="token"
        handleChange={e => handleChange(e)}
      />
    </>
  );
};

export default TokenItem;
