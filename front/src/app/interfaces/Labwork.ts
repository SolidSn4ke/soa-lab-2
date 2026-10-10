import { Coordinates } from "./Coordinates";
import { Difficulty } from "./Difficulty";
import { Discipline } from "./Discipline";

export interface Labwork {
    id: number;
    name: string;
    coordinates: Coordinates;
    creationDate: Date;
    minimalPoint: number;
    averagePoint: number;
    difficulty: Difficulty;
    discipline: Discipline;
}

export type CreateLabwork = Omit<Labwork, 'id'>;