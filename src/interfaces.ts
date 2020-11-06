export interface BackupOptions {
  $schema?: string;
  port?: number;
  local?: string;
  intervalInSecond?: number;
  sh?: string;
  git?: GitOptions;
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
