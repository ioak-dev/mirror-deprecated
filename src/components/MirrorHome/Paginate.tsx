import React, { useEffect, useState } from 'react';
import * as CSS from 'csstype';
import './Paginatestyle.scss';
import { PaginatePref } from '../../types/PaginatePref';

interface Props {
  totalRows: number;
  pagePref: PaginatePref;
  pageChanged: Function;
}

function Paginate(props: Props) {
  const [pagePref, setPagePref] = useState(props.pagePref);

  useEffect(() => {
    setPagePref(props.pagePref);
  }, [props.pagePref]);

  const style: CSS.Properties = {
    width: '24',
    height: '24',
  };

  const rowsPerPageVariants = [5, 10, 20, 50];

  const pageChanged = (pagePref: PaginatePref) => {
    console.log('in child pagechanged', pagePref);
    props.pageChanged(pagePref);
  };

  const previousPage = () => {
    if (pagePref.pageNo !== 1) {
      pageChanged({
        ...pagePref,
        pageNo: pagePref.pageNo - 1,
      });
    }
  };

  const nextPage = () => {
    if (Math.ceil(props.totalRows / pagePref.rowsPerPage) !== pagePref.pageNo) {
      pageChanged({
        ...pagePref,
        pageNo: pagePref.pageNo + 1,
      });
    }
  };

  const currentPageStart = () => {
    return (pagePref.pageNo - 1) * pagePref.rowsPerPage + 1;
  };

  const currentPageEnd = () => {
    return pagePref.pageNo * pagePref.rowsPerPage < props.totalRows
      ? pagePref.pageNo * pagePref.rowsPerPage
      : props.totalRows;
  };

  const onRowsPerPageChange = (event: any) => {
    const firstItemNoInCurrentView =
      (pagePref.pageNo - 1) * pagePref.rowsPerPage + 1;
    pageChanged({
      ...pagePref,
      rowsPerPage: Number(event.target.value),
      pageNo: Math.ceil(firstItemNoInCurrentView / event.target.value),
    });
  };

  return (
    <div className="paginate-container">
      <span className="rows-per-page">rows per page</span>
      <span>
        <select
          value={pagePref.rowsPerPage}
          onChange={onRowsPerPageChange}
          name="rowsPerPage"
          className="select"
        >
          {rowsPerPageVariants.map((rowsPerPage) => (
            <option key={rowsPerPage} value={rowsPerPage}>
              {rowsPerPage}
            </option>
          ))}
        </select>
      </span>
      <span>
        <button className="size-xsmall" onClick={previousPage}>
          <svg
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={style}
          >
            <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
          </svg>
        </button>
        <span className="rows-per-page">
          rows{' '}
          {`${currentPageStart()}-${currentPageEnd()} of ${props.totalRows}`}
        </span>
        <button className="size-xsmall" onClick={nextPage}>
          <svg
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            style={style}
          >
            <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
          </svg>
        </button>
      </span>
    </div>
  );
}

export default Paginate;
