import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  faExclamationTriangle,
  faCheck,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import { BackupService } from 'src/app/services/backup.service';
import { BackupInfo, BackupOptions } from '../../../../../src/interfaces';
import { LOCAL, REMOTE } from '../../../../../src/enum';

@Component({
  selector: 'app-options-form',
  templateUrl: './options-form.component.html',
  styleUrls: ['./options-form.component.scss'],
})
export class OptionsFormComponent implements OnInit {
  doc =
    'https://github.com/jlguenego/jlg-backup/blob/master/README.md#configuration';
  faExclamationTriangle = faExclamationTriangle;
  faCheck = faCheck;
  faQuestionCircle = faQuestionCircle;

  f = new FormGroup({
    remote: new FormControl(''),
    local: new FormControl(''),
    intervalInSecond: new FormControl(''),
  });

  backupInfo: BackupInfo;

  constructor(private backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      this.backupInfo = backupInfo;
      this.f.setValue({
        remote: this.backupInfo.options.remote ?? '',
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

  isRemoteStatusOK(): boolean {
    return this.backupInfo.remoteStatus === REMOTE.OK;
  }

  isLocalStatusOK(): boolean {
    return this.backupInfo.localStatus === LOCAL.OK;
  }
}
