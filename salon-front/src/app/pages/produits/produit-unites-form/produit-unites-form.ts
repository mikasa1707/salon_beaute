import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';
import { FormField } from '../../../core/models/form-field';

import { Produit } from '../../../core/models/produit';
import { ProduitUnite } from '../../../core/models/produit-unite';

import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { ToastService } from '../../../core/services/toast';
import { UnitesMesureApi } from '../../../core/services/unites-mesure-api';

@Component({
  selector: 'app-produit-unite-form',
  standalone: true,
  imports: [FormBuilderComponent],
  templateUrl: './produit-unites-form.html',
  styleUrl: './produit-unites-form.scss',
})
export class ProduitUnitesForm implements OnInit, OnChanges {
  @Input() produit!: Produit;
  @Input() unites?: ProduitUnite;
  @Input() label? = '';
  @Output() saved = new EventEmitter<ProduitUnite>();
  form: FormGroup;
  fields: FormField[] = [];
  loading = false;
  unitesMesure: any[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly produitUniteService: ProduitUniteApi,
    private readonly uniteMesureApi: UnitesMesureApi,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      code: [''],
      unite_mesure_id: [null, Validators.required],
      conversion: [1, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      stock_minimum: [0, [Validators.min(0)]],
      actif: [true],
    });
  }

  ngOnInit() {
    this.uniteMesureApi.findAll(1, 1000).subscribe(res => {
      this.unitesMesure = res.data ?? res;
      this.initFields();
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      return;
    }
    if (!this.unites && changes['label']) {
      this.form.patchValue({
        nom: this.label ?? '',
      });
    }
    console.log(this.label);
    if (this.unites) {
      this.form.patchValue({
        nom: this.unites.nom,
        code: this.unites.code,
        conversion: this.unites.conversion,
        stock: this.unites.stock,
        prix: this.unites.prix,
        stock_minimum: this.unites.stock_minimum,
        unite_mesure_id: this.unites.uniteMesure?.id,
        actif: true,
      });
    } else {
      this.form.reset({
        nom: this.label ?? '',
        conversion: 1,
        stock: 0,
        prix: 0,
        stock_minimum: 0,
        actif: true,
      });
    }
  }

  private initFields() {
    this.fields = [
      {
        key: 'nom',
        label: 'Nom conditionnement',
        type: 'text',
        required: true,
      },

      {
        key: 'code',
        label: 'Code',
        type: 'text',
        required: true,
      },

      {
        key: 'unite_mesure_id',
        label: 'Unité de conversion',
        type: 'select',
        required: true,
        options: this.unitesMesure,
      },

      {
        key: 'conversion',
        label: 'Conversion',
        type: 'number',
        required: true,
      },

      {
        key: 'stock',
        label: 'Stock initial',
        type: 'number',
        required: true,
      },

      {
        key: 'prix',
        label: 'Prix vente (Ar)',
        type: 'number',
        required: true,
      },

      {
        key: 'stock_minimum',
        label: 'Stock minimum',
        type: 'number',
      },
    ];
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;
    const data = {
      ...this.form.value,

      produit_id: this.produit.id,
    };
    const request = this.unites?.id ? this.produitUniteService.update(this.unites.id, data) : this.produitUniteService.create(data);
    console.log(data);
    request.subscribe({
      next: result => {
        this.form.reset({
          conversion: 1,
          stock: 0,
          prix: 0,
          stock_minimum: 0,
          actif: true,
        });
        this.loading = false;
        this.toast.success(this.unites?.id ? 'Unité modifiée' : 'Unité créée');
        this.saved.emit(result);
      },
      error: () => {
        this.loading = false;
        this.toast.error('Erreur lors de l’enregistrement');
      },
    });
  }
}
