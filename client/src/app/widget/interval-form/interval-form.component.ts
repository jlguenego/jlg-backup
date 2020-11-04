import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BackupInfo } from 'src/app/interfaces/backup-info';
import { BackupService } from 'src/app/services/backup.service';
import { BackupOptions } from '../../../../../src/interfaces';

@Component({
  selector: 'app-interval-form',
  templateUrl: './interval-form.component.html',
  styleUrls: ['./interval-form.component.scss'],
})
export class IntervalFormComponent implements OnInit {
  f = new FormGroup({
    intervalInSecond: new FormControl(''),
  });

  backupInfo: BackupInfo;

  constructor(private backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      this.backupInfo = backupInfo;
      console.log('backupInfo: ', backupInfo);
      this.f.setValue({
        intervalInSecond: backupInfo.options.intervalInSecond ?? '',
      });
    });
  }

  ngOnInit(): void {}

  submit(): void {
    console.log('submit');
    this.backupService.update(this.f.value as BackupOptions);
  }
}
