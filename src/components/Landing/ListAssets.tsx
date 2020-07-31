import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { LIST_ASSETS } from '../Types/schema';
import OakSpinner from '../../oakui/OakSpinner';
import AssetItem from './AssetItem';
import OakHeading from '../../oakui/OakHeading';

interface Props {
  history: any;
}

const ListAssets = (props: Props) => {
  const { loading, error, data } = useQuery(LIST_ASSETS);
  return (
    <div className="list-assets">
      <OakHeading title="Choose an asset to proceed" />
      {loading && <OakSpinner />}
      {!loading && !error && (
        <div className="list-assets--content">
          {data?.assets?.map(asset => (
            <AssetItem asset={asset} history={props.history} key={asset.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ListAssets;
