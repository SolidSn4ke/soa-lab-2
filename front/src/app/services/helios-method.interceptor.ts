import { HttpInterceptorFn } from '@angular/common/http';
import { API_URLS } from '../constants/api.constants';

// Helios accepts POST at the PHP gateway but rejects direct PUT/PATCH/DELETE.
export const heliosMethodInterceptor: HttpInterceptorFn = (req, next) => {
    if (API_URLS.labwork.endsWith('.php')
        && req.url.startsWith(`${API_URLS.labwork}/`)
        && ['PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return next(req.clone({
            method: 'POST',
            setHeaders: { 'X-HTTP-Method-Override': req.method },
        }));
    }

    return next(req);
};
