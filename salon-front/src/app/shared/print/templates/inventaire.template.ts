import { PrintDocument } from '../models/print-document';

export function inventaireTemplate(data: any): PrintDocument {
  return {
    title: 'INVENTAIRE STOCK',

    subtitle: data.date,

    date: new Date(),

    sections: [
      {
        type: 'INFO',

        items: [
          {
            label: 'Responsable',
            value: data.user,
          },

          {
            label: 'Lieu',
            value: data.salon,
          },
        ],
      },

      {
        title: 'Inventaire',

        type: 'TABLE',

        columns: [
          {
            label: 'Produit',
            field: 'produit',
          },

          {
            label: 'Stock théorique',
            field: 'stock',
          },

          {
            label: 'Stock réel',
            field: 'compte',
          },

          {
            label: 'Ecart',
            field: 'ecart',
          },
        ],

        rows: (data.items ?? []).map((i: any) => ({
          produit: i.produit,

          stock: i.stock,

          compte: i.compte,

          ecart: i.compte - i.stock,
        })),
      },
    ],
  };
}
