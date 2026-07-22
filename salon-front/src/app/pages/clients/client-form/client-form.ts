import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ClientService } from '../../../core/services/client-api';
import { Client } from '../../../core/models/client';
import { ToastService } from '../../../core/services/toast';
import { FormField } from '../../../core/models/form-field';
import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';

export enum ClientGenre {
  MADAME = 'Mme',
  MONSIEUR = 'Mr',
  MADEMOISELLE = 'Mlle',
}

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormBuilderComponent],
  templateUrl: './client-form.html',
})
export class ClientForm implements OnChanges, OnInit {
  form: any;
  fields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      genre: [ClientGenre.MADAME],
      nom: [''],
      prenom: [''],
      telephone: [''],
      email: [''],
    });
  }

  @Input() client?: Client;

  @Output() saved = new EventEmitter<Client>();

  loading = false;

  ngOnInit() {
    this.initFields();
  }

  ngOnChanges() {
    if (this.client) {
      this.form.patchValue(this.client);
    } else {
      this.form.reset();
    }
  }

  private initFields() {
    this.fields = [
      {
        key: 'genre',
        label: 'Genre',
        type: 'select',
        options: [
          {
            value: 'Mme',
            label: 'Madame',
          },
          {
            value: 'Mr',
            label: 'Monsieur',
          },
          {
            value: 'Mlle',
            label: 'Mademoiselle',
          },
        ],
        optionLabel: 'label',
        optionValue: 'value',
      },
      {
        key: 'nom',
        label: 'Nom',
        type: 'text',
      },
      {
        key: 'prenom',
        label: 'Prenom',
        type: 'text',
        required: true,
      },
      {
        key: 'telephone',
        label: 'Téléphone',
        type: 'text',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'text',
      },
    ];
    this.cdr.detectChanges();
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
      next: result => {
        this.loading = false;
        this.toast.success(this.client?.id ? 'Client modifié' : 'Client créé');
        this.saved.emit(result);
      },
      error: () => {
        this.loading = false;
        this.toast.error('Erreur lors de l’enregistrement');
      },
    });
  }
}
