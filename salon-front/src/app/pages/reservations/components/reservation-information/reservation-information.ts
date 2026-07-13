import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { PersonnelApi } from '../../../../core/services/personnel-api';
import { Personnel } from '../../../../core/models/personnel';

import { SelectorForm } from '../../../../shared/components/selector-form/selector-form';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ToastService } from '../../../../core/services/toast';
import { DateTimeField } from '../../../../shared/components/date-time-field/date-time-field';

import { Client } from '../../../../core/models/client';
import { ClientService } from '../../../../core/services/client-api';

import { EntityPickerConfig } from '../../../../shared/components/entity-picker/entity-picker.model';
import { EntityPicker } from '../../../../shared/components/entity-picker/entity-picker';

@Component({
  selector: 'app-reservation-information',
  standalone: true,
  imports: [ReactiveFormsModule, SelectorForm, ModalComponent, DateTimeField, EntityPicker],
  templateUrl: './reservation-information.html',
})
export class ReservationInformation implements OnInit {
  @Input() form!: FormGroup;
  @Input() selectedPrestations: any[] = [];

  @Output() personnelChange = new EventEmitter<Personnel[]>();

  personnels: Personnel[] = [];

  selectedPersonnel: Personnel[] = [];
  selectedPersonnelIds: number[] = [];

  selectedClient: Client[] = [];

  showPersonnelModal = false;

  clientPicker!: EntityPickerConfig;

  constructor(
    private personnelService: PersonnelApi,
    private clientService: ClientService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initClientPicker();
    this.listenDateChange();
    this.listenOrigineChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPrestations']) {
      this.resetPersonnelSelection();
    }
  }

  // ==========================
  // CLIENT PICKER
  // ==========================

  private initClientPicker(): void {
    this.clientPicker = {
      title: 'Sélection du client',

      service: this.clientService,

      multiple: false,

      allowCreate: true,

      columns: [
        {
          field: 'nom',
          label: 'Nom',
        },
        {
          field: 'prenom',
          label: 'Prénom',
        },
        {
          field: 'telephone',
          label: 'Téléphone',
        },
      ],
    };
  }

  // ==========================
  // ORIGINE
  // ==========================

  private listenOrigineChange(): void {
    this.form.get('origine')?.valueChanges.subscribe(origine => {
      this.updateReservationMode(origine);
    });
  }

  private updateReservationMode(origine: string): void {
    if (origine === 'SANS_RDV') {
      const now = new Date();

      this.form.patchValue(
        {
          dateDebut: now.toISOString().slice(0, 10),
          heureDebut: now.toTimeString().slice(0, 5),
          statut: 'EN_COURS',
        },
        {
          emitEvent: false,
        },
      );
    } else {
      this.form.patchValue(
        {
          dateDebut: null,
          heureDebut: null,
          statut: 'EN_ATTENTE',
        },
        {
          emitEvent: false,
        },
      );
    }

    this.resetPersonnelSelection();
  }

  setOrigine(value: string): void {
    this.form.patchValue({
      origine: value,
    });
  }

  get origine(): string {
    return this.form.get('origine')?.value;
  }

  // ==========================
  // DATE / HEURE
  // ==========================

  private listenDateChange(): void {
    this.form.get('dateDebut')?.valueChanges.subscribe(() => {
      this.resetPersonnelSelection();
    });

    this.form.get('heureDebut')?.valueChanges.subscribe(() => {
      this.resetPersonnelSelection();
    });
  }

  // ==========================
  // CLIENT
  // ==========================

  onClientChange(client: Client[]): void {
    this.selectedClient = client;
    this.form.patchValue({
      clientId: client.length ? client[0].id : null,
    });
  }

  removeClient(): void {
    this.selectedClient = [];
    this.form.patchValue({
      clientId: null,
    });
  }

  // ==========================
  // PERSONNEL
  // ==========================

  openPersonnelModal(): void {
    if (!this.selectedPrestations.length) {
      this.toast.warning('Veuillez sélectionner au moins une prestation.');
      return;
    }

    this.getAvailablePersonnel();
    this.showPersonnelModal = true;
  }

  getAvailablePersonnel(): void {
    const { dateDebut, heureDebut } = this.form.value;

    if (!dateDebut || !heureDebut) {
      this.toast.warning('Veuillez sélectionner une date et une heure.');
      return;
    }

    this.personnelService
      .getAvailablePersonnel({
        date: dateDebut,
        heure: heureDebut,
        prestationIds: this.selectedPrestations.map(p => p.id),
      })
      .subscribe({
        next: res => {
          this.personnels = res;

          this.cdr.detectChanges();
        },
      });
  }

  validatePersonnel(): void {
    if (!this.selectedPersonnelIds.length) {
      return;
    }
    this.selectedPersonnel = this.personnels.filter(p => this.selectedPersonnelIds.includes(p.id));
    this.personnelChange.emit(this.selectedPersonnel);
    this.closePersonnelModal();
  }

  removePersonnel(id: number): void {
    this.selectedPersonnel = this.selectedPersonnel.filter(p => p.id !== id);
    this.selectedPersonnelIds = this.selectedPersonnel.map(p => p.id);
    this.personnelChange.emit(this.selectedPersonnel);
  }

  resetPersonnelSelection(): void {
    this.selectedPersonnel = [];
    this.selectedPersonnelIds = [];
    this.personnelChange.emit([]);
  }

  closePersonnelModal(): void {
    this.showPersonnelModal = false;
  }

  // ==========================
  // VALIDATION
  // ==========================

  get canSelectPersonnel(): boolean {
    return this.selectedPrestations.length > 0 && !!this.form.value.dateDebut && !!this.form.value.heureDebut;
  }
}
