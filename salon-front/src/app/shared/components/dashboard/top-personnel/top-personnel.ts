import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-personnel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-personnel.html',
})
export class TopPersonnel {
  @Input()
  data: any[] = [];
}
