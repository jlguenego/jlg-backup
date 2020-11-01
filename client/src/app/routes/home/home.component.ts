import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}
}
