import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TypeProduit } from '../../../core/models/type-produit';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField } from '../../../core/models/form-field';
import { TypeProduitApi } from '../../../core/services/type-produit-api';
import { ToastService } from '../../../core/services/toast';
import { FormBuilderComponent } from "../../../shared/components/form-builder/form-builder";

@Component({
  selector: 'app-type-produit-form',
  imports: [FormBuilderComponent],
  templateUrl: './type-produit-form.html',
  styleUrl: './type-produit-form.scss',
})
export class TypeProduitForm {
  @Input() typeProduit?: TypeProduit;
  @Output() saved = new EventEmitter<TypeProduit>();

  form: FormGroup;
  loading = false;
  typeProduits: TypeProduit[] = [];

  fields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private typeProduitService: TypeProduitApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      color: [''],
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
        label: 'Nom',
        type: 'text',
        required: true,
      },
      {
        key: 'color',
        label: 'Couleur',
        type: 'color',
      },
    ];
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.typeProduit) {
      this.form.patchValue({
        ...this.typeProduit,
      });
      this.initFields();
    } else {
      this.form.reset({
        actif: true,
        color: ''
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
    const request = this.typeProduit?.id ? this.typeProduitService.update(this.typeProduit.id, data) : this.typeProduitService.create(data);

    request.subscribe({
      next: result => {
        this.loading = false;
        this.toast.success(this.typeProduit?.id ? 'TypeProduit modifiée' : 'TypeProduit créée');

        if (!this.typeProduit?.id) {
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
