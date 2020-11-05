import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackupInfo } from '../interfaces/backup-info';
import { BehaviorSubject } from 'rxjs';
import { BackupOptions } from '../../../../src/interfaces';
import { BACKUP, LOCAL, REMOTE } from '../../../../src/enum';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  backupInfo$ = new BehaviorSubject<BackupInfo>({
    last: '1970-01-01',
    next: '1970-01-01',
    options: {},
    remoteStatus: REMOTE.INIT,
    localStatus: LOCAL.INIT,
    backupStatus: BACKUP.OK,
  });

  constructor(private http: HttpClient) {
    this.refresh();
  }

  refresh(): void {
    this.http.get<BackupInfo>('/ws/info').subscribe({
      next: (backupInfo) => {
        this.backupInfo$.next(backupInfo);
      },
      error: (error) => {
        console.error('error: ', error);
      },
    });
  }

  backup(): void {
    this.http.get<BackupInfo>('/ws/backup').subscribe({
      next: (backupInfo) => {
        this.backupInfo$.next(backupInfo);
      },
      error: (error) => {
        console.error('error: ', error);
      },
    });
  }

  update(backupOptions: BackupOptions): void {
    this.http.put<BackupInfo>('/ws/backup-options', backupOptions).subscribe({
      next: (backupInfo) => {
        this.backupInfo$.next(backupInfo);
      },
      error: (error) => {
        console.error('error: ', error);
      },
    });
  }
}
