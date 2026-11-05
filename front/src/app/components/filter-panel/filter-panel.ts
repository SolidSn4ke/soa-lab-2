import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterItem } from '../../interfaces/FilterItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterField } from '../../interfaces/FilterField';

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

  public readonly operators: Record<
    FilterField['type'],
    { value: FilterItem['operator']; label: string }[]
  > = {
      string: [
        { value: '~', label: 'Contains' },
        { value: '=', label: 'Equals' },
      ],
      number: [
        { value: '>', label: 'Greater than' },
        { value: '<', label: 'Less than' },
        { value: '>=', label: 'Greater than or equal' },
        { value: '<=', label: 'Less than or equal' },
        { value: '=', label: 'Equals' },
      ],
      date: [
        { value: '>', label: 'After' },
        { value: '<', label: 'Before' },
        { value: '>=', label: 'On or after' },
        { value: '<=', label: 'On or before' },
        { value: '=', label: 'Equals' },
      ],
      select: [
        { value: '=', label: 'Equals' },
      ],
    };

  public getField(field: string): FilterField | undefined {
    return this.fields.find(f => f.value === field);
  }

  public getOperators(field: string) {
    const type = this.getField(field)?.type ?? 'string';
    return this.operators[type];
  }

  public onFieldChange(filter: FilterItem): void {
    const operators = this.getOperators(filter.field);

    filter.operator = operators[0]?.value ?? '=';
    filter.value = '';

    this.filtersChange.emit([...this.filters]);
  }

  public addFilter(): void {
    const field = this.fields[0]?.value ?? '';
    const operator = this.getOperators(field)[0]?.value ?? '=';

    this.filtersChange.emit([
      ...this.filters,
      {
        field,
        operator,
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
