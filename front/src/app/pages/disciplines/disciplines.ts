import { Component, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FilterItem } from '../../interfaces/FilterItem';
import { FormsModule } from '@angular/forms';
import { DisciplineService } from '../../services/discipline.service';
import { Discipline } from '../../interfaces/Discipline';
import { SortItem } from '../../interfaces/SortItem';
import { DisciplineForm } from '../../components/discipline-form/discipline-form';
import { Router } from '@angular/router';
import { Pagination } from '../../components/pagination/pagination';
import { FilterPanel } from '../../components/filter-panel/filter-panel';
import { getVisiblePages } from '../../utils/pagination.utils';
import { buildSearchParams, buildSortParams } from '../../utils/query-params.utils';
import { Subject, timer, switchMap, takeUntil, tap, finalize, merge, catchError, EMPTY } from 'rxjs';
import { FilterField } from '../../interfaces/FilterField';

@Component({
  imports: [FormsModule, DisciplineForm, Pagination, FilterPanel],
  selector: 'app-disciplines',
  styleUrl: './disciplines.scss',
  templateUrl: './disciplines.html',
})
export class Disciplines implements OnInit, OnDestroy {
  public disciplines: Discipline[] = [];

  public currentPage: number = 0;
  public totalPages: number = 0;
  public pageSize: number = 10;
  public totalElements: number = 0;

  public sortRules: SortItem[] = [];
  public filters: FilterItem[] = [];

  public isFormOpen: boolean = false;

  public isLoading: WritableSignal<boolean> = signal(false);

  public readonly filterFields: FilterField[] = [
    { value: 'name', label: 'Name', type: 'string' },
    { value: 'labsCount', label: 'Labs Count', type: 'number' },
  ]

  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new Subject<void>();

  private readonly pollingInterval = 10_000;

  public constructor(private disciplineService: DisciplineService, private router: Router) { }

  public ngOnInit(): void {
    merge(
      timer(0, this.pollingInterval),
      this.refresh$
    )
      .pipe(
        switchMap(() => {
          this.isLoading.set(true);

          const sort = buildSortParams(this.sortRules);
          const search = buildSearchParams(this.filters);

          return this.disciplineService.getDisciplines(
            this.currentPage,
            this.pageSize,
            sort,
            search
          ).pipe(
            catchError((error) => {
              console.error('Ошибка загрузки:', error);
              return EMPTY;
            }),
            finalize(() => this.isLoading.set(false))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (pageInfo) => {
          this.disciplines = pageInfo.items;
          this.currentPage = pageInfo.page;
          this.pageSize = pageInfo.size;
          this.totalPages = pageInfo.totalPages;
          this.totalElements = pageInfo.totalElements;
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.refresh$.complete();
  }

  public loadDisciplines(): void {
    this.refresh$.next();
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

    if (!currentRule) {
      this.sortRules.push({ field, direction: 'asc' });
    } else if (currentRule.direction === 'asc') {
      currentRule.direction = 'desc';
    } else {
      this.sortRules = this.sortRules.filter(
        rule => rule.field !== field
      );
    }

    this.currentPage = 0;
    this.loadDisciplines();
  }
}
