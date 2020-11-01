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

  last = new Date();
  next = new Date();

  constructor(private backupService: BackupService) {}

  ngOnInit(): void {}

  backup(): void {
    console.log('backup');
    this.backupService.backup();
  }
}
