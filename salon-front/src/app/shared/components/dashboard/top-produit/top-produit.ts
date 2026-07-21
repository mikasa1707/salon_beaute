import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-produit',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './top-produit.html',
})
export class TopProduit {
  @Input()
  data: any[] = [];
}
