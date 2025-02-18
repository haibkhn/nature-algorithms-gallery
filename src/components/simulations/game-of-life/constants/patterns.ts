import { Pattern } from "../types";

export const PATTERNS: Record<string, Pattern> = {
  glider: {
    name: "Glider",
    pattern: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  blinker: {
    name: "Blinker",
    pattern: [[1, 1, 1]],
  },
  block: {
    name: "Block",
    pattern: [
      [1, 1],
      [1, 1],
    ],
  },
  beehive: {
    name: "Beehive",
    pattern: [
      [0, 1, 1, 0],
      [1, 0, 0, 1],
      [0, 1, 1, 0],
    ],
  },
};
