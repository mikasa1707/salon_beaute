import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { PersonnelApi } from '../../../../core/services/personnel-api';
import { AvailablePersonnel, Personnel } from '../../../../core/models/personnel';
import { SelectorForm } from '../../../../shared/components/selector-form/selector-form';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { ToastService } from '../../../../core/services/toast';
import { DateTimeField } from '../../../../shared/components/date-time-field/date-time-field';

import { Client } from '../../../../core/models/client';
import { ClientService } from '../../../../core/services/client-api';
import { EntityPickerConfig } from '../../../../shared/components/entity-picker/entity-picker.model';
import { EntityPicker } from '../../../../shared/components/entity-picker/entity-picker';
import { ClientForm } from "../../../clients/client-form/client-form";

@Component({
  selector: 'app-reservation-information',
  standalone: true,
  imports: [ReactiveFormsModule, SelectorForm, ModalComponent, DateTimeField, EntityPicker, DatePipe, ClientForm],
  templateUrl: './reservation-information.html',
})
export class ReservationInformation implements OnInit {
  @Input() form!: FormGroup;
  @Input() selectedPrestations: any[] = [];

  @Output() personnelChange = new EventEmitter<AvailablePersonnel[]>();

  @ViewChild(EntityPicker) clientPickerComponent!: EntityPicker;

  personnels: AvailablePersonnel[] = [];

  selectedPersonnel: AvailablePersonnel[] = [];
  selectedPersonnelIds: number[] = [];

  selectedClient: Client[] = [];

  showPersonnelModal = false;
  showClientModal = false;
  clientRefreshKey = 0;

  clientPicker!: EntityPickerConfig;

  constructor(
    private personnelService: PersonnelApi,
    private clientService: ClientService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
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

    this.form.get('dateDebut')?.valueChanges.subscribe(() => this.resetPersonnelSelection());
    this.form.get('heureDebut')?.valueChanges.subscribe(() => this.resetPersonnelSelection());
    this.form.get('origine')?.valueChanges.subscribe(value => {
      if (value === 'SANS_RDV') {
        this.setSansRdv();
      }
      if (value === 'RENDEZ_VOUS') {
        this.setRendezVous();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPrestations']) {
      this.resetPersonnelSelection();
    }
  }

  changeOrigine(value: string): void {
    this.form.patchValue({
      origine: value,
    });
  }

  private setSansRdv(): void {
    const now = new Date();
    const date = now.toISOString().substring(0, 10);
    const heure = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    this.form.patchValue({
      dateDebut: date,
      heureDebut: heure,
      statut: 'EN_COURS',
    });

    this.resetPersonnelSelection();
  }

  private setRendezVous(): void {
    this.form.patchValue({
      dateDebut: null,
      heureDebut: null,
      statut: 'EN_ATTENTE',
    });
    this.resetPersonnelSelection();
  }

  onClientChange(client: Client[]): void {
    this.selectedClient = client;
    this.form.patchValue({
      clientId: client.length ? client[0].id : null,
    });
  }

  openPersonnelModal(): void {
    if (!this.selectedPrestations.length) {
      this.toast.warning('Veuillez sélectionner au moins une prestation.');
      return;
    }
    this.getAvailablePersonnel();
    this.showPersonnelModal = true;
  }

  getAvailablePersonnel(): void {
    const date = this.form.get('dateDebut')?.value;
    const heure = this.form.get('heureDebut')?.value;
    if (!date || !heure) {
      this.toast.warning('Veuillez sélectionner une date et une heure.');
      return;
    }
    this.personnelService
      .getAvailablePersonnel({
        date,
        heure,
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
    this.selectedPersonnel = this.personnels.filter(p => this.selectedPersonnelIds.includes(p.id));

    this.form.patchValue({
      personnelId: this.selectedPersonnelIds.length ? this.selectedPersonnelIds[0] : null,
    });

    this.personnelChange.emit(this.selectedPersonnel);
    this.closePersonnelModal();
  }

  removePersonnel(id: number): void {
    this.selectedPersonnel = this.selectedPersonnel.filter(p => p.id !== id);

    this.selectedPersonnelIds = this.selectedPersonnel.map(p => p.id);

    this.form.patchValue({
      personnelId: this.selectedPersonnelIds[0] ?? null,
    });
  }

  resetPersonnelSelection(): void {
    this.selectedPersonnel = [];
    this.selectedPersonnelIds = [];
    this.form.patchValue(
      {
        personnelId: null,
      },
      { emitEvent: false },
    );
  }

  closePersonnelModal(): void {
    this.showPersonnelModal = false;
  }

  get origine(): string {
    return this.form.get('origine')?.value;
  }

  get canSelectPersonnel(): boolean {
    return (
      this.selectedPrestations.length > 0 && !!this.form.get('dateDebut')?.value && !!this.form.get('heureDebut')?.value
    );
  }

  removeClient(): void {
    this.selectedClient = [];
    this.form.patchValue({
      clientId: null,
    });
  }

  openClientModal(): void {
    this.showClientModal = true;
  }

  closeClientModal(): void {
    this.showClientModal = false;
  }

  onClientCreated(client: Client): void {
    this.selectedClient = [client];
    this.form.patchValue({
      clientId: client.id,
    });
    this.clientRefreshKey++;
    this.closeClientModal();
  }
}
