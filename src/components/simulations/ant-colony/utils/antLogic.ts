// src/components/simulations/ant-colony/utils/antLogic.ts
import { Ant, Grid, Position, AntColonySettings, Food } from "../types";

// Update an individual ant
export function updateAnt(
  ant: Ant,
  grid: Grid,
  food: Food[],
  settings: AntColonySettings
): Ant {
  // Sense surroundings
  const sensorReadings = sense(ant, grid, settings);

  // Update direction based on pheromone trails and obstacles
  const newDirection = calculateNewDirection(ant, sensorReadings, settings);

  // Calculate new position
  const newPosition = moveAnt(ant, newDirection, grid, settings);

  // Check for food or nest
  const hasReachedTarget = checkTarget(ant, newPosition, grid);

  // Update path
  const newPath = [...ant.path];
  if (distance(newPosition, ant.position) > 0.1) {
    newPath.push(newPosition);
    // Keep only recent path
    if (newPath.length > 50) newPath.shift();
  }

  return {
    ...ant,
    position: newPosition,
    direction: newDirection,
    hasFood: hasReachedTarget ? !ant.hasFood : ant.hasFood,
    path: newPath,
  };
}

// Sense surrounding pheromones
function sense(ant: Ant, grid: Grid, settings: AntColonySettings) {
  const sensors = [];
  const angles = [-settings.sensorAngle, 0, settings.sensorAngle];

  for (const angle of angles) {
    const sensorDirection = ant.direction + angle;
    const sensorX =
      ant.position.x + Math.cos(sensorDirection) * settings.sensorDistance;
    const sensorY =
      ant.position.y + Math.sin(sensorDirection) * settings.sensorDistance;

    const gridX = Math.floor(sensorX);
    const gridY = Math.floor(sensorY);

    if (
      gridX >= 0 &&
      gridX < grid[0].length &&
      gridY >= 0 &&
      gridY < grid.length
    ) {
      const cell = grid[gridY][gridX];
      sensors.push({
        angle,
        pheromone: ant.hasFood ? cell.homePheromone : cell.foodPheromone,
        isObstacle: cell.isObstacle,
      });
    } else {
      sensors.push({ angle, pheromone: 0, isObstacle: true });
    }
  }

  return sensors;
}

// Calculate new direction based on sensor readings
function calculateNewDirection(
  ant: Ant,
  sensors: { angle: number; pheromone: number; isObstacle: boolean }[],
  settings: AntColonySettings
): number {
  // Avoid obstacles
  const obstacleAvoidance = sensors.some((s) => s.isObstacle) ? Math.PI : 0;

  // Follow pheromone trail
  const weightedDirection = sensors.reduce((sum, sensor) => {
    return sum + sensor.angle * sensor.pheromone;
  }, 0);

  // Random movement component
  const randomness = (Math.random() - 0.5) * Math.PI * 0.5;

  // Combine all components
  let newDirection =
    ant.direction + weightedDirection + randomness + obstacleAvoidance;

  // Normalize direction
  while (newDirection > Math.PI * 2) newDirection -= Math.PI * 2;
  while (newDirection < 0) newDirection += Math.PI * 2;

  return newDirection;
}

// Move ant based on direction
function moveAnt(
  ant: Ant,
  direction: number,
  grid: Grid,
  settings: AntColonySettings
): Position {
  const speed = settings.antSpeed;
  const newX = ant.position.x + Math.cos(direction) * speed;
  const newY = ant.position.y + Math.sin(direction) * speed;

  // Check bounds and obstacles
  const gridX = Math.floor(newX);
  const gridY = Math.floor(newY);

  if (
    gridX >= 0 &&
    gridX < grid[0].length &&
    gridY >= 0 &&
    gridY < grid.length &&
    !grid[gridY][gridX].isObstacle
  ) {
    return { x: newX, y: newY };
  }

  return ant.position;
}

// Check if ant has reached food or nest
function checkTarget(ant: Ant, position: Position, grid: Grid): boolean {
  const gridX = Math.floor(position.x);
  const gridY = Math.floor(position.y);
  const cell = grid[gridY][gridX];

  if (ant.hasFood && cell.isNest) return true;
  if (!ant.hasFood && cell.isFood) return true;

  return false;
}

// Update pheromone levels
export function updatePheromones(
  grid: Grid,
  settings: AntColonySettings
): Grid {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      homePheromone: cell.homePheromone * (1 - settings.pheromoneEvaporation),
      foodPheromone: cell.foodPheromone * (1 - settings.pheromoneEvaporation),
    }))
  );
}

// Add pheromone to cell
export function addPheromone(
  grid: Grid,
  position: Position,
  type: "home" | "food",
  amount: number
): Grid {
  const x = Math.floor(position.x);
  const y = Math.floor(position.y);

  if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
    const newGrid = [...grid];
    if (type === "home") {
      newGrid[y][x].homePheromone += amount;
    } else {
      newGrid[y][x].foodPheromone += amount;
    }
    return newGrid;
  }

  return grid;
}

// Helper function to calculate distance
function distance(a: Position, b: Position): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
