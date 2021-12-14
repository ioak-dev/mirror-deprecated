import React, { useEffect, useState } from 'react';
import './style.scss';
import { MirrorRecordFieldDef } from '../../../types/MirrorRecordFieldDef';
import { MirrorRecordModel } from '../../../types/MirrorRecordModel';
import { MirrorConfig } from '../../../types/MirrorConfigType';
import Paginate from '../Paginate';
import { PaginatePref } from '../../../types/PaginatePref';

interface Props {
  config: MirrorConfig;
  records: MirrorRecordModel[];
  handleRecordClick?: Function;
}

const TableView = (props: Props) => {
  const { totalRows } = props.config;
  const [paginatePref, setPaginatePref] = useState({
    pageNo: 1,
    rowsPerPage: 5,
    searchText: '',
  });

  const [recordToDisplay, setRecordToDisplay] = useState<MirrorRecordModel[]>(
    []
  );

  useEffect(() => {
    props.config.paginationPreference &&
      setPaginatePref({
        ...props.config.paginationPreference,
      });
  }, [props.config.paginationPreference]);

  useEffect(() => {
    if (!props.config.pageChanged || props.config.paginationPreference) {
      applyPagination(paginatePref);
    } else {
      setRecordToDisplay(props.records);
    }
  }, [props.records]);

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

  const pageChanged = (_paginatePref: PaginatePref) => {
    console.log(_paginatePref);
    if (props.config.pageChanged && props.config.paginationPreference) {
      props.config.pageChanged(_paginatePref);
    } else {
      applyPagination(_paginatePref);
      setPaginatePref({ ..._paginatePref });
    }
  };

  const applyPagination = (_paginatePref: PaginatePref) => {
    if (props.records === null || props.records === undefined) {
      return;
    }
    const pageFrom = (_paginatePref.pageNo - 1) * _paginatePref.rowsPerPage;
    const pageTo =
      _paginatePref.rowsPerPage +
      (_paginatePref.pageNo - 1) * _paginatePref.rowsPerPage;
    setRecordToDisplay(props.records.slice(pageFrom, pageTo));
  };

  return (
    <>
      <div>
        <slot name="grid" className="table__paginate">
          <Paginate
            totalRows={totalRows}
            pagePref={paginatePref}
            pageChanged={pageChanged}
          />
        </slot>

        <div>
          <slot name="grid">
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
                {recordToDisplay.map((record: any) => (
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
          </slot>
          <slot name="bottom" className="table__paginate">
            <Paginate
              totalRows={totalRows}
              pagePref={paginatePref}
              pageChanged={pageChanged}
            />
          </slot>
        </div>
      </div>
    </>
  );
};

export default TableView;
