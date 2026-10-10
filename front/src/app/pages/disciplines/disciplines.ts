import { Component, OnInit } from '@angular/core';
import { FilterItem } from '../../interfaces/FilterItem';
import { FormsModule } from '@angular/forms';
import { DisciplineService } from '../../services/discipline.service';
import { Discipline } from '../../interfaces/Discipline';
import { SortItem } from '../../interfaces/SortItem';
import { DisciplineForm } from '../../components/discipline-form/discipline-form';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule, DisciplineForm],
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

  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  public constructor(private disciplineService: DisciplineService, private router: Router) { }

  public ngOnInit() {
    this.loadDisciplines();
  }

  public loadDisciplines(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const sort = this.sortRules.map(
      rule => `${rule.field},${rule.direction}`
    )

    const search = this.filters.map(
      filter => `${filter.field}${filter.operator}${filter.value.trim()}`
    );

    this.disciplineService.getDisciplines(this.currentPage, this.pageSize, sort, search)
      .subscribe({
        next: (pageInfo) => {
          this.disciplines = pageInfo.items;
          this.currentPage = pageInfo.page;
          this.pageSize = pageInfo.size;
          this.totalPages = pageInfo.totalPages;
          this.totalElements = pageInfo.totalElements;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.isLoading = false;
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

  public removeFilter(index: number): void {
    this.filters.splice(index, 1);
  }

  public applyFilters(): void {
    const activeFilters = this.filters.filter(
      filter => filter.value.trim() !== ''
    );
    console.log(activeFilters)
    this.loadDisciplines();
  }

  public onCreateDisciplineClick(): void {
    this.isFormOpen = true;
  }

  public get visiblePages(): number[] {
    const windowSize = 5;

    if (this.totalPages <= windowSize) {
      return Array.from(
        { length: this.totalPages },
        (_, index) => index
      );
    }

    let start = this.currentPage - 2;
    let end = this.currentPage + 2;

    if (start < 0) {
      start = 0;
      end = windowSize - 1;
    }

    if (end >= this.totalPages) {
      end = this.totalPages - 1;
      start = this.totalPages - windowSize;
    }

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  }
  public isFormOpen: boolean = false;

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

  public goToFirstPage(): void {
    this.goToPage(0);
  }

  public goToLastPage(): void {
    this.goToPage(this.totalPages - 1);
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
