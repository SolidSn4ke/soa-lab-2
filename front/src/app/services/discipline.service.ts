import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mockDisciplines } from './mock/discipline.mock';
import { Observable, of } from 'rxjs';
import { Discipline } from '../interfaces/Discipline';
import { PageInfo } from '../interfaces/PageInfo';

@Injectable({
    providedIn: 'root'
})
export class DisciplineService {
    private readonly apiUrl = 'https://localhost:42700/api/disciplines';
    private readonly secondService = 'https://localhost:42700/bars/discipline';

    public constructor(private readonly http: HttpClient) { }

    public getDisciplines(
        page: number,
        size: number,
        sort: string[],
        search: string[]): Observable<PageInfo<Discipline>> {
        // Mock data
        if (environment.useMocks) {
            const start = page * size;
            const end = start + size;
            const items = mockDisciplines.slice(start, end);

            return of({
                page: page,
                size: size,
                totalPages: Math.ceil(mockDisciplines.length / size),
                totalElements: mockDisciplines.length,
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

        return this.http.get<PageInfo<Discipline>>(
            this.apiUrl,
            { params }
        );
    }

    public getById(id: string): Observable<Discipline> {
        //Mock data
        if (environment.useMocks) {
            const discipline = mockDisciplines.find(d => d.name === id);
            if (discipline) {
                return of(discipline);
            } else {
                throw new Error(`Discipline with ID ${id} not found`);
            }
        }

        return this.http.get<Discipline>(`${this.apiUrl}/${id}`);
    }

    public createDiscipline(discipline: Discipline): Observable<Discipline> {
        //Mock data
        if (environment.useMocks) {
            const newDiscipline = { ...discipline, id: mockDisciplines.length + 1 };
            mockDisciplines.push(newDiscipline);
            return of(newDiscipline);
        }

        return this.http.post<Discipline>(this.apiUrl, discipline);
    }

    public updateDiscipline(disciplineId: string, data: Discipline): Observable<Discipline> {
        //Mock data
        if (environment.useMocks) {
            const index = mockDisciplines.findIndex(d => d.name === disciplineId);
            if (index !== -1) {
                mockDisciplines[index] = data;
                return of(data);
            } else {
                throw new Error(`Discipline with ID ${disciplineId} not found`);
            }
        }

        return this.http.put<Discipline>(`${this.apiUrl}/${disciplineId}`, data);
    }

    public deleteDiscipline(id: string): Observable<void> {
        //Mock data
        if (environment.useMocks) {
            const index = mockDisciplines.findIndex(d => d.name === id);
            if (index !== -1) {
                mockDisciplines.splice(index, 1);
                return of(void 0);
            } else {
                throw new Error(`Discipline with ID ${id} not found`);
            }
        }

        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    public makeHardcore(disciplineId: string): Observable<void> {
        if (environment.useMocks) {
            return of(void 0);
        }

        return this.http.post<void>(`${this.secondService}/${disciplineId}/make-hardcore`, null);
    }
}
