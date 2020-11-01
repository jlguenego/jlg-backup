export interface AdminServerOptions extends BackupOptions {
  $schema?: string;
  port: number;
}

export interface BackupOptions {
  local: string;
  remote: string;
  intervalInSecond: number;
}
