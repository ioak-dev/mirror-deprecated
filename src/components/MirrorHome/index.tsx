/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { MirrorRecordFieldDef } from '../../types/MirrorRecordFieldDef';
import './style.scss';
import TableView from './TableView';
import { MirrorRecordModel } from '../../types/MirrorRecordModel';
import { MirrorConfig } from '../../types/MirrorConfigType';

interface Props {
  criteria: any;
  slots: any;
  config: MirrorConfig;
  records: MirrorRecordModel[];
  handleRecordClick?: Function;
}

const MirrorHome = (props: Props) => {
  return (
    <div className="mirror-home">
      <TableView
        config={props.config}
        records={props.records}
        handleRecordClick={props.handleRecordClick}
      />
    </div>
  );
};

export default MirrorHome;
