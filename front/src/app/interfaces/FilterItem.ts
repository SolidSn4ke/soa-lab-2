export interface FilterItem {
    field: string,
    operator: '>' | '<' | '~',
    value: string,
}