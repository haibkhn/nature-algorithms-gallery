import { Scenario } from "../types";
import { PATTERNS } from "./patterns";

export const SCENARIOS: Record<string, Scenario> = {
  gliderGun: {
    name: "Gosper Glider Gun",
    description: "Creates an infinite stream of gliders",
    gridSize: { rows: 40, cols: 60 },
    patterns: [
      {
        pattern: PATTERNS.glider.pattern,
        position: { x: 5, y: 5 },
      },
      {
        pattern: PATTERNS.block.pattern,
        position: { x: 0, y: 0 },
      },
    ],
  },
  spaceships: {
    name: "Spaceship Fleet",
    description: "Multiple spaceships moving in formation",
    gridSize: { rows: 40, cols: 60 },
    patterns: [
      {
        pattern: PATTERNS.glider.pattern,
        position: { x: 5, y: 5 },
      },
      {
        pattern: PATTERNS.glider.pattern,
        position: { x: 10, y: 5 },
      },
      {
        pattern: PATTERNS.glider.pattern,
        position: { x: 15, y: 5 },
      },
    ],
  },
  oscillators: {
    name: "Clock",
    description: "Multiple synchronized oscillators",
    gridSize: { rows: 40, cols: 40 },
    patterns: [
      {
        pattern: PATTERNS.blinker.pattern,
        position: { x: 10, y: 10 },
      },
      {
        pattern: PATTERNS.blinker.pattern,
        position: { x: 20, y: 10 },
      },
    ],
  },
};
