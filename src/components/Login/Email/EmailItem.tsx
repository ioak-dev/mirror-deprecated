import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import OakText from '../../../oakui/OakText';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import { NEW_EMAIL_SESSION } from '../../Types/schema';

interface Props {
  history: any;
  tokenLogin: Function;
  newAccount: Function;
}

const EmailItem = (props: Props) => {
  const gqlClient = useApolloClient();
  const [state, setState] = useState({ email: '' });
  const [formErrors, setFormErrors] = useState<any>({
    email: '',
  });

  const [message, setMessage] = useState(false);

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const login = async () => {
    const errorFields: any = { email: '' };

    if (isEmptyOrSpaces(state.email)) {
      errorFields.email = 'Email cannot be empty';
    }
    if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        state.email.trim().toLowerCase()
      )
    ) {
      errorFields.email = 'Invalid email';
    }
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      const { data } = await gqlClient.query({
        query: NEW_EMAIL_SESSION,
        variables: { email: state.email },
      });
      if (data?.newEmailSession) {
        console.log(data?.newEmailSession.sessionId);
        setMessage(!message);
      } else {
        props.newAccount();
      }
    }
  };

  const cancelLogin = () => {
    props.history.goBack();
  };

  return (
    <>
      {message && (
        <div className="typhography-4">
          Your authentication token is generated. Follow the instruction
          provided in the email or click on
          <div className="hyperlink" onClick={() => props.tokenLogin()}>
            Login with token
          </div>
        </div>
      )}
      {!message && (
        <div className="page-subtitle">
          <div className="browse-article-subtitle">
            <div className="hyperlink" onClick={() => props.tokenLogin()}>
              already have an auth key?
            </div>
          </div>
        </div>
      )}
      {!message && (
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
      )}
      {!message && (
        <OakText
          label="Email"
          data={state}
          errorData={formErrors}
          id="email"
          handleChange={e => handleChange(e)}
        />
      )}
    </>
  );
};

export default EmailItem;
