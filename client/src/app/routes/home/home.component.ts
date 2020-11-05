import { Component, OnInit } from '@angular/core';

import { BackupInfo } from 'src/app/interfaces/backup-info';
import { BackupService } from 'src/app/services/backup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  backupInfo: BackupInfo;

  constructor(public backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      this.backupInfo = backupInfo;
    });
  }

  ngOnInit(): void {}

  backup(): void {
    this.backupService.backup();
  }
}
