import { TOTAL_HOLES } from "./game-config";

export function createHoleIds(total: number = TOTAL_HOLES): number[] {
  return Array.from({ length: total }, (_, index) => index);
}

export function pickNextHole(holeIds: number[], previousHole: number | null): number {
  if (holeIds.length === 0) {
    return 0;
  }

  if (holeIds.length === 1) {
    return holeIds[0];
  }

  const allowedHoles =
    previousHole === null ? holeIds : holeIds.filter((hole) => hole !== previousHole);

  const randomIndex = Math.floor(Math.random() * allowedHoles.length);
  return allowedHoles[randomIndex];
}

export function isValidWhack(activeHole: number | null, clickedHole: number): boolean {
  return activeHole !== null && activeHole === clickedHole;
}

export function calculateNextHighScore(currentHighScore: number, score: number): number {
  return Math.max(currentHighScore, score);
}
