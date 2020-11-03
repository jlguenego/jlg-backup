import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BackupInfo } from 'src/app/interfaces/backup-info';
import { BackupService } from 'src/app/services/backup.service';
import { BackupOptions } from '../../../../../src/interfaces';

@Component({
  selector: 'app-local-form',
  templateUrl: './local-form.component.html',
  styleUrls: ['./local-form.component.scss'],
})
export class LocalFormComponent implements OnInit {
  f = new FormGroup({
    local: new FormControl(''),
  });

  backupInfo: BackupInfo;

  constructor(private backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      this.backupInfo = backupInfo;
      this.f.setValue({ local: backupInfo.options.local ?? '' });
    });
  }

  ngOnInit(): void {}

  submit(): void {
    console.log('submit');
    this.backupService.update(this.f.value as BackupOptions);
  }
}
