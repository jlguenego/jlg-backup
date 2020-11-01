import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  constructor(private http: HttpClient) {}

  backup(): void {
    this.http.get<void>('/ws/backup').subscribe({
      next: () => {
        console.log('backup done');
      },
      error: (error) => {
        console.log('error: ', error);
      },
      complete: () => console.log('complete'),
    });
  }
}
