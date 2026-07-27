import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';

import { CashMovementDirection, CashMovementType } from '../../../../core/models/cash-movement';

import { CashMovementApi } from '../../../../core/services/cah-movement-api';
import { ToastService } from '../../../../core/services/toast';

import { FormBuilderComponent } from '../../form-builder/form-builder';
import { FormField } from '../../../../core/models/form-field';

import { NumericKeyboard, KeyboardMode } from '../../numeric-keyboard/numeric-keyboard';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cash-movement-form',
  standalone: true,
  imports: [FormsModule, FormBuilderComponent, NumericKeyboard, CurrencyPipe],
  templateUrl: './cash-movement-form.html',
})
export class CashMovementForm implements OnInit, OnChanges {
  @Input() cashRegisterId = 0;
  @Input() type: CashMovementType = CashMovementType.REFUND;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(NumericKeyboard) keyboard?: NumericKeyboard;

  form: FormGroup;
  loading = false;
  fields: FormField[] = [];

  /**
   * Gestion clavier
   */

  activeField: 'montant' | 'label' = 'montant';
  keyboardMode: KeyboardMode = 'numeric';
  keyboardValue: string | number = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: CashMovementApi,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      montant: [0, [Validators.required, Validators.min(1)]],
      label: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.initFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['cashRegisterId']) {
      this.resetForm();
    }
  }

  private initFields() {
    this.fields = [
      {
        key: 'montant',
        label: 'Montant',
        type: 'text',
        currency: true,
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

  resetForm() {
    this.form.reset({
      montant: 0,
      label: '',
    });

    this.activeField = 'montant';
    this.keyboardMode = 'numeric';
    this.keyboardValue = 0;

    this.keyboard?.reset();
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.loading = true;
    this.api
      .create(this.cashRegisterId, {
        type: this.type,
        direction: this.type === CashMovementType.REFUND ? CashMovementDirection.IN : CashMovementDirection.OUT,
        amount: Number(value.montant),
        label: value.label ?? '',
        reference: this.generateRef(this.type, new Date()),
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.toast.success('Mouvement enregistré');
          this.resetForm();
          this.saved.emit();
        },

        error: () => {
          this.loading = false;
        },
      });
  }

  private generateRef(type: string, date: Date): string {
    const d =
      date.getFullYear().toString().slice(2) +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0') +
      String(date.getHours()).padStart(2, '0') +
      String(date.getMinutes()).padStart(2, '0');

    return `${type}-${d}`;
  }

  /**
   * ===============================
   * KEYBOARD
   * ===============================
   */

  focusKeyboard(field: 'montant' | 'label') {
    this.activeField = field;

    switch (field) {
      case 'montant':
        this.keyboardMode = 'numeric';
        this.keyboardValue = this.form.value.montant ?? 0;
        break;

      case 'label':
        this.keyboardMode = 'text';
        this.keyboardValue = this.form.value.label ?? '';
        break;
    }
  }

  keyboardChange(value: any) {
    switch (this.activeField) {
      case 'montant':
        this.form.patchValue({
          montant: Number(value ?? 0),
        });
        break;

      case 'label':
        this.form.patchValue({
          label: value ?? '',
        });
        break;
    }
  }
}
