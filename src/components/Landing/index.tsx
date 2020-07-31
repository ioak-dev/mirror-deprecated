import React, { useState } from 'react';
import './style.scss';
import { NavLink } from 'react-router-dom';
import OakButton from '../../oakui/OakButton';
import OakSpinner from '../../oakui/OakSpinner';
import AssetItem from './AssetItem';
import ListAssets from './ListAssets';
import GettingStarted from './GettingStarted';

interface Props {
  history: any;
}

const Landing = (props: Props) => {
  return (
    <div className="landing">
      <ListAssets history={props.history} />
      <hr />
      <GettingStarted history={props.history} />
    </div>
  );
};

export default Landing;
