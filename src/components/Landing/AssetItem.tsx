import React from 'react';
import './style.scss';
import { Asset } from '../../types/graphql';

interface Props {
  asset: Asset;
  history: any;
}

const AssetItem = (props: Props) => {
  const goToAssetPage = () => {
    props.history.push(`/${props.asset.assetId}/login/home`);
  };
  return (
    <div className="asset-list-item">
      <div className="asset-list-item--link">
        <div className="typography-6 hyperlink-drama" onClick={goToAssetPage}>
          {props.asset.name}
        </div>
      </div>
      <div className="typography-4">{props.asset.description}</div>
    </div>
  );
};

export default AssetItem;
