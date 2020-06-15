import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { GET_ASSET } from '../../Types/schema';
import OakSpinner from '../../../oakui/OakSpinner';
import ViewItem from './ViewItem';

interface Props {
  location: any;
  history: any;
  asset: string;
  match: any;
}

const ViewAsset = (props: Props) => {
  const { loading, error, data } = useQuery(GET_ASSET, {
    variables: {
      assetId: props.match.params.asset,
    },
  });
  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          {loading && <OakSpinner />}
          {!loading && !error && (
            <ViewItem history={props.history} asset={data.asset} />
          )}
          {error && <div className="typography-6">Asset does not exist</div>}
        </div>
      </div>
    </div>
  );
};

export default ViewAsset;
