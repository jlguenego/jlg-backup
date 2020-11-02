import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackupInfo } from '../interfaces/backup-info';
import { BehaviorSubject } from 'rxjs';
import { BackupOptions } from '../../../../src/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  backupInfo$ = new BehaviorSubject<BackupInfo>(undefined);

  constructor(private http: HttpClient) {
    this.refresh();
  }

  refresh(): void {
    this.http.get<BackupInfo>('/ws/info').subscribe({
      next: (backupInfo) => {
        console.log('backupInfo: ', backupInfo);
        this.backupInfo$.next(backupInfo);
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
        this.backupInfo$.next(backupInfo);
      },
      error: (error) => {
        console.error('error: ', error);
      },
      complete: () => console.log('complete'),
    });
  }

  update(backupOptions: BackupOptions): void {
    this.http.put<BackupInfo>('/ws/backup-options', backupOptions).subscribe({
      next: (backupInfo) => {
        console.log('backupInfo: ', backupInfo);
        this.backupInfo$.next(backupInfo);
      },
      error: (error) => {
        console.error('error: ', error);
      },
      complete: () => console.log('complete'),
    });
  }
}
