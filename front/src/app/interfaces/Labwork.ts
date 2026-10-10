export interface Labwork {
    id: number;
    name: string;
}

export type CreateLabwork = Omit<Labwork, 'id'>;