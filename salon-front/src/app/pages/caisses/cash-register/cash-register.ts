import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashRegisterApi } from '../../../core/services/cash-register-api';
import { CashRegister } from '../../../core/models/cash-register';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
// import { CashSummary } from '../../../shared/components/cash-register/cash-summary/cash-summary';
// import { CashHistory } from '../cash-history/cash-history';
import { CashMovementList } from '../../../shared/components/cash-register/cash-movement-list/cash-movement-list';
import { ToastService } from '../../../core/services/toast';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { ModalComponent } from "../../../shared/components/modal/modal";
import { CashMovementForm } from "../../../shared/components/cash-register/cash-movement-form/cash-movement-form";
import { CashMovementType } from '../../../core/models/cash-movement';

@Component({
  selector: 'app-cash-register-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, CashMovementList, SearchBarComponent, ModalComponent, CashMovementForm],
  templateUrl: './cash-register.html',
})
export class CashRegisters implements OnInit {
  cashNow?: CashRegister;
  cash: any;
  histories: CashRegister[] = [];
  loading = false;
  activeTab: 'summary' | 'movement' | 'history' | 'close' = 'summary';

  searchValue = '';
  page = 1;
  limit = 8;

  showMovementModal = false;
  movementType: CashMovementType = CashMovementType.REFUND;
  showCloseConfirm = false;
  showOpenConfirm = false;

  constructor(
    private readonly cashApi: CashRegisterApi,
    private readonly toast: ToastService,
    private readonly confirm: ConfirmDialogService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCurrent();

    this.loadHistory();
  }

  /**
   * SESSION ACTIVE
   */

  loadCurrent() {
    this.loading = true;

    this.cashApi.current().subscribe({
      next: res => {
        this.cashNow = res;
        if (res) {
          this.loadDetails(res.id);
        } else {
          this.cash = undefined;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.cashNow = undefined;
        this.cash = undefined;
        this.loading = false;
      },
    });
  }

  /**
   * DETAIL
   */

  loadDetails(id: number) {
    this.cashApi
      .summary(id)

      .subscribe({
        next: res => {
          this.cash = res;

          this.cdr.detectChanges();
        },
      });
  }

  /**
   * CREATION SESSION
   */

  createSession() {
    this.cashApi
      .create()

      .subscribe(() => {
        this.toast.success('Nouvelle session créée');

        this.loadCurrent();

        this.loadHistory();
      });
  }

  /**
   * OUVERTURE
   */

  async openSession() {
    if (!this.cashNow) return;

    const ok = await this.confirm.confirm({
      title: 'Ouverture de la caisse',
      message: 'Voulez-vous ouvrir cette session caisse ?',
      confirmText: 'Ouverture',
      confirmClass: 'btn-success',
    });

    if (!ok) return;

    const balance = 0;

    this.cashApi
      .open(this.cashNow.id, balance)

      .subscribe(() => {
        this.toast.success('Caisse ouverte');

        this.loadCurrent();
      });
  }

  /**
   * FERMETURE
   */

  async closeSession() {
    if (!this.cashNow) return;

    const ok = await this.confirm.confirm({
      title: 'Clôturer la caisse',
      message: 'Voulez-vous clôturer cette session caisse ?',
      confirmText: 'Clôturer',
      confirmClass: 'btn-danger',
    });

    if (!ok) return;

    const balance = this.cash?.soldeTheorique ?? 0;

    this.cashApi
      .close(
        this.cashNow.id,

        balance
      )

      .subscribe(() => {
        this.toast.success('Caisse fermée');

        this.loadCurrent();

        this.loadHistory();
      });
  }

  /**
   * HISTORIQUE
   */

  loadHistory() {
    this.cashApi
      .history()

      .subscribe({
        next: res => {
          this.histories = res;
        },
      });
  }

  openHistory(cash: CashRegister) {
    this.loadDetails(cash.id);

    this.cashNow = cash;

    this.activeTab = 'summary';
  }

  addMoney() {
    this.movementType = CashMovementType.REFUND;
    this.showMovementModal = true;
  }

  removeMoney() {
    this.movementType = CashMovementType.CASH_OUT;
    this.showMovementModal = true;
  }

  closeMovement() {
    this.showMovementModal = false;
  }

  isOpen() {
    return this.cashNow?.status === 'OPEN';
  }

  statusLabel(status?: string) {
    return status === 'OPEN' ? 'OUVERTE' : 'FERMEE';
  }

  search(value: string) {
    this.searchValue = value;
    this.page = 1;
  }
}
