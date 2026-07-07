import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType =
    'success'
    | 'danger'
    | 'warning'
    | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    private toasts = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toasts.asObservable();

    show(message: string, type: ToastType = 'success', duration = 3000) {
        const toast: Toast = {
            id: Date.now(),
            message,
            type
        };

        this.toasts.next([
            ...this.toasts.value,
            toast
        ]);

        setTimeout(() => { this.remove(toast.id); }, duration);
    }

    success(message: string) {
        this.show(message, 'success');
    }

    error(message: string) {
        this.show(message, 'danger');
    }

    warning(message: string) {
        this.show(message, 'warning');
    }

    info(message: string) {
        this.show(message, 'info');
    }

    remove(id: number) {
        this.toasts.next(
            this.toasts.value.filter(
                t => t.id !== id
            )
        );
    }
}