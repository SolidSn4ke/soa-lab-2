import {
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notifications = inject(NotificationService);

    return next(req).pipe(
        catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse) {
                let message = 'An unexpected server error occurred.';

                if (error.status === 0) {
                    message = 'Server is unavailable. Check your connection.';
                } else if (error.status === 400) {
                    message = 'Invalid request.';
                } else if (error.status === 404) {
                    message = 'Requested resource was not found.';
                } else if (error.status >= 500) {
                    message = 'Server error. Please try again later.';
                }

                notifications.showError(message);
            }

            return throwError(() => error);
        })
    );
};