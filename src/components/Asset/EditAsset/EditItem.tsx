import React, { useState, useEffect } from 'react';
import './style.scss';
import { useMutation } from '@apollo/react-hooks';
import OakText from '../../../oakui/OakText';
import OakButton from '../../../oakui/OakButton';
import { isEmptyOrSpaces, isEmptyAttributes } from '../../Utils';

import { AssetPayload, Asset } from '../../../types/graphql';

import { UPDATE_ASSET } from '../../Types/schema';
import OakHeading from '../../../oakui/OakHeading';

interface Props {
  id: string;
  history: any;
  asset: string;
  assetData: Asset;
}

const EditItem = (props: Props) => {
  const [updateAsset] = useMutation(UPDATE_ASSET);
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
        name: props.assetData.name,
        description: props.assetData.description,
        productionMode: props.assetData.productionMode,
        jwtPassword: props.assetData.jwtPassword,
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
    setFormErrors(errorFields);
    if (isEmptyAttributes(errorFields)) {
      const payload: AssetPayload = {
        id: props.assetData.id,
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
      id: props.assetData.id,
      productionMode: !state.productionMode,
    };
    updateAsset({
      variables: {
        payload,
      },
    }).then(response => {
      if (response.data.updateAsset.id) {
        props.history.goBack();
      }
    });
  };

  return (
    <>
      <div className="page-header">
        {props.asset && (
          <OakHeading
            title={
              <div className="align-horizontal">
                Edit asset
                <div className="asset-status-container space-left-1 typography-4">
                  {!state.productionMode && (
                    <div className="asset-status down">down</div>
                  )}
                  {state.productionMode && (
                    <div className="asset-status live">live</div>
                  )}
                </div>
              </div>
            }
          >
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
          </OakHeading>
        )}
        {props.assetData && (
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
      {!props.assetData && (
        <div className="typography-6">Asset does not exist</div>
      )}
    </>
  );
};
export default EditItem;
