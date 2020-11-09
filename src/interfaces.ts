import { LOCAL, REMOTE } from "./enum";

export type dirPath = string;
export type filePath = string;

export interface BackupOptions {
  $schema: string;
  port: number;
  local: dirPath;
  remote: dirPath;
  intervalInSecond: number;
  sh: filePath;
  git: GitOptions;
}

export interface BackupMessage {
  backupStatus: BackupStatus;
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
  backupStatus: BackupStatus;
}

export interface BackupStatus {
  backuping: boolean;
  total?: number;
  processed?: number;
}
