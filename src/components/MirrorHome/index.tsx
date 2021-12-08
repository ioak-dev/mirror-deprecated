/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { MirrorRecordFieldDef } from '../../types/MirrorRecordFieldDef';
import './style.scss';
import TableView from './TableView';
import { MirrorRecordModel } from '../../types/MirrorRecordModel';

interface Props {
  criteria: any;
  slots: any;
  config: MirrorRecordFieldDef[];
  rows: MirrorRecordModel[];
}

const MirrorHome = (props: Props) => {
  return (
    <div className="mirror-home">
      <TableView config={props.config} rows={props.rows} />
    </div>
  );
};

export default MirrorHome;
