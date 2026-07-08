import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrestationApi } from '../../../core/services/prestation-api';
import { ToastService } from '../../../core/services/toast';
import { Prestation, TypePrestation } from '../../../core/models/prestation';
import { TypeprestationApi } from '../../../core/services/typeprestation-api';

@Component({
  selector: 'app-prestation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './prestation-form.html',
  styleUrl: './prestation-form.scss',
})
export class PrestationForm implements OnChanges, OnInit {
  @Input() prestation?: Prestation;
  @Output() saved = new EventEmitter<Prestation>();

  form: FormGroup;
  loading = false;
  typesPrestations: TypePrestation[] = [];

  constructor(
    private fb: FormBuilder,
    private prestationService: PrestationApi,
    private typePrestationService: TypeprestationApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      duree: [30, [Validators.required, Validators.min(5)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      typePrestationId: [null, Validators.required],
      actif: [true],
    });
  }

  get f() {
    return this.form.controls;
  }

  loadTypesPrestations() {
    this.typePrestationService.findAll(1,100,'').subscribe({
      next: (res) => {
        this.typesPrestations = res.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Impossible de charger les types de prestations');
      }
    });
  }

  ngOnInit() {
    this.loadTypesPrestations();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.prestation) {
      this.form.patchValue({
        ...this.prestation,
        typePrestationId: this.prestation.typePrestation.id || (this.prestation as any).typePrestation?.id
      });
    } else {
      this.form.reset({
        duree: 30,
        prix: 0,
        actif: true,
      });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const data = this.form.value;
    const request = this.prestation?.id
      ? this.prestationService.update(this.prestation.id, data)
      : this.prestationService.create(data);

    request.subscribe({
      next: result => {
        this.loading = false;
        this.toast.success(this.prestation?.id ? 'Prestation modifiée' : 'Prestation créée');

        if (!this.prestation?.id) {
          this.form.reset({
            duree: 30,
            prix: 0,
            actif: true,
          });
        }
        this.saved.emit(result);
      },
      error: () => {
        this.loading = false;
        this.toast.error('Erreur lors de l’enregistrement');
      },
    });
  }
}
