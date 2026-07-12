import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PersonnelApi } from '../../../../core/services/personnel-api';
import { Personnel } from '../../../../core/models/personnel';
import { SelectorForm } from '../../../../shared/components/selector-form/selector-form';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-reservation-information',
  standalone: true,
  imports: [ReactiveFormsModule, SelectorForm, ModalComponent],
  templateUrl: './reservation-information.html',
})
export class ReservationInformation implements OnInit {
  @Input()
  form!: FormGroup;

  personnels: Personnel[] = [];

  selectedPersonnel: Personnel[] = [];
  selectedPersonnelIds: number[] = [];
  showPersonnelModal = false;

  constructor(
    private personnelService: PersonnelApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPersonnels();
  }

  loadPersonnels(): void {
    this.personnelService.findAll().subscribe({
      next: res => {
        this.personnels = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  openPersonnelModal(): void {
    this.showPersonnelModal = true;
  }

  closePersonnelModal(): void {
    this.showPersonnelModal = false;
  }

  validatePersonnel(): void {
    if (this.selectedPersonnelIds.length > 0) {
      const personnelId = this.selectedPersonnelIds;
      this.selectedPersonnel = this.personnels.filter(personnel => this.selectedPersonnelIds.includes(personnel.id));
      console.log(this.selectedPersonnelIds);
      this.form.patchValue({
        personnelId,
      });
      this.closePersonnelModal();
    }
  }

  setOrigine(value: string): void {
    this.form.patchValue({
      origine: value,
    });
  }

  get origine(): string {
    return this.form.get('origine')?.value;
  }
}
