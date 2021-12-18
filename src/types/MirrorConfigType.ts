import { MirrorRecordFieldDef } from './MirrorRecordFieldDef';
import { PaginatePref } from './PaginatePref';

export type MirrorConfig = {
  // message?: string;
  fieldDef: MirrorRecordFieldDef[];
  handleRecordClick?: Function;
  paginationPreference?: PaginatePref;
  onChangeSearch: boolean;
  pageChanged?: Function;
  totalRows: number;
};
