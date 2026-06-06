import { TOTAL_HOLES } from "./game-config";

export function createHoleIds(total: number = TOTAL_HOLES): number[] {
  return Array.from({ length: total }, (_, index) => index);
}

export type MathProblem = {
  question: string;
  answer: number;
  options: number[];
};

export function generateMathProblem(): MathProblem {
  const operators = ["+", "-", "*"];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let a, b, answer;
  
  if (operator === "+") {
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    answer = a + b;
  } else if (operator === "-") {
    a = Math.floor(Math.random() * 20) + 10;
    b = Math.floor(Math.random() * a) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a * b;
  }

  const options = [answer];
  while (options.length < 3) {
    const distractor = answer + (Math.floor(Math.random() * 10) - 5);
    if (distractor !== answer && distractor > 0 && !options.includes(distractor)) {
      options.push(distractor);
    }
  }

  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    question: `${a} ${operator === "*" ? "×" : operator} ${b}`,
    answer,
    options,
  };
}

export function pickMultipleHoles(holeIds: number[], count: number): number[] {
  const shuffled = [...holeIds].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function calculateNextHighScore(currentHighScore: number, score: number): number {
  return Math.max(currentHighScore, score);
}
