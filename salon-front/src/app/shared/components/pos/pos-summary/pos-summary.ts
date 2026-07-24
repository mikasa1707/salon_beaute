import { Output, EventEmitter, ChangeDetectorRef, Component } from "@angular/core";
import { PosService } from "../../../../core/services/pos";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-pos-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pos-summary.html',
  styleUrl: './pos-summary.scss',
})
export class PosSummaryComponent {
  @Output() payment = new EventEmitter<void>();

  total = 0;
  totalProduits = 0;
  totalPrestations = 0;
  remise = 0;
  montantPaye = 0;

  constructor(
    private readonly posService: PosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.posService.activeTicket$.subscribe(ticket => {
      console.log(ticket);

      if (ticket) {
        this.total = Number(ticket.total ?? 0);
        this.totalProduits = Number(ticket.totalProduits ?? 0);
        this.totalPrestations = Number(ticket.totalPrestations ?? 0);
        this.remise = Number(ticket.remise ?? 0);

        // important
        this.montantPaye = Number(ticket.montantPaye ?? 0);
      } else {
        this.reset();
      }

      this.cdr.detectChanges();
    });
  }

  get resteAPayer(): number {
    return Math.max(this.total - this.montantPaye, 0);
  }

  reset() {
    this.total = 0;
    this.totalProduits = 0;
    this.totalPrestations = 0;
    this.remise = 0;
    this.montantPaye = 0;
  }

  payer() {
    if (this.resteAPayer <= 0) {
      return;
    }

    this.payment.emit();
  }
}
