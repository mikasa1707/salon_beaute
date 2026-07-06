import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth';
import { jwtDecode } from 'jwt-decode';

type MenuKey = 'reservation' | 'prestations' | 'produits' | 'stock' | 'ventes';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
  role = '';
  openMenu: MenuKey | null = null;

  @Input() isCollapsed = false;
  @Input() isMobileOpen = false;
  @Output() closeMobile = new EventEmitter<void>();

  constructor(
    private auth: AuthService,
    public router: Router,
  ) {
    const token = this.auth.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.role = decoded.role;
      } catch {}
    }
  }

  ngOnInit() {
    // 1. Initialiser le menu au chargement direct
    this.openMenu = this.getActiveMenu();

    // 2. N'écouter QUE les fins de navigation pour éviter de spammer la fonction
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.openMenu = this.getActiveMenu();
    });
  }

  // Ouvre ou ferme un menu (Comportement de l'accordéon)
  toggleMenu(menu: MenuKey) {
    // Si le menu cliqué est déjà ouvert...
    if (this.openMenu === menu) {
      // ... on le ferme UNIQUEMENT si ce n'est pas le menu actif (celui de la page courante).
      // S'il est actif, la condition n'est pas remplie, donc il reste ouvert !
      if (!this.isRouteActive(menu)) {
        this.openMenu = null;
      }
    }
    // Sinon, on l'ouvre (et cela ferme automatiquement les autres grâce à cette affectation unique)
    else {
      this.openMenu = menu;
    }
  }

  // Vérifie si un menu est DÉROULÉ
  isMenuOpen(menu: MenuKey): boolean {
    return this.openMenu === menu;
  }

  // =========================
  // ACTIVE ROUTE HELPERS
  // =========================

  private cleanUrl(): string {
    return this.router.url.split('?')[0].split('#')[0];
  }

  getActiveMenu(): MenuKey | null {
    const url = this.cleanUrl();

    if (url.startsWith('/reservations')) return 'reservation';
    if (url.startsWith('/prestations')) return 'prestations';
    if (url.startsWith('/produits')) return 'produits';
    if (url.startsWith('/stock')) return 'stock';
    if (url.startsWith('/ventes')) return 'ventes';

    return null;
  }

  // Vérifie si la ROUTE est active (pour colorer le parent même si l'accordéon est fermé)
  isRouteActive(menu: MenuKey): boolean {
    return this.getActiveMenu() === menu;
  }

  // =========================
  closeMobileMenu() {
    this.closeMobile.emit();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 992) {
      this.isMobileOpen = false;
    }
  }
}
