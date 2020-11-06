import { Component, OnInit } from '@angular/core';
import { faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { BackupInfo } from 'src/app/interfaces/backup-info';
import { BackupService } from 'src/app/services/backup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  backupInfo: BackupInfo;

  faRedo = faRedo;
  faSpinner = faSpinner;

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
