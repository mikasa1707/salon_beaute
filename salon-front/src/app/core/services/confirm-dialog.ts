import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmClass?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {
    private dialogSubject = new Subject<{
        data: ConfirmDialogData;
        result: (value: boolean) => void;
    }>();

    dialog$ = this.dialogSubject.asObservable();

    confirm(data: ConfirmDialogData): Promise<boolean> {  
        console.log('CONFIRM OPEN', data);
        return new Promise(resolve => {
            this.dialogSubject.next({
                data: {
                    confirmText: 'Confirmer',
                    cancelText: 'Annuler',
                    confirmClass: 'btn-primary',
                    ...data
                },
                result: resolve
            });
        });
    }
}