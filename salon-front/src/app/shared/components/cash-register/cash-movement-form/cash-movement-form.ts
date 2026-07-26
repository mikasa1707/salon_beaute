import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { CashMovementApi } from '../../../../core/services/cah-movement-api';
import { ToastService } from '../../../../core/services/toast';
import { CashMovementDirection, CashMovementType } from '../../../../core/models/cash-movement';
import { FormBuilderComponent } from '../../form-builder/form-builder';
import { FormField } from '../../../../core/models/form-field';
import { PosNumberPadComponent } from '../../pos/pos-number-pad/pos-number-pad';

@Component({
  selector: 'app-cash-movement-form',
  standalone: true,
  imports: [FormsModule, FormBuilderComponent, PosNumberPadComponent],
  templateUrl: './cash-movement-form.html',
})
export class CashMovementForm implements OnInit, OnChanges {
  @Input() cashRegisterId: number = 0;
  @Input() type: CashMovementType = CashMovementType.REFUND;

  @Output() saved = new EventEmitter();
  @Output() cancel = new EventEmitter();

  form: any;
  fields: FormField[] = [];

  amount = 0;
  loading = false;
  label = '';

  constructor(
    private fb: FormBuilder,
    private api: CashMovementApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      montant: [0, [Validators.required, Validators.min(1)]],
      label: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.initFields();
  }

  ngOnChanges() {
    if (this.cashRegisterId) {
      this.form.reset({
        montant: 0,
        label: '',
      });
    }
  }

  private generateRef(_type: string, _date: Date): string {
    const date = _date.getFullYear().toString().slice(2) + String(_date.getMonth() + 1).padStart(2, '0') + String(_date.getDate()).padStart(2, '0');

    const prefix = _type;

    return `${prefix}-${date}`;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const date = new Date();
    const value = this.form.value;
    this.api
      .create(this.cashRegisterId, {
        type: this.type,
        direction: this.type === 'REFUND' ? CashMovementDirection.IN : CashMovementDirection.OUT,
        amount: Number(value.montant),
        label: this.label,
        reference: this.generateRef(this.type, date),
      })
      .subscribe(() => {
        this.toast.success('Mouvement enregistré');
        this.form.reset({
          montant: 0,
          label: '',
        });
        this.saved.emit();
      });
  }

  private initFields() {
    this.fields = [
      {
        key: 'montant',
        label: 'Montant',
        type: 'text',
        required: true,
      },
      {
        key: 'label',
        label: 'Libellé',
        type: 'text',
        required: true,
      },
    ];
    this.cdr.detectChanges();
  }

  changeAmount(value: number | string | null | undefined) {
    const montant = value === '' || value == null ? 0 : Number(value);

    this.form.patchValue({
      montant,
    });
  }
}
