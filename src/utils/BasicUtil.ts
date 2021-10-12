/* eslint-disable import/prefer-default-export */
import { v4 as uuidv4 } from 'uuid';

export function newId() {
  return `uid-${uuidv4()}`;
}
