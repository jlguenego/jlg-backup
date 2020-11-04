import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BackupInfo } from 'src/app/interfaces/backup-info';
import { BackupService } from 'src/app/services/backup.service';
import { BackupOptions } from '../../../../../src/interfaces';

@Component({
  selector: 'app-remote-form',
  templateUrl: './remote-form.component.html',
  styleUrls: ['./remote-form.component.scss'],
})
export class RemoteFormComponent implements OnInit {
  f = new FormGroup({
    remote: new FormControl(''),
  });

  backupInfo: BackupInfo;

  constructor(private backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      this.backupInfo = backupInfo;
      this.f.setValue({ remote: backupInfo.options.remote ?? '' });
    });
  }

  ngOnInit(): void {}

  submit(): void {
    this.backupService.update(this.f.value as BackupOptions);
  }
}
