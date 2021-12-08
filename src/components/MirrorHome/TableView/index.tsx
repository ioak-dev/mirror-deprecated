import React from 'react';
import './style.scss';
import { MirrorRecordFieldDef } from '../../../types/MirrorRecordFieldDef';
import { MirrorRecordModel } from '../../../types/MirrorRecordModel';

interface Props {
  config: MirrorRecordFieldDef[];
  rows: MirrorRecordModel[];
}

const TableView = (props: Props) => {
  return (
    <>
      <table cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            {props.config &&
              props.config.map((header) => (
                <th key={header.field}>{header.headerName}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row: any) => (
            <tr key={row.id}>
              {props.config.map((header) => (
                <td key={header.field}>{row[header.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableView;
