import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterItem } from '../../interfaces/FilterItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterField {
  value: string;
  label: string;
}

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-filter-panel',
  styleUrl: './filter-panel.scss',
  templateUrl: './filter-panel.html',
})
export class FilterPanel {
  @Input() public filters: FilterItem[] = [];
  @Input() public fields: FilterField[] = [];

  @Output() public filtersChange = new EventEmitter<FilterItem[]>();
  @Output() public apply = new EventEmitter<void>();

  public readonly operators = [
    { value: '>', label: 'Greater than' },
    { value: '<', label: 'Less than' },
    { value: '>=', label: 'Greater than or equal' },
    { value: '<=', label: 'Less than or equal' },
    { value: '=', label: 'Equals' },
    { value: '~', label: 'Contains' },
  ];

  public addFilter(): void {
    this.filtersChange.emit([
      ...this.filters,
      {
        field: this.fields[0]?.value ?? '',
        operator: '~',
        value: '',
      },
    ]);
  }

  public removeFilter(index: number): void {
    this.filtersChange.emit(
      this.filters.filter((_, i) => i !== index)
    );
  }

  public applyFilters(): void {
    this.apply.emit();
  }
}
