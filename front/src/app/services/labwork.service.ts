import { Injectable } from '@angular/core';
import { PageInfo } from '../interfaces/PageInfo';
import { CreateLabwork, Labwork } from '../interfaces/Labwork';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { mockLabworks } from './mock/labwork.mock';
import { map, of, throwError } from 'rxjs';
import { Difficulty } from '../interfaces/Difficulty';
import { API_URLS } from '../constants/api.constants';
import { fromXml, toXml } from '../utils/xml.utils';

@Injectable({
    providedIn: 'root'
})
export class LabworkService {
    private readonly labworkApiUrl = `${API_URLS.labwork}/labworks`;
    private readonly barsApiUrl = `${API_URLS.bars}/discipline`;

    private readonly xmlHeaders = new HttpHeaders({
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
    })

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

        return this.http.get(this.labworkApiUrl, {
            params,
            headers: this.xmlHeaders,
            responseType: 'text'
        }).pipe(
            map(xml => fromXml<PageInfo<Labwork>>(xml))
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

        return this.http.get(
            `${this.labworkApiUrl}/${id}`,
            { headers: this.xmlHeaders, responseType: 'text' }
        ).pipe(
            map(xml => fromXml<Labwork>(xml))
        );
    }

    public createLabwork(labwork: CreateLabwork): Observable<Labwork> {
        // Mock data
        if (environment.useMocks) {
            const newId = mockLabworks.length > 0 ? Math.max(...mockLabworks.map(l => l.id)) + 1 : 1;
            const newLabwork = { ...labwork, id: newId };
            mockLabworks.push(newLabwork);
            return of(newLabwork);
        }

        return this.http.post(
            this.labworkApiUrl,
            toXml('LabWork', labwork),
            { headers: this.xmlHeaders, responseType: 'text' }
        ).pipe(
            map(xml => fromXml<Labwork>(xml))
        );
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

        return this.http.put(
            `${this.labworkApiUrl}/${labworkId}`,
            toXml('LabWork', data),
            { headers: this.xmlHeaders, responseType: 'text' }
        ).pipe(
            map(xml => fromXml<Labwork>(xml))
        );
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

        return this.http.delete<void>(`${this.labworkApiUrl}/${id}`, { headers: this.xmlHeaders });
    }

    public removeDiscipline(labwork: Labwork): Observable<void> {
        const disciplineId = labwork.discipline?.name;

        //Mock data
        if (environment.useMocks) {
            return of(undefined);
        }

        return this.http.delete<void>(`${this.barsApiUrl}/${disciplineId}/labwork/${labwork.id}/remove`);
    }

    public removeByDifficulty(difficulty: Difficulty): Observable<void> {
        //Mock data
        if (environment.useMocks) {
            return of(undefined);
        }

        let params = new HttpParams().set('difficulty', difficulty)
        return this.http.delete<void>(`${this.labworkApiUrl}`, { params });
    }
}
