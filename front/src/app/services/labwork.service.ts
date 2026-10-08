import { Injectable } from '@angular/core';
import { PageInfo } from '../interfaces/PageInfo';
import { Labwork } from '../interfaces/Labwork';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { mockLabworks } from './mock/labwork.mock';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LabworkService {
    private readonly apiUrl = 'https://localhost:42700/api/labworks';

    public constructor(private readonly http: HttpClient) { }

    public getLabworks(page: number, size: number): Observable<PageInfo<Labwork>> {
        // Mock data
        if (environment.useMocks) {
            const start = page * size;
            const end = start + size;
            const items = mockLabworks.slice(start, end);

            return of({
                page: page,
                size: size,
                totalPages: Math.ceil(mockLabworks.length / size),
                totalElements: mockLabworks.length,
                items: items
            });
        }


        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<PageInfo<Labwork>>(
            this.apiUrl,
            { params }
        );
    }
}
