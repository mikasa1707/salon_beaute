import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormField } from '../../../core/models/form-field';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-builder.html'
})
export class FormBuilderComponent {

  @Input({ required: true })
  form!: FormGroup;

  @Input() fields: FormField[] = [];

  @Input() loading = false;

  @Output() submitForm = new EventEmitter<void>();

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitForm.emit();
  }
}