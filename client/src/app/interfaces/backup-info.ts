import { BACKUP, LOCAL, REMOTE } from '../../../../src/enum';
import { BackupOptions } from '../../../../src/interfaces';

export interface BackupInfo {
  last: string;
  next: string;
  options: Partial<BackupOptions>;
  remoteStatus: REMOTE;
  localStatus: LOCAL;
  backupStatus: BACKUP;
}
