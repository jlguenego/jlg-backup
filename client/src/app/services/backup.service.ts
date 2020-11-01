import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackupInfo } from '../interfaces/backup-info';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  next$ = new BehaviorSubject<Date>(undefined);
  last$ = new BehaviorSubject<Date>(undefined);

  constructor(private http: HttpClient) {
    this.refresh();
  }

  refresh(): void {
    this.http.get<BackupInfo>('/ws/info').subscribe({
      next: (backupInfo) => {
        console.log('backupInfo: ', backupInfo);
        this.next$.next(new Date(backupInfo.next));
        this.last$.next(new Date(backupInfo.last));
      },
      error: (error) => {
        console.error('error: ', error);
      },
      complete: () => console.log('complete'),
    });
  }

  backup(): void {
    this.http.get<BackupInfo>('/ws/backup').subscribe({
      next: (backupInfo) => {
        console.log('backupInfo: ', backupInfo);
        this.next$.next(new Date(backupInfo.next));
        this.last$.next(new Date(backupInfo.last));
      },
      error: (error) => {
        console.error('error: ', error);
      },
      complete: () => console.log('complete'),
    });
  }
}
