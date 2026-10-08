import { Injectable } from '@angular/core';
import { PageInfo } from '../interfaces/PageInfo';
import { Labwork } from '../interfaces/Labwork';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LabworkService {
    private readonly apiUrl = 'https://localhost:42700/api/labworks';

    public constructor(private readonly http: HttpClient) { }

    public getLabworks(page: number, size: number): Observable<PageInfo<Labwork>> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<PageInfo<Labwork>>(
            this.apiUrl,
            { params }
        );
    }
}
