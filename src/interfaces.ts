export interface AdminServerOptions extends BackupOptions {
  port: number;
}

export interface BackupOptions {
  local: string;
  remote: string;
}
