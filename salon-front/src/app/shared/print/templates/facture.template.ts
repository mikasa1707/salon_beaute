import { PrintDocument } from '../models/print-document';

export function factureTemplate(data: any): PrintDocument {
  return {
    title: 'FACTURE',

    subtitle: data.salon?.nom ?? 'Salon Beauté',

    date: new Date(data.date),

    sections: [
      {
        type: 'INFO',

        items: [
          {
            label: 'N° Facture',
            value: data.numero,
          },

          {
            label: 'Client',
            value: `${data.client?.nom ?? ''} ${data.client?.prenom ?? ''}`,
          },

          {
            label: 'Téléphone',
            value: data.client?.telephone ?? '',
          },
        ],
      },

      {
        title: 'Prestations',

        type: 'TABLE',

        columns: [
          {
            label: 'Désignation',
            field: 'designation',
          },

          {
            label: 'Quantité',
            field: 'quantite',
          },

          {
            label: 'Prix',
            field: 'prix',
          },

          {
            label: 'Total',
            field: 'total',
          },
        ],

        rows: (data.prestations ?? []).map((p: any) => ({
          designation: p.nom,

          quantite: 1,

          prix: p.prix,

          total: p.prix,
        })),
      },

      {
        title: 'Produits',

        type: 'TABLE',

        columns: [
          {
            label: 'Produit',
            field: 'designation',
          },

          {
            label: 'Qté',
            field: 'quantite',
          },

          {
            label: 'Prix',
            field: 'prix',
          },

          {
            label: 'Total',
            field: 'total',
          },
        ],

        rows: (data.produits ?? []).map((p: any) => ({
          designation: p.nom,

          quantite: p.quantite,

          prix: p.prix,

          total: p.quantite * p.prix,
        })),
      },

      {
        type: 'TOTAL',

        items: [
          {
            label: 'Sous total',
            value: data.total,
          },

          {
            label: 'Remise',
            value: data.remise ?? 0,
          },

          {
            label: 'TOTAL',
            value: data.totalFinal ?? data.total,
          },
        ],
      },
    ],
  };
}
