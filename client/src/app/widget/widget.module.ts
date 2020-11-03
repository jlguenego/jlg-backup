import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoteFormComponent } from './remote-form/remote-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalFormComponent } from './local-form/local-form.component';

@NgModule({
  declarations: [RemoteFormComponent, LocalFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [RemoteFormComponent, LocalFormComponent],
})
export class WidgetModule {}
