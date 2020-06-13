import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ASSET } from '../../Types/schema';
import EditItem from './EditItem';

interface Props {
  match: any;
  history: any;
  space: string;
  location: string;
}

const EditAsset = (props: Props) => {
  const { loading, error, data } = useQuery(GET_ASSET, {
    variables: {
      assetId: props.match.params.asset,
    },
  });

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          {!loading && !error && (
            <EditItem
              space={props.space}
              history={props.history}
              id={props.match.params.asset}
              asset={data.asset}
            />
          )}
          {error && <div className="typography-6">Asset does not exist</div>}
        </div>
      </div>
    </div>
  );
};

export default EditAsset;
