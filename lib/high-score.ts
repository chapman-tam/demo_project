const HIGH_SCORE_KEY = "whack-a-mole-high-score";

export function loadHighScore(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const rawValue = window.localStorage.getItem(HIGH_SCORE_KEY);
  if (rawValue === null) {
    return 0;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed < 0) {
    console.error("Invalid high score value in localStorage.");
    return 0;
  }

  return Math.floor(parsed);
}

export function saveHighScore(score: number): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!Number.isFinite(score) || score < 0) {
    console.error("Attempted to save invalid high score.");
    return;
  }

  window.localStorage.setItem(HIGH_SCORE_KEY, String(Math.floor(score)));
}
