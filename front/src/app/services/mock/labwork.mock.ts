import { Difficulty } from "../../interfaces/Difficulty";
import { Labwork } from "../../interfaces/Labwork";

export const mockLabworks: Labwork[] = [
    { id: 1, name: 'REST API', coordinates: { x: 0, y: 0 }, creationDate: new Date(), minimalPoint: 0, averagePoint: 0, difficulty: Difficulty.EASY, discipline: { name: "Mathematics", labsCount: 10 } },
    { id: 2, name: 'Angular', coordinates: { x: 0, y: 0 }, creationDate: new Date(), minimalPoint: 0, averagePoint: 0, difficulty: Difficulty.NORMAL, discipline: { name: "Physics", labsCount: 12 } },
    { id: 3, name: 'Spring MVC', coordinates: { x: 0, y: 0 }, creationDate: new Date(), minimalPoint: 0, averagePoint: 0, difficulty: Difficulty.VERY_HARD, discipline: { name: "Chemistry", labsCount: 8 } },
    { id: 4, name: 'OpenAPI', coordinates: { x: 0, y: 0 }, creationDate: new Date(), minimalPoint: 0, averagePoint: 0, difficulty: Difficulty.IMPOSSIBLE, discipline: { name: "Mathematics", labsCount: 10 } },
    { id: 5, name: 'Web Services', coordinates: { x: 0, y: 0 }, creationDate: new Date(), minimalPoint: 0, averagePoint: 0, difficulty: Difficulty.HOPELESS, discipline: { name: "Physics", labsCount: 12 } },
];