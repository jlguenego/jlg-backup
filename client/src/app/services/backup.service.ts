import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';

import {
  BackupInfo,
  BackupMessage,
  BackupOptions,
  BackupStatus,
} from '../../../../src/interfaces';
import { LOCAL, REMOTE } from '../../../../src/enum';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private socket$ = new WebSocketSubject<BackupMessage>('ws://localhost:55555');
  backupInfo$ = new BehaviorSubject<BackupInfo>({
    last: '1970-01-01',
    next: '1970-01-01',
    options: {},
    remoteStatus: REMOTE.INIT,
    localStatus: LOCAL.INIT,
    backupStatus: { backuping: false },
  });

  backupStatus$ = new BehaviorSubject<BackupStatus>({
    backuping: false,
  });

  constructor(private http: HttpClient) {
    this.refresh();
    this.socket$.subscribe(
      (bkpmsg) => {
        console.log('bkpmsg: ', bkpmsg);
        if (bkpmsg.backupStatus) {
          this.backupStatus$.next(bkpmsg.backupStatus);
        }
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
    this.backupStatus$.next({
      backuping: true,
      total: 0,
      processed: 0,
    });
    this.http
      .get<BackupInfo>('/ws/backup')
      .pipe(delay(0))
      .subscribe({
        next: (backupInfo) => {
          this.backupStatus$.next({
            backuping: false,
            total: this.backupStatus$.value.total,
            processed: this.backupStatus$.value.processed,
          });
          this.backupInfo$.next(backupInfo);
        },
        error: (error) => {
          this.backupStatus$.next({
            backuping: false,
            total: this.backupStatus$.value.total,
            processed: this.backupStatus$.value.processed,
          });
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
