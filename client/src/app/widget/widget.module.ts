import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OptionsFormComponent } from './options-form/options-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [OptionsFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  exports: [OptionsFormComponent],
})
export class WidgetModule {}
