import { BACKUP, LOCAL, REMOTE } from "./enum";

export interface BackupOptions {
  $schema: string;
  port: number;
  local: string;
  remote: string;
  intervalInSecond: number;
  sh: string;
  git: GitOptions;
}

export interface BackupMessage {
  backuping?: boolean;
  message: string;
}

export interface GitOptions {
  user?: GitUserOptions;
}

export interface GitUserOptions {
  email: string;
  name: string;
}

export interface BackupInfo {
  last: string;
  next: string;
  options: Partial<BackupOptions>;
  remoteStatus: REMOTE;
  localStatus: LOCAL;
  backupStatus: BACKUP;
}
