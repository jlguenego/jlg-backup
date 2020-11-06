export interface BackupOptions {
  $schema?: string;
  port?: number;
  local?: string;
  intervalInSecond?: number;
  sh?: string;
}

export interface BackupMessage {
  backuping?: boolean;
  message: string;
}
