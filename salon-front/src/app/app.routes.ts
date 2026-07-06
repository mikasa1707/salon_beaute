import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },

      // ==========================
      // CLIENTS
      // ==========================

      {
        path: 'clients',
        loadComponent: () =>
          import('./pages/clients/client-list/client-list').then((m) => m.ClientList),
      },

      {
        path: 'clients/new',
        loadComponent: () =>
          import('./pages/clients/client-form/client-form').then((m) => m.ClientForm),
      },

      {
        path: 'clients/:id',
        loadComponent: () =>
          import('./pages/clients/client-form/client-form').then((m) => m.ClientForm),
      },

      // ==========================
      // PERSONNEL
      // ==========================

      {
        path: 'personnels',
        loadComponent: () =>
          import('./pages/personnels/personnel-list/personnel-list').then((m) => m.PersonnelList),
      },

      {
        path: 'personnels/new',
        loadComponent: () =>
          import('./pages/personnels/personnel-form/personnel-form').then((m) => m.PersonnelForm),
      },

      // ==========================
      // RESERVATIONS
      // ==========================

      {
        path: 'reservations',
        loadComponent: () =>
          import('./pages/reservations/calendar/calendar').then((m) => m.Calendar),
      },

      {
        path: 'reservations/new',
        loadComponent: () =>
          import('./pages/reservations/reservation-form/reservation-form').then(
            (m) => m.ReservationForm,
          ),
      },

      // ==========================
      // PRESTATIONS
      // ==========================

      {
        path: 'prestations',
        loadComponent: () =>
          import('./pages/prestations/prestation-list/prestation-list').then(
            (m) => m.PrestationList,
          ),
      },

      {
        path: 'prestations/types-prestations',
        loadComponent: () =>
          import('./pages/prestations/type-prestation-list/type-prestation-list').then(
            (m) => m.TypePrestationList,
          ),
      },

      // ==========================
      // PRODUITS
      // ==========================

      {
        path: 'produits',
        loadComponent: () =>
          import('./pages/produits/produit-list/produit-list').then((m) => m.ProduitList),
      },

      {
        path: 'produits/config',
        loadComponent: () =>
          import('./pages/produits/produit-config/produit-config').then((m) => m.ProduitConfig),
      },

      {
        path: 'produits/marques',
        loadComponent: () =>
          import('./pages/marques/marque-list/marque-list').then((m) => m.MarqueList),
      },
      // ==========================
      // STOCK
      // ==========================

      {
        path: 'stock',
        loadComponent: () =>
          import('./pages/stocks/stock-list/stock-list').then((m) => m.StockList),
      },

      {
        path: 'stock/inventaires',
        loadComponent: () =>
          import('./pages/inventaires/inventaire-list/inventaire-list').then(
            (m) => m.InventaireList,
          ),
      },

      {
        path: 'stock/stock-alerts',
        loadComponent: () =>
          import('./pages/stocks/stock-alert/stock-alert').then((m) => m.StockAlert),
      },

      // ==========================
      // VENTES
      // ==========================

      {
        path: 'ventes',
        loadComponent: () =>
          import('./pages/ventes/vente-list/vente-list').then((m) => m.VenteList),
      },

      {
        path: 'ventes/:id',
        loadComponent: () =>
          import('./pages/ventes/vente-details/vente-details').then((m) => m.VenteDetails),
      },

      {
        path: 'ventes/checkout',
        loadComponent: () => import('./pages/ventes/checkout/checkout').then((m) => m.Checkout),
      },

      // ==========================
      // FACTURATION
      // ==========================

      {
        path: 'facturations',
        loadComponent: () =>
          import('./pages/facturations/facturation-list/facturation-list').then(
            (m) => m.FacturationList,
          ),
      },

      {
        path: 'paiements',
        loadComponent: () =>
          import('./pages/paiements/paiement-list/paiement-list').then((m) => m.PaiementList),
      },

      // ==========================
      // CAISSE
      // ==========================

      {
        path: 'caisse',
        loadComponent: () =>
          import('./pages/caisses/cash-register/cash-register').then((m) => m.CashRegister),
      },

      {
        path: 'caisse/historique-caisse',
        loadComponent: () =>
          import('./pages/caisses/cash-history/cash-history').then((m) => m.CashHistory),
      },

      // ==========================
      // PLANNING
      // ==========================

      {
        path: 'planning',
        loadComponent: () =>
          import('./pages/planning/planning-calendar/planning-calendar').then(
            (m) => m.PlanningCalendar,
          ),
      },

      // ==========================
      // CONFIGURATION
      // ==========================

      {
        path: 'configuration',
        loadComponent: () =>
          import('./pages/configuration/configuration').then((m) => m.Configuration),
      },
    ],
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/auth/pages/login/login').then((m) => m.Login),
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
