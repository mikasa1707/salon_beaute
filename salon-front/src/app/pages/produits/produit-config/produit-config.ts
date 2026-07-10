import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarqueList } from "../../marques/marque-list/marque-list";
import { TypeProduits } from "../type-produits/type-produits";
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header";

@Component({
  selector: 'app-produit-config',
  standalone: true,
  imports: [
    CommonModule,
    MarqueList,
    TypeProduits,
    PageHeaderComponent
],
  templateUrl: './produit-config.html',
  styleUrl: './produit-config.scss',
})
export class ProduitConfig {
  activeTab: 'marques' | 'types' = 'marques';

  changeTab(tab: 'marques' | 'types') {
    this.activeTab = tab;
  }
}