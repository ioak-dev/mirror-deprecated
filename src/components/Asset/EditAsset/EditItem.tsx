import React, { useState, useEffect } from 'react';
import './style.scss';
import { useMutation } from '@apollo/react-hooks';
import OakText from '../../../oakui/OakText';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';

import { AssetPayload, Asset } from '../../../types/graphql';

import { UPDATE_ASSET } from '../../Types/schema';

interface Props {
  id: string;
  history: any;
  space: string;
  asset: Asset;
}

const EditItem = (props: Props) => {
  const [updateAsset, { data: updatedAsset }] = useMutation(UPDATE_ASSET);
  const [state, setState] = useState<any>({
    id: '',
    name: '',
    description: '',
    jwtPassword: '',
    productionMode: '',
  });
  const [formErrors, setFormErrors] = useState<any>({
    id: '',
    name: '',
    description: '',
    jwtPassword: '',
  });

  useEffect(() => {
    if (props.asset) {
      setState({
        id: props.id,
        name: props.asset.name,
        description: props.asset.description,
        productionMode: props.asset.productionMode,
        jwtPassword: props.asset.jwtPassword,
      });
    }
  }, []);

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const update = async () => {
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
        id: props.asset.id,
        name: state.name,
        description: state.description,
        jwtPassword: state.jwtPassword,
        productionMode: state.productionMode,
      };
      updateAsset({
        variables: {
          payload,
        },
      }).then(response => {
        if (props.history.length > 2) props.history.goBack();
      });
    }
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  const changeMode = () => {
    const payload: AssetPayload = {
      id: props.asset.id,
      productionMode: !state.productionMode,
    };
    updateAsset({
      variables: {
        payload,
      },
    }).then(response => {
      if (response.data.updateAsset.id) {
        props.history.go();
      }
    });
  };

  return (
    <>
      <div className="page-header">
        {props.asset && (
          <div className="page-title">
            <div className="align-horizontal">
              Edit Asset
              <div className="asset-status-container space-left-1 typography-4">
                {!state.productionMode && (
                  <div className="asset-status down">down</div>
                )}
                {state.productionMode && (
                  <div className="asset-status live">live</div>
                )}
              </div>
            </div>
            <div className="page-subtitle">
              {!state.productionMode && (
                <div className="align-horizontal">
                  To activate asset, &nbsp;
                  <div className="hyperlink" onClick={changeMode}>
                    turn on production mode
                  </div>
                </div>
              )}
              {state.productionMode && (
                <div className="align-horizontal">
                  To activate asset, &nbsp;
                  <div className="hyperlink" onClick={changeMode}>
                    turn off production mode
                  </div>
                </div>
              )}
            </div>

            <div className="page-highlight" />
          </div>
        )}
        {props.asset && (
          <div className="action-header position-right">
            <OakButton action={update} theme="primary" variant="appear">
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

      {props.asset && (
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
              handleChange={handleChange}
            />
            <OakText
              label="JWTPassword"
              data={state}
              errorData={formErrors}
              id="jwtPassword"
              type="password"
              handleChange={e => handleChange(e)}
            />
          </div>
        </div>
      )}
      {!props.asset && <div className="typography-6">Asset does not exist</div>}
    </>
  );
};
export default EditItem;
