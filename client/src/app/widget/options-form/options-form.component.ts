import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  faExclamationTriangle,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import { BackupInfo } from 'src/app/interfaces/backup-info';
import { BackupService } from 'src/app/services/backup.service';
import { BackupOptions } from '../../../../../src/interfaces';
import { LOCAL } from '../../../../../src/enum';

@Component({
  selector: 'app-options-form',
  templateUrl: './options-form.component.html',
  styleUrls: ['./options-form.component.scss'],
})
export class OptionsFormComponent implements OnInit {
  faExclamationTriangle = faExclamationTriangle;
  faCheck = faCheck;

  f = new FormGroup({
    local: new FormControl(''),
    intervalInSecond: new FormControl(''),
  });

  backupInfo: BackupInfo;

  constructor(private backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      this.backupInfo = backupInfo;
      this.f.setValue({
        local: this.backupInfo.options.local ?? '',
        intervalInSecond: this.backupInfo.options.intervalInSecond ?? '',
      });
      this.f.markAsPristine();
      this.f.markAsUntouched();
    });
  }

  ngOnInit(): void {}

  reset(): void {
    this.f.reset();
    this.backupService.refresh();
  }

  submit(): void {
    console.log('submit');
    this.backupService.update(this.f.value as BackupOptions);
  }

  isLocalStatusOK(): boolean {
    return this.backupInfo.localStatus === LOCAL.OK;
  }

  isRemoteStatusOK(): boolean {
    return this.backupInfo.remoteStatus === REMOTE.OK;
  }
}
