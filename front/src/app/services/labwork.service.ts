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

    public getById(id: number): Observable<Labwork> {
        // Mock data
        if (environment.useMocks) {
            const labwork = mockLabworks.find(l => l.id === id);
            if (labwork) {
                return of(labwork);
            } else {
                throw new Error(`Labwork with ID ${id} not found`);
            }
        }

        return this.http.get<Labwork>(`${this.apiUrl}/${id}`);
    }

    public deleteLabwork(id: number): Observable<void> {
        // Mock data
        if (environment.useMocks) {
            const index = mockLabworks.findIndex(l => l.id === id);
            if (index !== -1) {
                mockLabworks.splice(index, 1);
                return of(undefined);
            } else {
                throw new Error(`Labwork with ID ${id} not found`);
            }
        }

        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
