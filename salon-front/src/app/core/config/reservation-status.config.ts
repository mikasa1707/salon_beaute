import { ReservationStatut } from '../models/reservation-statut.enum';

export const ReservationStatusButton = {
  
  [ReservationStatut.EN_ATTENTE]: {
    label: 'Confirmer',
    icon: 'fa-check',
    class: 'btn-light',
  },

  [ReservationStatut.CONFIRMEE]: {
    label: 'Confirmer',
    icon: 'fa-check',
    class: 'btn-primary',
  },

  [ReservationStatut.ARRIVEE]: {
    label: 'Client arrivé',
    icon: 'fa-user-check',
    class: 'btn-info',
  },

  [ReservationStatut.EN_COURS]: {
    label: 'Démarrer',
    icon: 'fa-play',
    class: 'btn-warning',
  },

  [ReservationStatut.TERMINEE]: {
    label: 'Terminer',
    icon: 'fa-check-double',
    class: 'btn-success',
  },

  [ReservationStatut.ANNULEE]: {
    label: 'Annuler',
    icon: 'fa-xmark',
    class: 'btn-danger',
  },

  [ReservationStatut.ABSENT]: {
    label: 'Absent',
    icon: 'fa-user-slash',
    class: 'btn-secondary',
  },
};
