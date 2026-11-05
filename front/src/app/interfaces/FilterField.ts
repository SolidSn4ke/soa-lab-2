export interface FilterField {
    value: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'select';
    options?: { value: string; label: string }[]; // Only for 'select' type
}