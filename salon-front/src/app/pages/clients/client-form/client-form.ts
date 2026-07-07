import { Component } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClientService } from '../../../core/services/client-api';
import { Client } from '../../../core/models/client'
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './client-form.html'
})
export class ClientForm {

  form: any;

  constructor(private fb: FormBuilder, private clientService: ClientService, private toast: ToastService) {

    this.form = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: [''],
      telephone: ['', [Validators.required]],
      email: ['', [Validators.email]]
    });
  }

  @Input() client?: Client;

  @Output() saved = new EventEmitter<Client>();

  loading = false;

  ngOnChanges() {
    if (this.client) {
      this.form.patchValue(this.client);
    }
    else {
      this.form.reset();
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const data = this.form.value;
    const request = this.client?.id ? this.clientService.update(this.client.id, data) : this.clientService.create(data);

    request.subscribe({
      next: (result) => {
        this.loading = false;
        this.toast.success(
          this.client?.id
            ? 'Client modifié'
            : 'Client créé'
        );
        this.saved.emit(result);
      },
      error: () => {
        this.loading = false;
        this.toast.error(
          'Erreur lors de l’enregistrement'
        );
      }
    });
  }
}