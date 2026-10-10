import { Injectable } from '@angular/core';
import { PageInfo } from '../interfaces/PageInfo';
import { CreateLabwork, Labwork } from '../interfaces/Labwork';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { mockLabworks } from './mock/labwork.mock';
import { of, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LabworkService {
    private readonly apiUrl = 'https://localhost:42700/api/labworks';

    public constructor(private readonly http: HttpClient) { }

    public getLabworks(
        page: number,
        size: number,
        sort: string[],
        search: string[]): Observable<PageInfo<Labwork>> {
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


        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        for (const sortItem of sort) {
            params = params.append('sort', sortItem);
        }

        for (const searchItem of search) {
            params = params.append('search', searchItem);
        }

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
            }

            return throwError(() => new Error(`Labwork with ID ${id} not found`));
        }

        return this.http.get<Labwork>(`${this.apiUrl}/${id}`);
    }

    public createLabwork(labwork: CreateLabwork): Observable<Labwork> {
        // Mock data
        if (environment.useMocks) {
            const newId = mockLabworks.length > 0 ? Math.max(...mockLabworks.map(l => l.id)) + 1 : 1;
            const newLabwork = { ...labwork, id: newId };
            mockLabworks.push(newLabwork);
            return of(newLabwork);
        }

        return this.http.post<Labwork>(this.apiUrl, labwork);
    }

    public updateLabwork(labworkId: number, data: Labwork): Observable<Labwork> {
        // Mock data
        if (environment.useMocks) {
            const index = mockLabworks.findIndex(l => l.id === labworkId);
            if (index !== -1) {
                mockLabworks[index] = data;
                return of(data);
            } else {
                throw new Error(`Labwork with ID ${labworkId} not found`);
            }
        }

        return this.http.patch<Labwork>(`${this.apiUrl}/${labworkId}`, data);
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
