// constants/scenarios.ts
import { Scenario } from "../types";
import { PATTERNS } from "./patterns";

export const SCENARIOS: Record<string, Scenario> = {
  gliderGun: {
    name: "Gosper Glider Gun",
    description: "Creates an infinite stream of gliders",
    patterns: [
      {
        pattern: [
          [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
          [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
          [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
          ],
          [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
          ],
          [
            1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
          [
            1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
          [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
          [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
          [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        ],
        position: { x: 20, y: 20 },
      },
    ],
  },
  pulsarGarden: {
    name: "Pulsar Garden",
    description: "Multiple pulsars interacting",
    patterns: [
      { pattern: PATTERNS.pulsar.pattern, position: { x: 10, y: 10 } },
      { pattern: PATTERNS.pulsar.pattern, position: { x: 30, y: 10 } },
      { pattern: PATTERNS.pulsar.pattern, position: { x: 20, y: 30 } },
    ],
  },
  spaceshipFleet: {
    name: "Spaceship Fleet",
    description: "Different types of spaceships in formation",
    patterns: [
      { pattern: PATTERNS.lwss.pattern, position: { x: 10, y: 10 } },
      { pattern: PATTERNS.lwss.pattern, position: { x: 20, y: 15 } },
      { pattern: PATTERNS.glider.pattern, position: { x: 30, y: 20 } },
      { pattern: PATTERNS.glider.pattern, position: { x: 40, y: 25 } },
    ],
  },
  oscillatorMix: {
    name: "Oscillator Mix",
    description: "Various oscillating patterns",
    patterns: [
      { pattern: PATTERNS.blinker.pattern, position: { x: 10, y: 10 } },
      { pattern: PATTERNS.pentadecathlon.pattern, position: { x: 20, y: 20 } },
      { pattern: PATTERNS.pulsar.pattern, position: { x: 40, y: 10 } },
    ],
  },
  collisionCourse: {
    name: "Collision Course",
    description: "Multiple patterns set to collide",
    patterns: [
      { pattern: PATTERNS.glider.pattern, position: { x: 10, y: 10 } },
      { pattern: PATTERNS.lwss.pattern, position: { x: 30, y: 30 } },
      { pattern: PATTERNS.loafer.pattern, position: { x: 20, y: 20 } },
      { pattern: PATTERNS.block.pattern, position: { x: 25, y: 25 } },
    ],
  },
  stableStructures: {
    name: "Stable Structures",
    description: "Collection of stable patterns",
    patterns: [
      { pattern: PATTERNS.block.pattern, position: { x: 10, y: 10 } },
      { pattern: PATTERNS.beehive.pattern, position: { x: 20, y: 10 } },
      { pattern: PATTERNS.loafer.pattern, position: { x: 30, y: 10 } },
      { pattern: PATTERNS.block.pattern, position: { x: 40, y: 10 } },
    ],
  },
};
