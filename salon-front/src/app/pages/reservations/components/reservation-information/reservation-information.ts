import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PersonnelApi } from '../../../../core/services/personnel-api';
import { Personnel } from '../../../../core/models/personnel';
import { SelectorForm } from '../../../../shared/components/selector-form/selector-form';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ToastService } from '../../../../core/services/toast';
import { DateTimeField } from "../../../../shared/components/date-time-field/date-time-field";

@Component({
  selector: 'app-reservation-information',
  standalone: true,
  imports: [ReactiveFormsModule, SelectorForm, ModalComponent, DateTimeField],
  templateUrl: './reservation-information.html',
})
export class ReservationInformation implements OnInit {
  @Input() form!: FormGroup;
  @Input() selectedPrestations: any[] = [];

  personnels: Personnel[] = [];

  selectedPersonnel: Personnel[] = [];
  selectedPersonnelIds: number[] = [];
  showPersonnelModal = false;

  constructor(
    private personnelService: PersonnelApi,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.form.get('dateDebut')?.valueChanges.subscribe(() => { this.resetPersonnelSelection(); });
    this.form.get('heureDebut')?.valueChanges.subscribe(() => { this.resetPersonnelSelection(); });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPrestations']) {
      this.resetPersonnelSelection();
    }
  }

  // loadPersonnels(): void {
  //   this.personnelService.findAll().subscribe({
  //     next: res => {
  //       this.personnels = res.data;
  //       this.cdr.detectChanges();
  //     },
  //   });
  // }

  openPersonnelModal(): void {
    console.log(this.selectedPrestations)
    if (this.selectedPrestations.length === 0) {
      this.toast.warning(
        'Veuillez sélectionner au moins une prestation.'
      );
      return;
    }
    this.getAvailablePersonnel();
    this.showPersonnelModal = true;
  }

  removePersonnel(id: number): void {
    this.selectedPersonnel = this.selectedPersonnel.filter(p => p.id !== id);
    this.selectedPersonnelIds = this.selectedPersonnel.map(p => p.id);
    this.form.patchValue({
      personnelId: this.selectedPersonnelIds[0] ?? null
    });
  }

  getAvailablePersonnel(): void {
    const date = this.form.get('dateDebut')?.value;
    const heure = this.form.get('heureDebut')?.value;
    if (!date || !heure) {
      this.toast.warning(
        'Veuillez sélectionner une date et une heure.'
      );
      return;
    }

    this.personnelService.getAvailablePersonnel({
      date,
      heure,
      prestationIds: this.selectedPrestations
    }).subscribe({
      next: res => {
        this.personnels = res;
        this.cdr.detectChanges();
      }
    });
  }

  resetPersonnelSelection(): void {
    this.selectedPersonnel = [];
    this.selectedPersonnelIds = [];
    this.form.patchValue({
      personnelId: null
    });
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

  get canSelectPersonnel(): boolean {
    const date = this.form.get('dateDebut')?.value;
    const heure = this.form.get('heureDebut')?.value;
    return (this.selectedPrestations.length > 0 && !!date && !!heure);
  }
}
