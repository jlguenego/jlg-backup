export interface BackupOptions {
  $schema?: string;
  port?: number;
  local?: string;
  remote?: string;
  intervalInSecond?: number;
  sh?: string;
}
