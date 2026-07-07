import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService, ConfirmDialogData } from '../../../core/services/confirm-dialog';


@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialogComponent {

  private service = inject(ConfirmDialogService);

  visible = false;
  data!: ConfirmDialogData;
  private resolve!: (value: boolean) => void;

  constructor(private cdr: ChangeDetectorRef) {
    this.service.dialog$.subscribe(dialog => {
      console.log('DIALOG RECEIVED');
      this.data = dialog.data;
      this.resolve = dialog.result;
      this.visible = true;
      this.cdr.detectChanges();
    });
  }

  close(result: boolean) {
    this.visible = false;
    this.resolve(result);
  }
}