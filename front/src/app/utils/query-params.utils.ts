import { FilterItem } from '../interfaces/FilterItem';
import { SortItem } from '../interfaces/SortItem';

export function buildSortParams(sortRules: SortItem[]): string[] {
    return sortRules.map(
        rule => `${rule.field},${rule.direction}`
    );
}

export function buildSearchParams(filters: FilterItem[]): string[] {
    return filters
        .filter(filter => filter.value.trim() !== '')
        .map(
            filter => `${filter.field}${filter.operator}${filter.value.trim()}`
        );
}