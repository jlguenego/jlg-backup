import { Component, OnInit } from '@angular/core';
import { faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { BackupService } from 'src/app/services/backup.service';
import { LOCAL, REMOTE } from '../../../../../src/enum';
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
  goodConfig = false;

  total = 0;
  processed = 0;

  constructor(public backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      this.backupInfo = backupInfo;
      this.goodConfig =
        backupInfo.localStatus === LOCAL.OK &&
        backupInfo.remoteStatus === REMOTE.OK;
    });
    this.backupService.backupStatus$.subscribe((backupStatus) => {
      this.total = backupStatus.total;
      this.processed = backupStatus.processed;
      if (this.backuping === true && backupStatus.backuping === false) {
        setTimeout(() => {
          this.backuping = backupStatus.backuping;
        }, 500);
        return;
      }
      this.backuping = backupStatus.backuping;
    });
  }

  ngOnInit(): void {}

  backup(): void {
    this.backupService.backup();
  }
}
