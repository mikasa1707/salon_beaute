import { PrintDocument } from '../models/print-document';

export function venteJournalTemplate(data: any): PrintDocument {
  return {
    title: 'JOURNAL DES VENTES',

    subtitle: `${data.dateDebut} au ${data.dateFin}`,

    date: new Date(),

    sections: [
      {
        type: 'INFO',

        items: [
          {
            label: 'Nombre ventes',
            value: data.ventes?.length ?? 0,
          },

          {
            label: 'Chiffre affaire',
            value: data.total ?? 0,
          },
        ],
      },

      {
        title: 'Ventes',

        type: 'TABLE',

        columns: [
          {
            label: 'Date',
            field: 'date',
          },

          {
            label: 'N° Vente',
            field: 'numero',
          },

          {
            label: 'Client',
            field: 'client',
          },

          {
            label: 'Paiement',
            field: 'paiement',
          },

          {
            label: 'Total',
            field: 'total',
          },
        ],

        rows: (data.ventes ?? []).map((v: any) => ({
          date: v.date,

          numero: v.numero,

          client: v.client ?? 'Comptoir',

          paiement: v.paiement,

          total: v.total,
        })),
      },

      {
        type: 'TOTAL',

        items: [
          {
            label: 'TOTAL CA',
            value: data.total,
          },
        ],
      },
    ],
  };
}
