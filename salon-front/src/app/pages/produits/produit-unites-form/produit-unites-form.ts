import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';
import { FormField } from '../../../core/models/form-field';

import { Produit } from '../../../core/models/produit';
import { ProduitUnite } from '../../../core/models/produit-unite';

import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { ToastService } from '../../../core/services/toast';
import { UnitesMesureApi } from '../../../core/services/unites-mesure-api';

@Component({
  selector: 'app-produit-unites-form',
  standalone: true,
  imports: [FormBuilderComponent],
  templateUrl: './produit-unites-form.html',
  styleUrl: './produit-unites-form.scss',
})
export class ProduitUnitesForm implements OnInit, OnChanges {
  @Input() produit!: Produit;
  @Input() unite?: ProduitUnite;
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
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      code: [''],
      uniteMesureId: [null, Validators.required],
      conversion: [1, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      stock_minimum: [0, [Validators.min(0)]],
      actif: [true],
    });
  }

  ngOnInit() {
    this.uniteMesureApi.findAll().subscribe(res => {
      this.unitesMesure = res.data ?? res;
      this.initFields();
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      return;
    }
    console.log(this.unite)
    if (this.unite) {
      this.form.patchValue({
        nom: this.unite.nom,
        code: this.unite.code,
        conversion: this.unite.conversion,
        stock: this.unite.stock,
        prix: this.unite.prix,
        stock_minimum: this.unite.stock_minimum,
        uniteMesureId: this.unite.uniteMesure?.id,
        actif: true,
      });
    } else {
      this.form.reset({
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
        key: 'uniteMesureId',
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

      produitId: this.produit.id,
    };
    const request = this.unite?.id
      ? this.produitUniteService.update(this.unite.id, data)
      : this.produitUniteService.create(data);
    request.subscribe({
      next: result => {
        this.loading = false;
        this.toast.success(this.unite?.id ? 'Unité modifiée' : 'Unité créée');
        this.saved.emit(result);
      },
      error: () => {
        this.loading = false;
        this.toast.error('Erreur lors de l’enregistrement');
      },
    });
  }
}
