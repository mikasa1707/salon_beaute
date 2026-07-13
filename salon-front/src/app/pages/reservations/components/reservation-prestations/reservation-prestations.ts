import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { SelectorForm } from '../../../../shared/components/selector-form/selector-form';
import { PrestationApi } from '../../../../core/services/prestation-api';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-reservation-prestations',
  standalone: true,
  imports: [SelectorForm],
  templateUrl: './reservation-prestations.html',
  styleUrl: './reservation-prestations.scss',
})
export class ReservationPrestations implements OnInit, OnChanges {
  @Input() prestations: any[] = [];
  @Input() selected: any[] = [];

  @Output() selectedChange = new EventEmitter<any[]>();

  constructor(private prestationService: PrestationApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,) {}

  ngOnInit(): void {
    this.loadPrestations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.prestations)
    console.log(this.selected)
  }

  loadPrestations(): void {
    this.prestationService.findAll(1,1000,'').subscribe({
      next: res => {
        this.prestations = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  onSelectedChange(value: any[]): void {
    this.selected = value;
    this.selectedChange.emit(value);
  }

  
}
