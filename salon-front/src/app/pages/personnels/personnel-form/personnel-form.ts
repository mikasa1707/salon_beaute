import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonnelApi } from '../../../core/services/personnel-api';
import { ToastService } from '../../../core/services/toast';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Personnel } from '../../../core/models/personnel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personnel-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './personnel-form.html',
  styleUrl: './personnel-form.scss',
})
export class PersonnelForm {

  form: any;
  roles = [
    'ADMIN',
    'RESPONSABLE',
    'COIFFEUR',
    'ESTHETICIEN',
    'RECEPTION',
  ];

  constructor(private fb: FormBuilder, private personnelService: PersonnelApi, private toast: ToastService) {

    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['123456', this.personnel?.id ? [] : [Validators.required, Validators.minLength(6)]],
      couleurAgenda: ['#0d6efd'],
      actif: [true]
    });
  }

  @Input() personnel?: Personnel;

  @Output() saved = new EventEmitter<Personnel>();

  loading = false;

  ngOnChanges() {
    if (this.personnel) {
      this.form.patchValue({
        ...this.personnel,
        couleurAgenda: this.personnel.couleurAgenda || '#0d6efd'
      });

      this.form.controls['password'].clearValidators();
      this.form.controls['password'].setValidators([Validators.minLength(6)]);
      this.form.controls['password'].updateValueAndValidity();
    } else {
      this.form.reset({
        password: '123456',
        couleurAgenda: '#0d6efd',
        actif: true
      });
      this.form.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls['password'].updateValueAndValidity();
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const data = this.form.value;
    const request = this.personnel?.id ? this.personnelService.update(this.personnel.id, data) : this.personnelService.create(data);

    request.subscribe({
      next: (result) => {
        this.loading = false;
        this.toast.success(
          this.personnel?.id
            ? 'Personnel modifié'
            : 'Personnel créé'
        );
        if (!this.personnel?.id) {
          this.form.reset({
            motDePasse: '123456',
            couleurAgenda: '#0d6efd',
            actif: true
          });
        }
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
