import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { NavLink } from 'react-router-dom';
import OakButton from '../../oakui/OakButton';
import { LIST_ASSETS } from '../Types/schema';
import OakSpinner from '../../oakui/OakSpinner';
import AssetItem from './AssetItem';

interface Props {
  history: any;
}

const Landing = (props: Props) => {
  const { loading, error, data } = useQuery(LIST_ASSETS);
  const [showAssets, setShowAssets] = useState(false);
  return (
    <div className="landing">
      <div className="landing--action">
        <div className="action-header position-center">
          <NavLink
            to="/asset/create"
            className="navitem"
            activeClassName="active"
          >
            <OakButton theme="primary" variant="disappear">
              Create a new asset
            </OakButton>
          </NavLink>
        </div>
        {/* <span>or</span> */}
        <div className="hyperlink" onClick={() => setShowAssets(!showAssets)}>
          {`${showAssets ? 'Hide ' : 'Show '} all assets`}
        </div>
      </div>
      {loading && showAssets && <OakSpinner />}
      {!loading && !error && showAssets && (
        <div className="landing--asset-list">
          {data?.assets?.map(asset => (
            <AssetItem asset={asset} history={props.history} />
          ))}
          {data?.assets?.map(asset => (
            <AssetItem asset={asset} history={props.history} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Landing;
