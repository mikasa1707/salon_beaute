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

import { Produit } from '../../../core/models/produit';
import { Marque } from '../../../core/models/marques';
import { TypeProduit } from '../../../core/models/type-produit';

import { ProduitApi } from '../../../core/services/produit-api';
import { MarqueApi } from '../../../core/services/marque-api';
import { TypeProduitApi } from '../../../core/services/type-produit-api';
import { UnitesMesureApi } from '../../../core/services/unites-mesure-api';
import { ToastService } from '../../../core/services/toast';

import { FormField } from '../../../core/models/form-field';
import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [FormBuilderComponent],
  templateUrl: './produit-form.html',
  styleUrl: './produit-form.scss',
})
export class ProduitForm implements OnChanges, OnInit {
  @Input() produit?: Produit;

  @Output() saved = new EventEmitter<Produit>();

  form: FormGroup;
  loading = false;
  marques: Marque[] = [];
  typesProduits: TypeProduit[] = [];
  unitesMesure: any[] = [];
  fields: FormField[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly produitService: ProduitApi,
    private readonly marqueService: MarqueApi,
    private readonly typeProduitService: TypeProduitApi,
    private readonly uniteMesureApi: UnitesMesureApi,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      marqueId: [null, Validators.required],
      typeProduitId: [null, Validators.required],
      uniteConsommationId: [null, Validators.required],
      prix_achat: [0, [Validators.required, Validators.min(0)]],
      prix_vente: [0, [Validators.required, Validators.min(0)]],
      actif: [true],
    });
  }

  ngOnInit() {
    this.loadDependencies();
  }

  loadDependencies() {
    this.marqueService.findAll(1, 1000).subscribe(res => {
      this.marques = res.data;

      this.buildFields();
    });

    this.typeProduitService.findAll(1, 1000).subscribe(res => {
      this.typesProduits = res.data;

      this.buildFields();
    });

    this.uniteMesureApi.findAll().subscribe(res => {
      this.unitesMesure = res.data ?? res;

      this.buildFields();
    });
  }

  buildFields() {
    if (!this.marques.length || !this.typesProduits.length || !this.unitesMesure.length) {
      return;
    }

    this.fields = [
      {
        key: 'nom',
        label: 'Nom',
        type: 'text',
        required: true,
      },

      {
        key: 'marqueId',
        label: 'Marque',
        type: 'select',
        required: true,
        options: this.marques,
        optionLabel: 'nom',
        optionValue: 'id',
      },

      {
        key: 'typeProduitId',
        label: 'Type produit',
        type: 'select',
        required: true,
        options: this.typesProduits,
        optionLabel: 'nom',
        optionValue: 'id',
      },

      {
        key: 'uniteConsommationId',
        label: 'Unité consommation recette',
        type: 'select',
        required: true,
        options: this.unitesMesure,
        optionLabel: 'nom',
        optionValue: 'id',
      },

      {
        key: 'prix_achat',
        label: 'Prix achat (Ar)',
        type: 'number',
        required: true,
      },

      {
        key: 'prix_vente',
        label: 'Prix vente (Ar)',
        type: 'number',
        required: true,
      },
    ];

    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.form) {
      return;
    }

    if (this.produit) {
      this.form.patchValue({
        nom: this.produit.nom,
        marqueId: this.produit.marque?.id,
        typeProduitId: this.produit.typeProduit?.id,
        uniteConsommationId: this.produit.uniteConsommation?.id,
        prix_achat: this.produit.prix_achat,
        prix_vente: this.produit.prix_vente,
        actif: this.produit.actif,
      });
    } else {
      this.form.reset({
        prix_achat: 0,

        prix_vente: 0,

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

    const request = this.produit?.id
      ? this.produitService.update(this.produit.id, data)
      : this.produitService.create(data);

    request.subscribe({
      next: result => {
        this.loading = false;

        this.toast.success(this.produit?.id ? 'Produit modifié' : 'Produit créé');

        this.saved.emit(result);
      },

      error: () => {
        this.loading = false;

        this.toast.error('Erreur lors de l’enregistrement');
      },
    });
  }
}
