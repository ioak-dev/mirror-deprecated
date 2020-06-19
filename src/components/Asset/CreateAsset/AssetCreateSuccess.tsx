import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ASSET } from '../../Types/schema';
import OakViewer from '../../../oakui/OakViewer';

interface Props {
  location: any;
  search: string;
}
const queryString = require('query-string');

const AssetCreateSuccess = (props: Props) => {
  const { loading, error, data } = useQuery(GET_ASSET, {
    variables: {
      assetId: queryString.parse(props.location.search).id,
    },
  });

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <div className="view-asset-item">
            <div className="page-title">
              Asset details
              <div className="page-highlight" />
            </div>
            {!loading && !error && (
              <>
                <div className="typography-5 align-horizontal">
                  Asset Id:
                  <OakViewer>{data.asset.assetId}</OakViewer>
                </div>

                <div className="typography-5 align-horizontal">
                  Asset Name:
                  <OakViewer>{data.asset.name}</OakViewer>
                </div>

                <div className="typography-5 ">
                  Asset Description:
                  <OakViewer>{data.asset.description}</OakViewer>
                </div>
                <div className="typography-5 align-horizontal">
                  JWT Password:
                  <OakViewer>{data.asset.jwtPassword}</OakViewer>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCreateSuccess;
