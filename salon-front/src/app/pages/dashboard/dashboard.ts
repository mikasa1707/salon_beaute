import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PrestationStat {
  nom: string;
  quantite: number;
  caGenere: number;
}

interface EmployeStat {
  nom: string;
  role: string;
  prestationsCount: number;
  ChiffreAffaire: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  // KPIs Principaux
  chiffreAffairesDuJour = 1240.50; 
  reservationsDuJourCount = 14;
  produitsStockFaible = 3;

  // Listes Top
  topPrestations: PrestationStat[] = [
    { nom: 'Coupe + Ombré Hair / Balayage', quantite: 24, caGenere: 2160 },
    { nom: 'Coupe Homme + Barbe', quantite: 42, caGenere: 1470 },
    { nom: 'Soin Botox Capillaire', quantite: 12, caGenere: 1080 }
  ];

  topEmployes: EmployeStat[] = [
    { nom: 'Sarah Martin', role: 'Coloriste Expert', prestationsCount: 58, ChiffreAffaire: 3200 },
    { nom: 'Thomas Dubois', role: 'Barbier / Visagiste', prestationsCount: 49, ChiffreAffaire: 2100 },
    { nom: 'Elodie Petit', role: 'Coiffeuse Polyvalente', prestationsCount: 34, ChiffreAffaire: 1650 }
  ];

  constructor() {}

  ngOnInit(): void {}
}