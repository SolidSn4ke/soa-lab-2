import { Injectable, signal } from '@angular/core';
import { Toast } from '../interfaces/Toast';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly _toasts = signal<Toast[]>([]);
    public readonly toasts = this._toasts.asReadonly();

    private nextId = 0;

    public showError(
        status: number,
        message: string,
        details: string | string[]
    ): void {
        const id = this.nextId++;

        this._toasts.update(toasts => [
            ...toasts,
            { id, status, message, details }
        ]);

        setTimeout(() => this.dismiss(id), 6000);
    }

    public dismiss(id: number): void {
        this._toasts.update(toasts =>
            toasts.filter(toast => toast.id !== id)
        );
    }
}