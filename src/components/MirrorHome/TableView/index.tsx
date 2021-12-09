import React, { useState } from 'react';
import './style.scss';
import { MirrorRecordFieldDef } from '../../../types/MirrorRecordFieldDef';
import { MirrorRecordModel } from '../../../types/MirrorRecordModel';
import { MirrorConfig } from '../../../types/MirrorConfigType';

interface Props {
  config: MirrorConfig;
  records: MirrorRecordModel[];
  handleRecordClick?: Function;
}

const TableView = (props: Props) => {
  const handleClick = (
    field: MirrorRecordFieldDef,
    record: MirrorRecordModel
  ) => {
    if (field.handleClick) {
      field.handleClick(field, record);
    }
    if (props.handleRecordClick) {
      props.handleRecordClick(field, record);
    }
  };
  return (
    <>
      <table cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            {props.config &&
              props.config.fieldDef.map((header) => (
                <th key={header.field}>{header.headerName}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {props.records.map((record: any) => (
            <tr key={record.id}>
              {props.config.fieldDef.map((header) => (
                <td
                  role="presentation"
                  key={header.field}
                  onClick={() => handleClick(header, record)}
                >
                  {record[header.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableView;
