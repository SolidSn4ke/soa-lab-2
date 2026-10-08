export interface PageInfo<T> {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    items: T[];
}