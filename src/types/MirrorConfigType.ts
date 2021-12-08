import { MirrorRecordFieldDef } from './MirrorRecordFieldDef';

export type MirrorConfig = {
  // message?: string;
  fieldDef: MirrorRecordFieldDef[];
  handleRecordClick?: Function;
};
