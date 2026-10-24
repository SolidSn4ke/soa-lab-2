import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { mockDisciplines } from './mock/discipline.mock';
import { EMPTY, expand, map, Observable, of, reduce } from 'rxjs';
import { Discipline } from '../interfaces/Discipline';
import { PageInfo } from '../interfaces/PageInfo';
import { API_URLS } from '../constants/api.constants';
import { fromXml, toXml } from '../utils/xml.utils';

@Injectable({
    providedIn: 'root'
})
export class DisciplineService {
    private readonly labworkApiUrl = `${API_URLS.labwork}/disciplines`;
    private readonly barsApiUrl = `${API_URLS.bars}/discipline`;

    private readonly xmlHeaders = new HttpHeaders({
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
    })

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

        return this.http.get(this.labworkApiUrl, {
            params,
            headers: this.xmlHeaders,
            responseType: 'text'
        }).pipe(
            map(xml => fromXml<PageInfo<Discipline>>(xml))
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

        return this.http.get(`${this.labworkApiUrl}/${id}`, {
            headers: this.xmlHeaders,
            responseType: 'text'
        }
        ).pipe(
            map(xml => fromXml<Discipline>(xml))
        );
    }

    public createDiscipline(discipline: Discipline): Observable<Discipline> {
        //Mock data
        if (environment.useMocks) {
            const newDiscipline = { ...discipline, id: mockDisciplines.length + 1 };
            mockDisciplines.push(newDiscipline);
            return of(newDiscipline);
        }

        return this.http.post(
            this.labworkApiUrl,
            toXml('Discipline', discipline),
            {
                headers: this.xmlHeaders,
                responseType: 'text'
            })
            .pipe(
                map(xml => fromXml<Discipline>(xml))
            );
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

        return this.http.put(
            `${this.labworkApiUrl}/${disciplineId}`,
            toXml('Discipline', data),
            {
                headers: this.xmlHeaders,
                responseType: 'text'
            }
        ).pipe(
            map(xml => fromXml<Discipline>(xml))
        );
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

        return this.http.delete<void>(
            `${this.labworkApiUrl}/${id}`,
            { headers: this.xmlHeaders });
    }

    public makeHardcore(disciplineId: string): Observable<void> {
        //Mock data
        if (environment.useMocks) {
            return of(void 0);
        }

        return this.http.post<void>(`${this.barsApiUrl}/${disciplineId}/make-hardcore`, null);
    }

    public getAllDisciplines(): Observable<Discipline[]> {
        return this.getDisciplines(0, 100, [], []).pipe(
            expand(pageInfo => {
                const nextPage = pageInfo.page + 1;

                if (nextPage >= pageInfo.totalPages) {
                    return EMPTY;
                }

                return this.getDisciplines(nextPage, 100, [], []);
            }),
            reduce((all, pageInfo) => all.concat(pageInfo.items), [] as Discipline[])
        );
    }
}
