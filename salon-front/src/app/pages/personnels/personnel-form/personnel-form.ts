import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PersonnelApi } from '../../../core/services/personnel-api';
import { ToastService } from '../../../core/services/toast';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Personnel } from '../../../core/models/personnel';
import { CommonModule } from '@angular/common';
import { FormField } from '../../../core/models/form-field';
import { FormBuilderComponent } from "../../../shared/components/form-builder/form-builder";
import { SelectorForm } from "../../../shared/components/selector-form/selector-form";
import { PrestationApi } from '../../../core/services/prestation-api';
import { Prestation } from '../../../core/models/prestation';

@Component({
  selector: 'app-personnel-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormBuilderComponent, SelectorForm],
  templateUrl: './personnel-form.html',
  styleUrl: './personnel-form.scss',
})
export class PersonnelForm implements OnChanges, OnInit {
  form: any;
  roles = [
  {
    label: 'ADMIN',
    value: 'ADMIN'
  },
  {
    label: 'RESPONSABLE',
    value: 'RESPONSABLE'
  },
  {
    label: 'COIFFEUR',
    value: 'COIFFEUR'
  },
  {
    label: 'ESTHETICIEN',
    value: 'ESTHETICIEN'
  },
  {
    label: 'RECEPTION',
    value: 'RECEPTION'
  }
];
  fields: FormField[] = [];
  prestations: Prestation[] = [];
  selectedPrestationsIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private personnelService: PersonnelApi,
        private prestationService: PrestationApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['123456', this.personnel?.id ? [] : [Validators.required, Validators.minLength(6)]],
      couleurAgenda: ['#0d6efd'],
      actif: [true],
    });
  }

  @Input() personnel?: Personnel;

  @Output() saved = new EventEmitter<Personnel>();

  loading = false;

  ngOnInit() {
    this.loadPrestations();
    this.initFields();
  }

  ngOnChanges() {
    if (this.personnel) {
      this.form.patchValue({
        ...this.personnel,
        couleurAgenda: this.personnel.couleurAgenda || '#0d6efd',
      });

      this.form.controls['password'].clearValidators();
      this.form.controls['password'].setValidators([Validators.minLength(6)]);
      this.form.controls['password'].updateValueAndValidity();
      this.selectedPrestationsIds = this.personnel.prestations?.map(x => x.id) ?? [];
    } else {
      this.form.reset({
        password: '123456',
        couleurAgenda: '#0d6efd',
        actif: true,
      });
      this.form.controls['password'].setValidators([Validators.required, Validators.minLength(6)]);
      this.form.controls['password'].updateValueAndValidity();
      this.selectedPrestationsIds = [];
    }
  }

  loadPrestations() {
    this.prestationService.findAll(1, 1000, '').subscribe({
      next: res => {
        this.prestations = res.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Impossible de charger les personnels');
      },
    });
  }


  private initFields() {
    this.fields = [
      {
        key: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
      },
      {
        key: 'prenom',
        label: 'Prénom',
        type: 'text',
        required: true,
      },
      {
        key: 'telephone',
        label: 'Téléphone',
        type: 'text',
        required: true,
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
      },
      {
        key: 'role',
        label: 'Rôle',
        type: 'select',
        required: true,
        options: this.roles,
        optionLabel: 'label',
        optionValue: 'value',
      },
      {
        key: 'password',
        label: 'Mot de passe',
        type: 'password',
        required: true,
      },
      {
        key: 'couleurAgenda',
        label: 'Couleur agenda',
        type: 'color',
      }
    ];
    this.cdr.detectChanges();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const data = {
      ...this.form.value,
      prestationIds: this.selectedPrestationsIds,
    };
    const request = this.personnel?.id
      ? this.personnelService.update(this.personnel.id, data)
      : this.personnelService.create(data);

    request.subscribe({
      next: result => {
        this.loading = false;
        this.toast.success(this.personnel?.id ? 'Personnel modifié' : 'Personnel créé');
        if (!this.personnel?.id) {
          this.form.reset({
            motDePasse: '123456',
            couleurAgenda: '#0d6efd',
            actif: true,
          });
          this.selectedPrestationsIds = [];
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
