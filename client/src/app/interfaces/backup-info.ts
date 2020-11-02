import { BackupOptions } from '../../../../src/interfaces';

export interface BackupInfo {
  last: string;
  next: string;
  options: BackupOptions;
}
