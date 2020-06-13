import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';
import { sendMessage } from '../../../events/MessageService';
import { AssetPayload, AssetAdditionPayload } from '../../../types/graphql';
import OakButton from '../../../oakui/OakButton';
import OakText from '../../../oakui/OakText';

interface Props {
  history: any;
}

const CREATE_ASSET = gql`
  mutation createAsset(
    $payload: AssetPayload!
    $addition: AssetAdditionPayload!
  ) {
    createAsset(payload: $payload, addition: $addition) {
      id
    }
  }
`;

const CreateItem = (props: Props) => {
  const [stage, setStage] = useState('assetdetails');
  const [createAsset, { data: savedAsset }] = useMutation(CREATE_ASSET);
  const [state, setState] = useState<any>({
    name: '',
    description: '',
    email: '',
    jwtPassword: '',
  });
  const [formErrors, setFormErrors] = useState<any>({
    name: '',
    description: '',
    email: '',
    jwtPassword: '',
  });
  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const submit = event => {
    event.preventDefault();
    const errorFields: any = {
      name: '',
      description: '',
      email: '',
      jwtPassword: '',
    };
    if (isEmptyOrSpaces(state.name)) {
      errorFields.name = 'Name cannot be empty';
    }
    if (isEmptyOrSpaces(state.description)) {
      errorFields.description = 'Description cannot be empty';
    }
    if (isEmptyOrSpaces(state.email)) {
      errorFields.email = 'Email cannot be empty';
    }
    if (isEmptyOrSpaces(state.jwtPassword)) {
      errorFields.jwtPassword = 'JWT Password cannot be empty';
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
      const payload: AssetPayload = {
        name: state.name,
        description: state.description,
        jwtPassword: state.jwtPassword,
      };
      const addition: AssetAdditionPayload = {
        email: state.email.trim().toLowerCase(),
      };
      createAsset({
        variables: {
          payload,
          addition,
        },
      })
        .then((response: any) => {
          if (response.data.createAsset.id) {
            setStage('created');
            sendMessage('login-notification', true, {
              type: 'main',
              message:
                'Your asset has been setup. Token details will be sent to your email. Please check your email for further instructions',
            });
          } else {
            sendMessage('notification', true, {
              type: 'failure',
              message: 'Unknown error',
            });
          }
        })
        .finally(() => {
          setFormErrors(errorFields);
          sendMessage('spinner', false);
        });
    } else {
      setFormErrors(errorFields);
      sendMessage('spinner', false);
    }
  };
  const cancelCreation = () => {
    props.history.goBack();
  };

  const handleSubmit = event => {
    if (stage === 'assetdetails') {
      submit(event);
    }
  };

  return (
    <form method="GET" onSubmit={handleSubmit} noValidate className="asset">
      {stage === 'assetdetails' && (
        <div className="page-header">
          <div className="page-title">
            Create Asset
            <div className="page-highlight" />
          </div>
          {stage === 'assetdetails' && (
            <div className="action-header position-right">
              <OakButton action={submit} theme="primary" variant="appear">
                <i className="material-icons">double_arrow</i>Save
              </OakButton>
              {props.history.length > 2 && (
                <OakButton
                  action={() => cancelCreation()}
                  theme="default"
                  variant="appear"
                >
                  <i className="material-icons">close</i>Cancel
                </OakButton>
              )}
            </div>
          )}
        </div>
      )}
      <div className="create-article-item">
        <div className="user-form">
          <OakText
            label="Asset Name"
            data={state}
            errorData={formErrors}
            id="name"
            handleChange={e => handleChange(e)}
          />
          <OakText
            label="Description"
            data={state}
            errorData={formErrors}
            id="description"
            multiline
            handleChange={e => handleChange(e)}
          />
          <OakText
            label="Email"
            data={state}
            errorData={formErrors}
            id="email"
            handleChange={e => handleChange(e)}
          />
          <div className="typography-3">
            This email is used for sending first time login information with
            Administrative rights to this asset. You will be sent with a login
            token that you can use to setup the asset. You can add more
            administrator accounts once you login with the provided link.
          </div>

          <OakText
            label="JWT Password"
            data={state}
            errorData={formErrors}
            id="jwtPassword"
            handleChange={e => handleChange(e)}
          />
          <div className="typography-3">
            Make a note of this password. You need this password to setup
            redirection from your host application. This is the password that is
            used to securely transmit or redirect user information from host
            application to mirror. Use this password in your host application
            while creating a JWT token to transmit information to mirror.
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateItem;
