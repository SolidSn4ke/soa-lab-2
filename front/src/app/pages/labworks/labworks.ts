import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Labwork } from '../../interfaces/Labwork';
import { LabworkService } from '../../services/labwork.service';

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

  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  public constructor(private labworkService: LabworkService) { }

  public ngOnInit(): void {
    this.loadLabworks();
  }

  public loadLabworks(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.labworkService.getLabworks(this.currentPage, this.pageSize).subscribe({
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
    console.log(`Labwork ${labworkId} clicked`);
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
}
