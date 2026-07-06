import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  stockAlertsCount: number = 0;
  stockAlerts: any[] = [];
  notificationsCount: number = 0;
  notifications: any[] = [];
  user: any;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}
