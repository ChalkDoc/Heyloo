import { Question } from './question.model';

export const QUESTIONS: Question[] = [
  new Question("Basic Math",
    "Select the sum of the two numbers.",
    10,
    "1 + 1",
    ["2", "4", "6", "8"],
    0),
  new Question("Basic Math", "Select the sum of the two numbers.",30, "2 + 2", [
    "2", "4", "6", "8"
  ], 1),
  new Question("Basic Math", "Select the sum of the two numbers.",10, "3 + 3", [
    "2", "4", "6", "8"
  ], 2),
  new Question("Basic Math", "Select the sum of the two numbers.",20, "4 + 4", [
    "2", "4", "6", "8"
  ], 3)
]
