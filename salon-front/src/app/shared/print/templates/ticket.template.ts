import { PrintDocument } from '../models/print-document';

export function ticketTemplate(data: any): PrintDocument {
  return {
    title: 'TICKET CAISSE',

    subtitle: data.salon?.nom ?? 'Salon Beauté',

    date: new Date(data.date),

    sections: [
      {
        type: 'INFO',

        items: [
          {
            label: 'Ticket',
            value: data.numero,
          },

          {
            label: 'Client',
            value: data.client?.nom ?? 'Client comptoir',
          },

          {
            label: 'Paiement',
            value: data.paiement,
          },
        ],
      },

      {
        title: 'Articles',

        type: 'TABLE',

        columns: [
          {
            label: 'Article',
            field: 'designation',
          },

          {
            label: 'Qté',
            field: 'quantite',
          },

          {
            label: 'Total',
            field: 'total',
          },
        ],

        rows: (data.items ?? []).map((i: any) => ({
          designation: i.nom,

          quantite: i.quantite,

          total: i.total,
        })),
      },

      {
        type: 'TOTAL',

        items: [
          {
            label: 'TOTAL',
            value: data.total,
          },
        ],
      },
    ],
  };
}
