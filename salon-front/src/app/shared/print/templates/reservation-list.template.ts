import { PrintDocument } from '../models/print-document';

export interface ReservationPrintOptions {
  dateDebut: Date;
  dateFin: Date;
  dureeParDefaut: number; // minutes
}

export function reservationListTemplate(reservations: any[], options: ReservationPrintOptions): PrintDocument {
  return {
    title: 'Liste des rendez-vous',

    subtitle: `Du ${formatDate(options.dateDebut)}
     au ${formatDate(options.dateFin)}`,

    date: new Date(),

    sections: [
      {
        title: 'Planning rendez-vous',

        type: 'TABLE',

        columns: [
          {
            field: 'date',
            label: 'Date',
          },

          {
            field: 'heure',
            label: 'Heure',
          },

          {
            field: 'client',
            label: 'Client',
          },

          {
            field: 'prestation',
            label: 'Prestation',
          },

          {
            field: 'personnel',
            label: 'Personnel',
          },

          {
            field: 'duree',
            label: 'Durée',
          },

          {
            field: 'fin',
            label: 'Fin',
          },

          {
            field: 'statut',
            label: 'Statut',
          },
        ],

        rows: reservations.map(r => {
          const duree = r.total_duree ?? options.dureeParDefaut;

          return {
            date: formatDate(r.date),
            heure: r.heure ?? '',
            client: r.client ? `${r.client.nom} ${r.client.prenom}` : 'Sans client',
            prestation: r.prestations ? r.prestations.map((p: any) => p.nom).join(', ') : '',
            personnel: r.personnel ? `${r.personnel.nom} ${r.personnel.prenom}` : '',
            duree: `${duree} min`,
            fin: calculateEndTime(r.heure, duree),
            statut: r.statut,
          };
        }),
      },
    ],
  };
}

function calculateEndTime(heure: string, duree: number) {
  if (!heure) return '';

  const [h, m] = heure.split(':').map(Number);

  const date = new Date();

  date.setHours(h);

  date.setMinutes(m + duree);

  return date.toTimeString().substring(0, 5);
}

function formatDate(date: any) {
  if (!date) return '';

  return new Date(date).toLocaleDateString('fr-FR');
}
