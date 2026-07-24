import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from '../../components/modal/modal';

import { PosTicket } from '../../../core/models/posTicket';
import { KeyboardMode, NumericKeyboard } from '../numeric-keyboard/numeric-keyboard';
import { ToastService } from '../../../core/services/toast';

export interface PaymentResult {
  modePaiement: 'ESPECES' | 'MVOLA' | 'ORANGE_MONEY' | 'AIRTEL_MONEY' | 'CARTE' | 'AUTRE';
  montantRecu: number;
  remise: number;
  monnaie: number;
  referencePaiement: string;
  numeroPaiement: string;
}

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, NumericKeyboard],
  templateUrl: './payment-modal.html',
  styleUrl: './payment-modal.scss',
})
export class PaymentModalComponent {
  @Input() show = false;
  @Input({ required: true }) ticket!: PosTicket;

  @Output() confirm = new EventEmitter<PaymentResult>();

  @ViewChild(NumericKeyboard) keyboard?: NumericKeyboard;

  keyboardMode: KeyboardMode = 'numeric';
  keyboardValue: string | number = 0;
  activeField: 'montant' | 'reference' | 'phone' = 'montant';

  modePaiement = 'ESPECES';
  montantRecu = 0;
  remise = 0;
  referencePaiement = '';
  numeroPaiement = '';

  paymentModes = [
    {
      value: 'ESPECES',
      label: 'Espèces',
      icon: 'fa-money-bill-wave',
      color: '#ffffff',
      image: 'payment/cash.png',
    },
    {
      value: 'MVOLA',
      label: 'MVola',
      icon: 'fa-mobile-screen',
      color: '#000000',
      image: 'payment/mvola.png',
      prefixes: ['034', '038'],
    },
    {
      value: 'ORANGE_MONEY',
      label: 'Orange Money',
      icon: 'fa-mobile-screen-button',
      color: '#000000',
      image: 'payment/orangemoney.png',
      prefixes: ['032', '037'],
    },
    {
      value: 'AIRTEL_MONEY',
      label: 'Airtel Money',
      icon: 'fa-sim-card',
      color: '#000000',
      image: 'payment/airtelmoney.png',
      prefixes: ['033', '035'],
    },
  ];

  quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  constructor(private readonly toast: ToastService) {}

  get totalPrestations(): number {
    return this.ticket?.totalPrestations ?? 0;
  }

  get totalProduits(): number {
    return this.ticket?.totalProduits ?? 0;
  }

  get total(): number {
    return Math.max((this.ticket?.total ?? 0) - this.remise, 0);
  }

  get monnaie(): number {
    return Math.max(this.montantRecu - this.total, 0);
  }

  close() {
    this.resetPayment();
    this.show = false;
    // this.closed.emit();
  }

  payer() {
    if (this.total <= 0) {
      return;
    }

    if (this.montantRecu <= 0) {
      this.toast.error("Impossible d'encaisser. Veuillez choisir mode de paiement et entrez montant recu");
      return;
    }

    this.confirm.emit({
      modePaiement: this.modePaiement as 'ESPECES' | 'MVOLA' | 'ORANGE_MONEY' | 'AIRTEL_MONEY' | 'CARTE' | 'AUTRE',
      montantRecu: this.modePaiement === 'ESPECES' ? this.montantRecu : 0,
      monnaie: this.modePaiement === 'ESPECES' ? this.monnaie : 0,
      remise: this.remise,
      referencePaiement: this.referencePaiement,
      numeroPaiement: this.numeroPaiement,
    });

    this.close();
  }

  selectMode(mode: string) {
    this.modePaiement = mode;

    this.numeroPaiement = '';
    this.referencePaiement = '';

    if (mode !== 'ESPECES') {
      this.focusKeyboard('montant');
    }
  }

  get items() {
    return this.ticket?.items ?? [];
  }

  addAmount(amount: number) {
    this.montantRecu += amount;
  }

  setExactAmount() {
    this.montantRecu = this.total;
  }

  focusKeyboard(field: 'montant' | 'reference' | 'phone') {
    this.activeField = field;

    switch (field) {
      case 'montant':
        this.keyboardMode = 'numeric';
        this.keyboardValue = this.montantRecu;
        break;

      case 'reference':
        this.keyboardMode = 'text';
        this.keyboardValue = this.referencePaiement;
        break;

      case 'phone':
        this.keyboardMode = 'phone';
        this.keyboardValue = this.numeroPaiement;
        break;
    }
  }

  keyboardChange(value: any) {
    switch (this.activeField) {
      case 'montant':
        this.montantRecu = Number(value);
        break;

      case 'reference':
        this.referencePaiement = value;
        break;

      case 'phone':
        this.numeroPaiement = this.formatPhone(value);

        this.keyboardValue = this.numeroPaiement;

        break;
    }
  }

  resetPayment() {
    this.remise = 0;
    this.montantRecu = 0;
    this.referencePaiement = '';
    this.numeroPaiement = '';
    this.modePaiement = 'ESPECES';
    this.keyboardMode = 'numeric';
    this.keyboard?.reset();
  }

  get keyboardDisplayValue() {
    if (this.activeField === 'reference' || this.activeField === 'phone') {
      return this.montantRecu;
    }

    return this.keyboardValue;
  }

  get reste(): number {
    return Math.max(this.total - this.montantRecu, 0);
  }

  get hasMonnaie(): boolean {
    return this.montantRecu > this.total;
  }

  get hasReste(): boolean {
    return this.montantRecu < this.total;
  }

  formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 3) {
      return digits;
    }

    let result = digits.substring(0, 3);

    const rest = digits.substring(3);

    if (rest.length > 0) {
      result += ' ' + rest.substring(0, 2);
    }

    if (rest.length > 2) {
      result += ' ' + rest.substring(2, 5);
    }

    if (rest.length > 5) {
      result += ' ' + rest.substring(5, 7);
    }

    return result;
  }

  isValidPhone(): boolean {
    const phone = this.numeroPaiement.replace(/\s/g, '');

    if (phone.length !== 10) {
      return false;
    }

    const prefix = phone.substring(0, 3);

    return this.selectedPaymentMode?.prefixes?.includes(prefix) ?? false;
  }

  get selectedPaymentMode() {
    return this.paymentModes.find(x => x.value === this.modePaiement);
  }

  get phonePlaceholder(): string {
    const prefixes = this.selectedPaymentMode?.prefixes;

    if (!prefixes) {
      return '034 xx xxx xx';
    }

    return `${prefixes.join(' / ')} xx xxx xx`;
  }
}
