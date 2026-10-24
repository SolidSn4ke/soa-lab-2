import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { fromXml } from '../utils/xml.utils';
import { ErrorMsg } from '../interfaces/ErrorMsg';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notifications = inject(NotificationService);

    return next(req).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse) {
                let message = error.message;
                let details: string | string[] = [];

                if (error.status === 0) {
                    message = 'Server is unavailable. Check your connection.';
                } else if (typeof error.error === 'string') {
                    try {
                        const response = fromXml<ErrorMsg>(error.error);
                        message = response.msg || message;

                        const detail = response.details?.detail;
                        details = detail
                            ? Array.isArray(detail) ? detail : [detail]
                            : [];
                    } catch {
                        message = error.error || message;
                    }
                }

                notifications.showError(
                    error.status,
                    message,
                    details
                );
            }

            return throwError(() => error);
        })
    );
};