import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from '../../components/modal/modal';

import { PosTicket } from '../../../core/models/posTicket';
import { KeyboardMode, NumericKeyboard } from '../numeric-keyboard/numeric-keyboard';

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
    },
    {
      value: 'ORANGE_MONEY',
      label: 'Orange Money',
      icon: 'fa-mobile-screen-button',
      color: '#000000',
      image: 'payment/orangemoney.png',
    },
    {
      value: 'AIRTEL_MONEY',
      label: 'Airtel Money',
      icon: 'fa-sim-card',
      color: '#000000',
      image: 'payment/airtelmoney.png',
    },
    // {
    //   value: 'CARTE',
    //   label: 'Carte',
    //   icon: 'fa-credit-card',
    //   color: '#006eff',
    //   image: 'payment/cb.png',
    // },
  ];

  quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

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

    if (this.modePaiement === 'ESPECES' && this.montantRecu < this.total) {
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
    if (mode !== 'ESPECES') {
      this.montantRecu = this.total;
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
    console.log(this.activeField);
    switch (field) {
      case 'montant':
        this.keyboardMode = 'numeric';
        this.keyboardValue = this.montantRecu ?? 0;
        break;
      case 'reference':
        this.keyboardMode = 'text';
        this.keyboardValue = this.referencePaiement ?? '';
        break;
      case 'phone':
        this.keyboardMode = 'phone';
        this.keyboardValue = this.numeroPaiement ?? '';
        break;
    }
  }

  keyboardChange(value: any) {
    this.keyboardValue = value;
    switch (this.activeField) {
      case 'montant':
        this.montantRecu = Number(value);
        break;
      case 'reference':
        this.referencePaiement = value;
        break;
      case 'phone':
        this.numeroPaiement = value;
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
}
