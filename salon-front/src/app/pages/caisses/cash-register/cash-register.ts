import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CashRegisterApi } from '../../../core/services/cash-register-api';
import { CashRegister } from '../../../core/models/cash-register';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header';
import { CashSummary } from '../../../shared/components/cash-register/cash-summary/cash-summary';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog';
import { ToastService } from '../../../core/services/toast';
import { CashHistory } from '../cash-history/cash-history';
import { CashMovementList } from '../../../shared/components/cash-register/cash-movement-list/cash-movement-list';

@Component({
  selector: 'app-cash-register-page',
  standalone: true,
  imports: [CommonModule, CashSummary, PageHeaderComponent, CashHistory, CashMovementList],
  templateUrl: './cash-register.html',
})
export class CashRegisters implements OnInit {
  cash?: CashRegister;
  loading = false;
  total = 0;
  totalPages = 0;
  page = 1;
  limit = 10;

  activeTab: 'summary' | 'movement' | 'history' | 'close' = 'summary';

  constructor(
    private readonly cashregisterService: CashRegisterApi,
    private readonly confirm: ConfirmDialogService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.cashregisterService.current().subscribe({
      next: res => {
        if (res) {
          console.log(res);
          this.cashregisterService.summary(res.id).subscribe({
            next: summary => {
              this.cash = summary;
              this.loading = false;
              this.cdr.detectChanges();
            },
          });
        } else {
          this.loading = false;
        }
      },

      error: () => {
        this.loading = false;
      },
    });
  }
}
