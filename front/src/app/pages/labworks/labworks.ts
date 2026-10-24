import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Labwork } from '../../interfaces/Labwork';
import { LabworkService } from '../../services/labwork.service';
import { Router } from '@angular/router';
import { SortItem } from '../../interfaces/SortItem';
import { FilterItem } from '../../interfaces/FilterItem';
import { LabworkForm } from '../../components/labwork-form/labwork-form';
import { FormsModule } from '@angular/forms';
import { Difficulty } from '../../interfaces/Difficulty';
import { Pagination } from '../../components/pagination/pagination';
import { FilterField, FilterPanel } from '../../components/filter-panel/filter-panel';
import { getVisiblePages } from '../../utils/pagination.utils';
import { buildSearchParams, buildSortParams } from '../../utils/query-params.utils';
import { finalize } from 'rxjs';

@Component({
  imports: [CommonModule, LabworkForm, FormsModule, Pagination, FilterPanel],
  selector: 'app-labworks',
  styleUrl: './labworks.scss',
  templateUrl: './labworks.html',
})
export class Labworks implements OnInit {
  public labworks: Labwork[] = [];

  public currentPage: number = 0;
  public totalPages: number = 0;
  public pageSize: number = 10;
  public totalElements: number = 0;

  public sortRules: SortItem[] = [];
  public filters: FilterItem[] = [];

  public isFormOpen: boolean = false;

  public difficulty: Difficulty | null = null;

  public isLoading = signal(false);
  public errorMessage: string | null = null;

  public readonly filterFields: FilterField[] = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'Name' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'minimalPoint', label: 'Minimal Point' },
    { value: 'averagePoint', label: 'Average Point' },
    { value: 'discipline.name', label: 'Discipline' },
  ];

  public constructor(private labworkService: LabworkService, private router: Router) { }

  public ngOnInit(): void {
    this.loadLabworks();
  }

  public loadLabworks(): void {
    this.isLoading.set(true);
    this.errorMessage = null;

    const sort = buildSortParams(this.sortRules);
    const search = buildSearchParams(this.filters);

    this.labworkService.getLabworks(this.currentPage, this.pageSize, sort, search)
      .pipe(finalize(() => {
        this.isLoading.set(false);
      }))
      .subscribe({
        next: (pageInfo) => {
          console.log("Получены данные:", pageInfo);

          this.labworks = pageInfo.items;
          this.currentPage = pageInfo.page;
          this.pageSize = pageInfo.size;
          this.totalPages = pageInfo.totalPages;
          this.totalElements = pageInfo.totalElements;
        },
        error: (error) => {
          console.log("Ошибка загрузки:", error);
          this.errorMessage = error;
        }
      });
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

  public onRemoveByDifficultyClick() {
    if (this.difficulty) {
      this.labworkService.removeByDifficulty(this.difficulty);
    }
  }
}
