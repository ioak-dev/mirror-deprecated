import { MirrorRecordFieldDef } from './MirrorRecordFieldDef';
import { PaginatePref } from './PaginatePref';

export type MirrorConfig = {
  // message?: string;
  fieldDef: MirrorRecordFieldDef[];
  handleRecordClick?: Function;
  serverSidePagination?: boolean;
  paginationPreference?: PaginatePref;
  pageChanged?: Function;
  totalRows: number;
};
