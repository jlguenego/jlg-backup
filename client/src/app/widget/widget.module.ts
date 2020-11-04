import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoteFormComponent } from './remote-form/remote-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalFormComponent } from './local-form/local-form.component';
import { IntervalFormComponent } from './interval-form/interval-form.component';

@NgModule({
  declarations: [RemoteFormComponent, LocalFormComponent, IntervalFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [RemoteFormComponent, LocalFormComponent, IntervalFormComponent],
})
export class WidgetModule {}
