import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { LIST_ASSETS } from '../../Types/schema';
import OakSpinner from '../../../oakui/OakSpinner';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import OakAutoComplete from '../../../oakui/OakAutoComplete';
import OakChipGroup from '../../../oakui/OakChipGroup';

const ListAssets = () => {
  const { loading, error, data } = useQuery(LIST_ASSETS);

  return (
    <OakPage>
      <OakSection>
        <h1 className="typhography-7 space-bottom-4">Available Assets</h1>
        {loading && <OakSpinner />}
        {!loading &&
          !error &&
          data?.assets?.map(item => (
            <div key={item.id}>
              <ul>
                <li>
                  {item.name} - {item.assetId}
                </li>
              </ul>
            </div>
          ))}
        {error && <div className="typography-6">Asset does not exist</div>}
      </OakSection>
    </OakPage>
  );
};

export default ListAssets;
