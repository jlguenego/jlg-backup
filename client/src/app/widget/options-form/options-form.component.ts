import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import { BackupInfo } from 'src/app/interfaces/backup-info';
import { BackupService } from 'src/app/services/backup.service';
import { BackupOptions } from '../../../../../src/interfaces';

@Component({
  selector: 'app-options-form',
  templateUrl: './options-form.component.html',
  styleUrls: ['./options-form.component.scss'],
})
export class OptionsFormComponent implements OnInit {
  faTimes = faTimes;
  faCheck = faCheck;

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
}
