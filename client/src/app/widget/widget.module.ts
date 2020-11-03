import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RemoteFormComponent } from './remote-form/remote-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RemoteFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [RemoteFormComponent],
})
export class WidgetModule {}
