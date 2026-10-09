import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Labwork } from '../../interfaces/Labwork';
import { LabworkService } from '../../services/labwork.service';
import { Router } from '@angular/router';
import { SortItem } from '../../interfaces/SortItem';
import { FilterItem } from '../../interfaces/FilterItem';

@Component({
  imports: [CommonModule],
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

  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  public constructor(private labworkService: LabworkService, private router: Router) { }

  public ngOnInit(): void {
    this.loadLabworks();
  }

  public loadLabworks(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const sort = this.sortRules.map(
      rule => `${rule.field},${rule.direction}`
    )

    const search = this.filters.map(
      filter => `${filter.field}${filter.operator}${filter.value.trim()}`
    );

    this.labworkService.getLabworks(this.currentPage, this.pageSize, sort, search)
      .subscribe({
        next: (pageInfo) => {
          this.labworks = pageInfo.items;
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

  public goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadLabworks();
  }

  public goToFirstPage(): void {
    this.goToPage(0);
  }

  public goToLastPage(): void {
    this.goToPage(this.totalPages - 1);
  }

  public onLabworkClick(labworkId: number): void {
    this.router.navigate(['/labworks', labworkId]);
  }

  public onCreateLabworkClick(): void {
    console.log('Create Labwork button clicked');
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

  public addSearch(): void {

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
}
