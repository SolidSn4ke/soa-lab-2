import { Component, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FilterItem } from '../../interfaces/FilterItem';
import { FormsModule } from '@angular/forms';
import { DisciplineService } from '../../services/discipline.service';
import { Discipline } from '../../interfaces/Discipline';
import { SortItem } from '../../interfaces/SortItem';
import { DisciplineForm } from '../../components/discipline-form/discipline-form';
import { Router } from '@angular/router';
import { Pagination } from '../../components/pagination/pagination';
import { FilterField, FilterPanel } from '../../components/filter-panel/filter-panel';
import { getVisiblePages } from '../../utils/pagination.utils';
import { buildSearchParams, buildSortParams } from '../../utils/query-params.utils';
import { finalize } from 'rxjs';

@Component({
  imports: [FormsModule, DisciplineForm, Pagination, FilterPanel],
  selector: 'app-disciplines',
  styleUrl: './disciplines.scss',
  templateUrl: './disciplines.html',
})
export class Disciplines implements OnInit {
  public disciplines: Discipline[] = [];

  public currentPage: number = 0;
  public totalPages: number = 0;
  public pageSize: number = 10;
  public totalElements: number = 0;

  public sortRules: SortItem[] = [];
  public filters: FilterItem[] = [];

  public isFormOpen: boolean = false;

  public isLoading: WritableSignal<boolean> = signal(false);
  public errorMessage: string | null = null;

  public readonly filterFields: FilterField[] = [
    { value: 'name', label: 'Name' },
    { value: 'labsCount', label: 'Labs Count' },
  ]

  public constructor(private disciplineService: DisciplineService, private router: Router) { }

  public ngOnInit() {
    this.loadDisciplines();
  }

  public loadDisciplines(): void {
    this.isLoading.set(true);
    this.errorMessage = null;

    const sort = buildSortParams(this.sortRules);
    const search = buildSearchParams(this.filters);

    this.disciplineService.getDisciplines(this.currentPage, this.pageSize, sort, search)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (pageInfo) => {
          this.disciplines = pageInfo.items;
          this.currentPage = pageInfo.page;
          this.pageSize = pageInfo.size;
          this.totalPages = pageInfo.totalPages;
          this.totalElements = pageInfo.totalElements;
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
  }

  public addSearch(): void {
    this.filters.push({
      field: 'name',
      operator: '~',
      value: '',
    });
  }

  public applyFilters(): void {
    this.filters = this.filters.filter(
      filter => filter.value.trim() !== ''
    );

    this.currentPage = 0;
    this.loadDisciplines();
  }

  public onCreateDisciplineClick(): void {
    this.isFormOpen = true;
  }

  public get visiblePages(): number[] {
    return getVisiblePages(this.currentPage, this.totalPages);
  }

  public closeForm(): void {
    this.isFormOpen = false;
  }

  public onDisciplineSaved(): void {
    this.closeForm();
    this.loadDisciplines();
  }

  public clearSort() {
    this.sortRules = [];
    this.loadDisciplines();
  }

  public getSort(field: string): 'asc' | 'desc' | null {
    const currentRule = this.sortRules.find(
      rule => rule.field === field
    );

    if (currentRule) {
      return currentRule.direction;
    }

    return null;
  }

  public onDisciplineClick(disciplineId: string): void {
    this.router.navigate(['/disciplines', disciplineId]);
  }


  public goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadDisciplines();
  }

  public onSortClick(field: string) {
    const currentRule = this.sortRules.find(
      rule => rule.field === field
    );

    const direction = currentRule?.direction === 'asc' ? 'desc' : 'asc';
    if (currentRule) {
      this.sortRules.forEach(
        rule => {
          if (rule === currentRule) {
            rule.direction = direction;
          }
        }
      )
    } else {
      this.sortRules.push({ field, direction });
    }


    this.currentPage = 0;
    this.loadDisciplines();
  }
}
