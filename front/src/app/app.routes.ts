import { Routes } from '@angular/router';
import { Labworks } from './pages/labworks/labworks';
import { NotFound } from './pages/not-found/not-found';
import { LabworkDetails } from './pages/labwork-details/labwork-details';
import { Disciplines } from './pages/disciplines/disciplines';
import { DisciplineDetails } from './pages/discipline-details/discipline-details';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'labworks',
        pathMatch: 'full'
    },
    {
        path: 'labworks',
        component: Labworks
    },
    {
        path: 'labworks/:id',
        component: LabworkDetails
    },
    {
        path: 'disciplines',
        component: Disciplines
    },
    {
        path: 'disciplines/:id',
        component: DisciplineDetails
    },
    {
        path: '**',
        component: NotFound
    }
];
