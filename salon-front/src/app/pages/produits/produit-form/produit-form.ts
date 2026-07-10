import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Produit } from '../../../core/models/produit';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitApi } from '../../../core/services/produit-api';
import { ToastService } from '../../../core/services/toast';
import { FormField } from '../../../core/models/form-field';
import { FormBuilderComponent } from "../../../shared/components/form-builder/form-builder";
import { Marque } from '../../../core/models/marques';
import { TypeProduit } from '../../../core/models/type-produit';
import { MarqueApi } from '../../../core/services/marque-api';
import { TypeProduitApi } from '../../../core/services/type-produit-api';

@Component({
  selector: 'app-produit-form',
  imports: [FormBuilderComponent],
  templateUrl: './produit-form.html',
  styleUrl: './produit-form.scss',
})
export class ProduitForm implements OnChanges, OnInit {
  @Input() produit?: Produit;
  @Output() saved = new EventEmitter<Produit>();

  form: FormGroup;
  loading = false;
  produits: Produit[] = [];
  marques: Marque[] = [];
  typesProduits: TypeProduit[] = [];

  fields: FormField[] = [];

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitApi,
    private marqueService: MarqueApi,
    private typeProduitService: TypeProduitApi,
    // private typePrestationService: TypeprestationApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      marqueId: [null, Validators.required],
      typeProduitId: [null, Validators.required],
      prix_achat: [0, [
        Validators.required,
        Validators.min(0)
      ]
      ],
      prix_vente: [0, [
        Validators.required,
        Validators.min(0)
      ]
      ],
      actif: [true],
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.marqueService.findAll(1, 1000).subscribe(res => {
      this.marques = res.data;
      this.cdr.detectChanges();
      this.initFields();
    });

    this.typeProduitService.findAll(1, 1000).subscribe(res => {
      this.typesProduits = res.data;
      this.initFields();
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
        label: 'Type de produit',
        type: 'select',
        required: true,
        options: this.typesProduits,
        optionLabel: 'nom',
        optionValue: 'id',
      },
      {
        key: 'prix_achat',
        label: 'Prix d\'achat (Ar)',
        type: 'number',
        required: true,
      },
      {
        key: 'prix_vente',
        label: 'Prix de vente (Ar)',
        type: 'number',
        required: true,
      },
    ];
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.produit) {
      this.form.patchValue({
        ...this.produit,
        typeProduitId: this.produit.typeProduit?.id,
        marqueId: this.produit.marque?.id,
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
    const request = this.produit?.id
      ? this.produitService.update(this.produit.id, data)
      : this.produitService.create(data);

    request.subscribe({
      next: result => {
        this.loading = false;
        this.toast.success(this.produit?.id ? 'Produit modifiée' : 'Produit créée');

        if (!this.produit?.id) {
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
