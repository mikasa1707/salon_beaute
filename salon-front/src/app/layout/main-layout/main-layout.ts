import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { NavbarComponent } from '../navbar/navbar';
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog";
import { ToastContainer } from "../../shared/components/toast-container/toast-container";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent, ConfirmDialogComponent, ToastContainer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  isCollapsed = false;
  isMobileOpen = false;

  notifications = [];
  notificationsCount = 0;

  stockAlerts = [];
  stockAlertsCount = 0;

  user: any;

  
  constructor(
    private router: Router,
  ) { }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMobile() {
    this.isMobileOpen = true;
  }

  closeMobile() {
    this.isMobileOpen = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
