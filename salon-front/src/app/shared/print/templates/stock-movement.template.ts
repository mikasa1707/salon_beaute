import { PrintDocument } from '../models/print-document';

export function stockMovementTemplate(data: any): PrintDocument {
  return {
    title: 'MOUVEMENTS STOCK',

    subtitle: `${data.dateDebut} au ${data.dateFin}`,

    date: new Date(),

    sections: [
      {
        title: 'Mouvements',

        type: 'TABLE',

        columns: [
          {
            label: 'Date',
            field: 'date',
          },

          {
            label: 'Produit',
            field: 'produit',
          },

          {
            label: 'Type',
            field: 'type',
          },

          {
            label: 'Quantité',
            field: 'quantite',
          },

          {
            label: 'Note',
            field: 'note',
          },
        ],

        rows: (data.movements ?? []).map((m: any) => ({
          date: m.date,

          produit: m.produit?.nom,

          type: m.type,

          quantite: m.quantite,

          note: m.note,
        })),
      },
    ],
  };
}
