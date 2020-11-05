import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OptionsFormComponent } from './options-form/options-form.component';

@NgModule({
  declarations: [OptionsFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [OptionsFormComponent],
})
export class WidgetModule {}
