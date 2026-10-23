import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly _toasts = signal<Toast[]>([]);
    readonly toasts = this._toasts.asReadonly();

    private nextId = 0;

    showError(message: string): void {
        const id = this.nextId++;

        this._toasts.update(toasts => [
            ...toasts,
            { id, message }
        ]);

        setTimeout(() => this.dismiss(id), 6000);
    }

    dismiss(id: number): void {
        this._toasts.update(toasts =>
            toasts.filter(toast => toast.id !== id)
        );
    }
}