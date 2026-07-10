import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBuilderComponent } from '../../../shared/components/form-builder/form-builder';
import { FormField } from '../../../core/models/form-field';
import { Produit } from '../../../core/models/produit';
import { ProduitUnite } from '../../../core/models/produit-unite';
import { ProduitUniteApi } from '../../../core/services/produit-unite-api';
import { ToastService } from '../../../core/services/toast';

@Component({
  selector: 'app-produit-unites-form',
  standalone: true,
  imports: [FormBuilderComponent],
  templateUrl: './produit-unites-form.html',
  styleUrl: './produit-unites-form.scss',
})
export class ProduitUnitesForm implements OnChanges {
  @Input() produit!: Produit;
  @Input() unite?: ProduitUnite;

  @Output() saved = new EventEmitter<ProduitUnite>();

  form: FormGroup;
  fields: FormField[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private produitUniteService: ProduitUniteApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      code: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      prix: [0, [Validators.required, Validators.min(0)]],
      stock_minimum: [0, [Validators.min(0)]],
      actif: [true],
    });
  }

  ngOnInit() {
    this.initFields();
  }

  private initFields() {
    this.fields = [
      {
        key: 'nom',
        label: 'Nom unité',
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

    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.unite) {
      this.form.patchValue({
        nom: this.unite.nom,
        code: this.unite.code,
        stock: this.unite.stock,
        prix: this.unite.prix,
        stock_minimum: this.unite.stock_minimum,
        actif: true,
      });
      this.initFields();
    } else {
      this.form.reset({
        stock: 0,
        prix: 0,
        stock_minimum: 0,
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
