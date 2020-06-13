import React from 'react';
import { Asset } from '../../../types/graphql';
import OakViewer from '../../../oakui/OakViewer';

interface Props {
  history: any;
  asset: Asset;
}

const ViewItem = (props: Props) => {
  const editAsset = () => {
    props.history.push(`/${props.asset.assetId}/asset/edit`);
  };

  const deleteAssetPrompt = () => {
    console.log('To Be implemented');
  };
  return (
    <>
      {props.asset && (
        <div className="view-asset-item">
          <div className="page-title">
            Asset details
            <div className="page-subtitle">
              <div className="asset-item-actions typography-5">
                <div className="align-horizontal hyperlink-container">
                  <i className="material-icons typography-6">edit</i>
                  <div className="hyperlink" onClick={editAsset}>
                    Edit
                  </div>
                </div>
                <div className="align-horizontal hyperlink-container">
                  <i className="material-icons typography-6">delete_outline</i>
                  <div className="hyperlink" onClick={deleteAssetPrompt}>
                    Delete
                  </div>
                </div>
              </div>
            </div>
            <div className="page-highlight" />
          </div>
          <div className="page-title">{props.asset.name}</div>
          <OakViewer>{props.asset.description}</OakViewer>
        </div>
      )}
      {!props.asset && <div className="typography-6">Asset does not exist</div>}
    </>
  );
};

export default ViewItem;
