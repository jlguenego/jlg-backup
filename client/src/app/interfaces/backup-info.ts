import { BACKUP, LOCAL } from '../../../../src/enum';
import { BackupOptions } from '../../../../src/interfaces';

export interface BackupInfo {
  last: string;
  next: string;
  options: BackupOptions;
  localStatus: LOCAL;
  backupStatus: BACKUP;
}
