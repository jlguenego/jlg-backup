import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BackupService } from 'src/app/services/backup.service';
import { BackupOptions } from '../../../../../src/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  f = new FormGroup({
    remote: new FormControl('', Validators.required),
    local: new FormControl('', Validators.required),
  });

  next: Date;
  last: Date;

  constructor(public backupService: BackupService) {
    this.backupService.backupInfo$.subscribe((backupInfo) => {
      if (!backupInfo) {
        return;
      }
      this.next = new Date(backupInfo.next);
      this.last = new Date(backupInfo.last);
      this.f.setValue({
        remote: backupInfo.options.remote ?? '',
        local: backupInfo.options.local ?? '',
      });
    });
  }

  ngOnInit(): void {}

  backup(): void {
    console.log('backup');
    this.backupService.backup();
  }

  submit(): void {
    console.log('submit');
    this.backupService.update(this.f.value as BackupOptions);
  }
}
