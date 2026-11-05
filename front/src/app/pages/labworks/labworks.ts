import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Labwork } from '../../interfaces/Labwork';
import { LabworkService } from '../../services/labwork.service';
import { Router } from '@angular/router';
import { SortItem } from '../../interfaces/SortItem';
import { FilterItem } from '../../interfaces/FilterItem';
import { LabworkForm } from '../../components/labwork-form/labwork-form';
import { FormsModule } from '@angular/forms';
import { Difficulty } from '../../interfaces/Difficulty';
import { Pagination } from '../../components/pagination/pagination';
import { FilterPanel } from '../../components/filter-panel/filter-panel';
import { getVisiblePages } from '../../utils/pagination.utils';
import { buildSearchParams, buildSortParams } from '../../utils/query-params.utils';
import { Subject, timer, switchMap, takeUntil, tap, finalize, merge, catchError, EMPTY } from 'rxjs';
import { FilterField } from '../../interfaces/FilterField';

@Component({
  imports: [CommonModule, LabworkForm, FormsModule, Pagination, FilterPanel],
  selector: 'app-labworks',
  styleUrl: './labworks.scss',
  templateUrl: './labworks.html',
})
export class Labworks implements OnInit, OnDestroy {
  public labworks: Labwork[] = [];

  public currentPage: number = 0;
  public totalPages: number = 0;
  public pageSize: number = 10;
  public totalElements: number = 0;

  public sortRules: SortItem[] = [];
  public filters: FilterItem[] = [];

  public isFormOpen: boolean = false;

  public difficulty: Difficulty | null = null;
  public showDifficultyError: boolean = false;

  public isLoading = signal(false);

  public readonly filterFields: FilterField[] = [
    { value: 'id', label: 'ID', type: 'number' },
    { value: 'name', label: 'Name', type: 'string' },
    {
      value: 'difficulty', label: 'Difficulty', type: 'select', options: [
        { value: 'EASY', label: 'Easy' },
        { value: 'NORMAL', label: 'Normal' },
        { value: 'VERY_HARD', label: 'Very Hard' },
        { value: 'IMPOSSIBLE', label: 'Impossible' },
        { value: 'HOPELESS', label: 'Hopeless' },
      ]
    },
    { value: 'minimalPoint', label: 'Minimal Point', type: 'number' },
    { value: 'averagePoint', label: 'Average Point', type: 'number' },
    { value: 'creationDate', label: 'Creation Date', type: 'date' },
    { value: 'discipline.name', label: 'Discipline', type: 'string' },
  ];

  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new Subject<void>();

  private readonly pollingInterval = 10_000;

  public constructor(private labworkService: LabworkService, private router: Router) { }

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

          return this.labworkService.getLabworks(
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
          this.labworks = pageInfo.items;
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

  public loadLabworks(): void {
    this.refresh$.next();
  }

  public goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadLabworks();
  }

  public onLabworkClick(labworkId: number): void {
    this.router.navigate(['/labworks', labworkId]);
  }

  public onCreateLabworkClick(): void {
    this.isFormOpen = true;
  }

  public get visiblePages(): number[] {
    return getVisiblePages(this.currentPage, this.totalPages);
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
    this.loadLabworks();
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
    this.loadLabworks();
  }

  public clearSort() {
    this.sortRules = [];
    this.loadLabworks();
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


  public closeForm(): void {
    this.isFormOpen = false;
  }

  public onLabworkSaved(): void {
    this.closeForm();
    this.loadLabworks();
  }

  public onRemoveByDifficultyClick(): void {
    console.log('Selected difficulty:', this.difficulty);

    if (!this.difficulty) {
      this.showDifficultyError = true;
      return;
    }

    this.showDifficultyError = false;

    this.labworkService.removeByDifficulty(this.difficulty)
      .subscribe({
        next: () => {
          console.log('Delete successful:');
          this.loadLabworks();
        },
        error: (error) => {
          console.error("Delete error:", error);
        }
      });
  }
}
