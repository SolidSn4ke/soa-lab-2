import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { mockDisciplines } from './mock/discipline.mock';
import { Observable, of } from 'rxjs';
import { Discipline } from '../interfaces/Discipline';

@Injectable({
    providedIn: 'root'
})
export class DisciplineService {
    private readonly apiUrl = 'https://localhost:42700/api/disciplines';

    public constructor(private readonly http: HttpClient) { }

    public getDisciplines(): Observable<Discipline[]> {
        //Mock data
        if (environment.useMocks) {
            return of(mockDisciplines);
        }

        return this.http.get<Discipline[]>(this.apiUrl);
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

    public updateDiscipline(discipline: Discipline): Observable<Discipline> {
        //Mock data
        if (environment.useMocks) {
            const index = mockDisciplines.findIndex(d => d.name === discipline.name);
            if (index !== -1) {
                mockDisciplines[index] = discipline;
                return of(discipline);
            } else {
                throw new Error(`Discipline with ID ${discipline.name} not found`);
            }
        }

        return this.http.put<Discipline>(`${this.apiUrl}/${discipline.name}`, discipline);
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
}
