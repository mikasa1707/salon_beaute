import { PrintDocument } from '../models/print-document';

export function caisseJournalTemplate(data: any): PrintDocument {
  return {
    title: 'JOURNAL CAISSE',

    subtitle: `${data.dateDebut} au ${data.dateFin}`,

    date: new Date(),

    sections: [
      {
        type: 'INFO',

        items: [
          {
            label: 'Caisse',
            value: data.caisse,
          },

          {
            label: 'Ouverture',
            value: data.ouverture,
          },

          {
            label: 'Fermeture',
            value: data.fermeture,
          },
        ],
      },

      {
        title: 'Mouvements caisse',

        type: 'TABLE',

        columns: [
          {
            label: 'Date',
            field: 'date',
          },

          {
            label: 'Type',
            field: 'type',
          },

          {
            label: 'Libellé',
            field: 'libelle',
          },

          {
            label: 'Entrée',
            field: 'entree',
          },

          {
            label: 'Sortie',
            field: 'sortie',
          },
        ],

        rows: (data.mouvements ?? []).map((m: any) => ({
          date: m.date,

          type: m.type,

          libelle: m.libelle,

          entree: m.entree,

          sortie: m.sortie,
        })),
      },

      {
        type: 'TOTAL',

        items: [
          {
            label: 'Solde final',
            value: data.solde,
          },
        ],
      },
    ],
  };
}
