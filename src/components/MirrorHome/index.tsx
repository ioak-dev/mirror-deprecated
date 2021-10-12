/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { MirrorConfig } from '../../types/MirrorConfigType';
import './style.scss';

interface Props {
  criteria: any;
  slots: any;
  config?: MirrorConfig;
}

const MirrorHome = (props: Props) => {
  return (
    <div className="mirror-home">
      Test message - {props.config?.message || 'Welcome to Mirror Application'}
    </div>
  );
};

export default MirrorHome;
