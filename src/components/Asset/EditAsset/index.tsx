import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ASSET } from '../../Types/schema';
import EditItem from './EditItem';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';

interface Props {
  match: any;
  history: any;
  asset: string;
  location: string;
}

const EditAsset = (props: Props) => {
  const { loading, error, data } = useQuery(GET_ASSET, {
    variables: {
      assetId: props.match.params.asset,
    },
  });

  return (
    <OakPage>
      <OakSection>
        {!loading && !error && (
          <EditItem
            asset={props.asset}
            history={props.history}
            id={props.match.params.asset}
            assetData={data.asset}
          />
        )}
        {error && <div className="typography-6">Asset does not exist</div>}
      </OakSection>
    </OakPage>
  );
};

export default EditAsset;
