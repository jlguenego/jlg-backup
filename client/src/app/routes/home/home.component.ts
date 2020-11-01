import { Component, OnInit } from '@angular/core';
import { BackupService } from 'src/app/services/backup.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  source = 'kiki';
  target = 'tutu';

  constructor(public backupService: BackupService) {}

  ngOnInit(): void {}

  backup(): void {
    console.log('backup');
    this.backupService.backup();
  }
}
