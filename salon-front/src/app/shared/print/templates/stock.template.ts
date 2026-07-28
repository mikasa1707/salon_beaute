import { PrintDocument } from '../models/print-document';

export function stockTemplate(data: any): PrintDocument {
  return {
    title: 'ETAT DU STOCK',

    subtitle: data.date,

    date: new Date(),

    sections: [
      {
        type: 'INFO',

        items: [
          {
            label: 'Filtre',
            value: data.categorie ?? 'Tous',
          },
        ],
      },

      {
        title: 'Stock actuel',

        type: 'TABLE',

        columns: [
          {
            label: 'Produit',
            field: 'produit',
          },

          {
            label: 'Unité',
            field: 'unite',
          },

          {
            label: 'Stock',
            field: 'stock',
          },

          {
            label: 'Minimum',
            field: 'stockMinimum',
          },
        ],

        rows: (data.stocks ?? []).map((s: any) => ({
          produit: s.produit?.nom,

          unite: s.nom,

          stock: s.stock,

          stockMinimum: s.stock_minimum,
        })),
      },
    ],
  };
}
