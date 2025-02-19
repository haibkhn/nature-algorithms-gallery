// src/components/simulations/ant-colony/utils/statsHelper.ts
import { Ant, Grid, Stats } from "../types";

export function calculateStats(ants: Ant[], grid: Grid): Stats {
  // Calculate food collected (number of ants returning with food)
  const foodCollectors = ants.filter((ant) => ant.hasFood);
  const foodCollected = foodCollectors.length;

  // Calculate active ants (those not at nest)
  const activeAnts = ants.filter((ant) => {
    const nestDistance = Math.sqrt(
      Math.pow(ant.position.x - grid.length / 2, 2) +
        Math.pow(ant.position.y - grid.length / 2, 2)
    );
    return nestDistance > 2;
  }).length;

  // Calculate average path length
  const pathLengths = ants
    .filter((ant) => ant.path.length > 1)
    .map((ant) => {
      let length = 0;
      for (let i = 1; i < ant.path.length; i++) {
        length += Math.sqrt(
          Math.pow(ant.path[i].x - ant.path[i - 1].x, 2) +
            Math.pow(ant.path[i].y - ant.path[i - 1].y, 2)
        );
      }
      return length;
    });

  const averagePathLength =
    pathLengths.length > 0
      ? pathLengths.reduce((a, b) => a + b) / pathLengths.length
      : 0;

  // Calculate total pheromone intensity
  let totalPheromone = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      totalPheromone += cell.homePheromone + cell.foodPheromone;
    });
  });

  return {
    foodCollected,
    activeAnts,
    averagePathLength,
    totalPheromoneIntensity: totalPheromone,
  };
}

// Helper function to evaluate path efficiency
export function evaluatePathEfficiency(stats: Stats): {
  efficiency: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let efficiency = 0;

  // Evaluate based on various factors
  if (stats.foodCollected > 0) {
    efficiency += 0.3;
  }

  if (stats.averagePathLength < 30) {
    efficiency += 0.4;
  } else if (stats.averagePathLength < 50) {
    efficiency += 0.2;
    suggestions.push(
      "Paths are somewhat long. Consider increasing pheromone strength."
    );
  } else {
    suggestions.push(
      "Paths are very long. Try adjusting ant parameters to optimize routes."
    );
  }

  if (stats.totalPheromoneIntensity > 50) {
    efficiency += 0.3;
  } else {
    suggestions.push(
      "Weak pheromone trails. Consider reducing evaporation rate."
    );
  }

  if (stats.activeAnts < stats.foodCollected * 2) {
    suggestions.push(
      "Many ants are idle. Try increasing the number of active foragers."
    );
  }

  return {
    efficiency,
    suggestions: suggestions.slice(0, 2), // Return top 2 most important suggestions
  };
}

// Calculate optimal parameters based on current performance
export function suggestParameters(stats: Stats): {
  pheromoneStrength?: number;
  evaporationRate?: number;
  antSpeed?: number;
} {
  const suggestions: any = {};

  // Suggest pheromone strength adjustments
  if (stats.averagePathLength > 40 && stats.totalPheromoneIntensity < 30) {
    suggestions.pheromoneStrength = 1.5; // Increase for better path finding
  } else if (
    stats.averagePathLength < 20 &&
    stats.totalPheromoneIntensity > 100
  ) {
    suggestions.pheromoneStrength = 0.8; // Decrease if paths are too rigid
  }

  // Suggest evaporation rate adjustments
  if (stats.totalPheromoneIntensity > 150) {
    suggestions.evaporationRate = 0.05; // Increase to clear old paths
  } else if (stats.totalPheromoneIntensity < 20) {
    suggestions.evaporationRate = 0.01; // Decrease to maintain paths longer
  }

  // Suggest speed adjustments
  if (stats.activeAnts < stats.foodCollected) {
    suggestions.antSpeed = 1.5; // Increase to cover more ground
  }

  return suggestions;
}
