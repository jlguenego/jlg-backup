import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';

import { BackupInfo } from '../interfaces/backup-info';
import { BackupMessage, BackupOptions } from '../../../../src/interfaces';
import { BACKUP, LOCAL } from '../../../../src/enum';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private socket$ = new WebSocketSubject<BackupMessage>('ws://localhost:55555');
  backupInfo$ = new BehaviorSubject<BackupInfo>({
    last: '1970-01-01',
    next: '1970-01-01',
    options: {},
    localStatus: LOCAL.INIT,
    localStatus: LOCAL.INIT,
    backupStatus: BACKUP.OK,
  });

  backuping = false;

  constructor(private http: HttpClient) {
    this.refresh();
    this.socket$.subscribe(
      (bkpmsg) => {
        console.log('bkpmsg: ', bkpmsg);
        this.backuping = bkpmsg.backuping;
      },
      (error) => {
        console.error('error: ', error);
      },
      () => console.log('webscoket complete')
    );
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
    this.backuping = true;
    this.http
      .get<BackupInfo>('/ws/backup')
      .pipe(delay(0))
      .subscribe({
        next: (backupInfo) => {
          this.backuping = false;
          this.backupInfo$.next(backupInfo);
        },
        error: (error) => {
          this.backuping = false;
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
