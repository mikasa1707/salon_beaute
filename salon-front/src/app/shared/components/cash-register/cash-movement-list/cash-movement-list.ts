import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashMovement, CashMovementType, CashMovementDirection } from '../../../../core/models/cash-movement';
import { DataTableComponent } from '../../../components/data-table/data-table';
import { TableColumn } from '../../../../core/models/table-column';
import { CashMovementApi } from '../../../../core/services/cah-movement-api';
import { PaginationComponent } from '../../pagination/pagination';

@Component({
  selector: 'app-cash-movement-list',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent],
  templateUrl: './cash-movement-list.html',
})
export class CashMovementList implements OnChanges {
  @Input() cashRegisterId: number = 0;
  @Input() search = '';
  @Input() page = 1;
  @Input() limit = 10;
  @Input() refresh = 0;

  movements: CashMovement[] = [];

  total = 0;
  totalPages = 0;
  loading = false;

  columns: TableColumn[] = [
    { field: 'createdAt', label: 'Date', type: 'datehour' },
    {
      field: 'type_move',
      label: 'Type',
      type: 'badge',
    },
    { field: 'label', label: 'Libellé' },
    { field: 'reference', label: 'Référence' },
    { field: 'amount', label: 'Montant', type: 'currency' },
  ];

  constructor(
    private readonly api: CashMovementApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['cashRegisterId'] || changes['search'] || changes['refresh']) && this.cashRegisterId) {
      this.load(this.search);
      console.log(this.search);
    }
  }

  load(_search: any = '') {
    this.loading = true;

    this.api.findByCashRegister(this.cashRegisterId, this.page, this.limit, _search).subscribe({
      next: res => {
        this.movements = res.data;
        this.total = res.total;
        this.totalPages = res.totalPages;
        this.page = res.page;
        this.limit = res.limit;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(page: number) {
    this.page = page;
    this.load();
  }

  changeLimit(newLimit: number) {
    this.limit = newLimit;
    this.page = 1; // 💡 Sécurité : On revient à la page 1 si la taille d'affichage change
    this.load();
  }
}
