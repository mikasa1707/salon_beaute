import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-prestation',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './top-services.html',
})
export class TopPrestation {
  @Input()
  data: any[] = [];
}
