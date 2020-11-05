import { BACKUP, LOCAL, REMOTE } from '../../../../src/enum';
import { BackupOptions } from '../../../../src/interfaces';

export interface BackupInfo {
  last: string;
  next: string;
  options: BackupOptions;
  remoteStatus: REMOTE;
  localStatus: LOCAL;
  backupStatus: BACKUP;
}
