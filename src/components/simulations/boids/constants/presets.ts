// src/components/simulations/boids/constants/presets.ts
export const PRESETS = {
  default: {
    name: "Default Flock",
    description: "Balanced flocking behavior",
    settings: {
      alignmentForce: 1.0,
      cohesionForce: 1.0,
      separationForce: 1.2,
      visualRange: 50,
      separationRange: 25,
      numberOfBoids: 100,
      maxSpeed: 4,
      maxForce: 0.2,
    },
  },
  tight: {
    name: "Tight Formation",
    description: "Boids stay close together",
    settings: {
      alignmentForce: 1.5,
      cohesionForce: 1.5,
      separationForce: 0.8,
      visualRange: 60,
      separationRange: 20,
      numberOfBoids: 100,
      maxSpeed: 3,
      maxForce: 0.2,
    },
  },
  scattered: {
    name: "Scattered Groups",
    description: "Boids form multiple small groups",
    settings: {
      alignmentForce: 0.8,
      cohesionForce: 0.8,
      separationForce: 1.5,
      visualRange: 40,
      separationRange: 30,
      numberOfBoids: 100,
      maxSpeed: 5,
      maxForce: 0.3,
    },
  },
};
