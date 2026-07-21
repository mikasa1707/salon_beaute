import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mouvement-list',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './mouvement-list.html',
})
export class MouvementList {
  @Input()
  data: any[] = [];

  getTypeClass(type: string) {
    switch (type) {
      case 'IN':
        return 'success';

      case 'OUT':
        return 'danger';

      case 'TRANSFERT':
        return 'primary';

      case 'ADJUST':
        return 'warning';

      default:
        return 'secondary';
    }
  }
}
