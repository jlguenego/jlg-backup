import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-remote-form',
  templateUrl: './remote-form.component.html',
  styleUrls: ['./remote-form.component.scss'],
})
export class RemoteFormComponent implements OnInit {
  f = new FormGroup({
    remote: new FormControl(''),
  });

  status = 'not recognized';

  constructor() {}

  ngOnInit(): void {}

  submit(): void {
    console.log('submit');
  }
}
