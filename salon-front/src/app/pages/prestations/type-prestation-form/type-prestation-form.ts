import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypePrestation } from '../../../core/models/prestation';
import { TypeprestationApi } from '../../../core/services/typeprestation-api';
import { ToastService } from '../../../core/services/toast';
import { FormField } from '../../../core/models/form-field';
import { FormBuilderComponent } from "../../../shared/components/form-builder/form-builder";

@Component({
  selector: 'app-type-typePrestation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormBuilderComponent],
  templateUrl: './type-prestation-form.html',
  styleUrl: './type-prestation-form.scss',
})
export class TypePrestationForm {
  @Input() typePrestation?: TypePrestation;
  @Output() saved = new EventEmitter<TypePrestation>();

  form: FormGroup;
  loading = false;
  typesPrestations: TypePrestation[] = [];
  fields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private typePrestationService: TypeprestationApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      actif: [true],
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.initFields();
  }

  private initFields() {
    this.fields = [
      {
        key: 'nom',
        label: 'Type de prestation',
        type: 'text',
        required: true,
      },
    ];
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.typePrestation) {
      this.form.patchValue({
        ...this.typePrestation,
      });
    } else {
      this.form.reset({
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
    const request = this.typePrestation?.id
      ? this.typePrestationService.update(this.typePrestation.id, data)
      : this.typePrestationService.create(data);

    request.subscribe({
      next: result => {
        this.loading = false;
        this.toast.success(this.typePrestation?.id ? 'TypePrestation modifiée' : 'TypePrestation créée');

        if (!this.typePrestation?.id) {
          this.form.reset({
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
