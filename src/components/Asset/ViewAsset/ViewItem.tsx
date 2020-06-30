import React from 'react';
import { Asset } from '../../../types/graphql';
import OakViewer from '../../../oakui/OakViewer';
import OakHeading from '../../../oakui/OakHeading';

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
  const getHeadingLinks = () => {
    return [
      {
        label: 'Edit',
        icon: 'edit',
        action: () => editAsset(),
      },
      {
        label: 'Delete',
        icon: 'delete_outline',
        action: () => deleteAssetPrompt(),
      },
    ];
  };
  return (
    <>
      {props.asset && (
        <div className="view-asset-item">
          <OakHeading
            title="Asset detail"
            links={getHeadingLinks()}
            linkSize="large"
          />
          <div className="typography-8">{props.asset.name}</div>
          <OakViewer>{props.asset.description}</OakViewer>
        </div>
      )}
      {!props.asset && <div className="typography-6">Asset does not exist</div>}
    </>
  );
};

export default ViewItem;
