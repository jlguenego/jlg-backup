import { Component, OnInit } from '@angular/core';
import { faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { BackupService } from 'src/app/services/backup.service';
import { BackupInfo } from '../../../../../src/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  backupInfo: BackupInfo;

  faRedo = faRedo;
  faSpinner = faSpinner;

  backuping = false;
  total = 0;
  processed = 0;

  constructor(public backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      this.backupInfo = backupInfo;
    });
    this.backupService.backupStatus$.subscribe((backupStatus) => {
      this.backuping = backupStatus.backuping;
      this.total = backupStatus.total;
      this.processed = backupStatus.processed;
    });
  }

  ngOnInit(): void {}

  backup(): void {
    this.backupService.backup();
  }
}
