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
        .map(filter => {
            let value = filter.value.trim();

            if (filter.field === 'creationDate') {
                value = `${value}T00:00:00+03:00[Europe/Moscow]`;
            }

            return `${filter.field}${filter.operator}${value}`;
        });
}