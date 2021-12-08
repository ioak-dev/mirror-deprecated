export type MirrorRecordFieldDef = {
  field: string;
  headerName?: string;
  handleClick?: Function;
  description?: string;
  width?: number;
  flex?: number;
  minWidth?: number;
  hide?: boolean;
  sortable?: boolean;
  resizable?: boolean;
  editable?: boolean;
  type?: 'string' | 'number' | 'date' | 'dateTime' | 'boolean';
};
