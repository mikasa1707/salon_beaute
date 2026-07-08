import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Produit } from '../../../core/models/produit';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitApi } from '../../../core/services/produit-api';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-produit-form',
  imports: [],
  templateUrl: './produit-form.html',
  styleUrl: './produit-form.scss',
})
export class ProduitForm implements OnChanges, OnInit {
  @Input() produit?: Produit;
  @Output() saved = new EventEmitter<Produit>();

  form: FormGroup;
  loading = false;
  produits: Produit[] = [];

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitApi,
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

  // loadTypesPrestations() {
  //   this.typePrestationService.findAll(1, 100, '').subscribe({
  //     next: (res) => {
  //       this.typesPrestations = res.data;
  //       this.cdr.detectChanges();
  //     },
  //     error: () => {
  //       this.toast.error('Impossible de charger les types de prestations');
  //     }
  //   });
  // }

  ngOnInit() {
    // this.loadTypesPrestations();
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
