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
  const newDirection = calculateNewDirection(
    ant,
    sensorReadings,
    settings,
    grid
  );

  // Calculate new position
  const newPosition = moveAnt(ant, newDirection, grid, settings);

  // Check for food or nest
  const hasReachedTarget = checkTarget(ant, newPosition, grid);

  // Update path more efficiently
  const newPath = [...ant.path];
  if (distance(newPosition, ant.position) > 1.0) {
    // Increased threshold
    newPath.push(newPosition);
    // Keep shorter path history
    if (newPath.length > 20) newPath.shift(); // Reduced from 50
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

      // Ignore home pheromones when too close to nest
      const distanceToNest = distance(ant.position, {
        x: grid[0].length / 2,
        y: grid.length / 2,
      });
      const nearNest = distanceToNest < settings.sensorDistance * 0.5;

      // Calculate pheromone value based on ant state
      let pheromoneValue = 0;
      if (ant.hasFood) {
        pheromoneValue = nearNest ? 0 : cell.homePheromone;
      } else {
        pheromoneValue = cell.foodPheromone;
      }

      // Scale by distance
      const distanceToSensor = distance(ant.position, {
        x: sensorX,
        y: sensorY,
      });
      const intensityScale = Math.pow(
        1 - distanceToSensor / settings.sensorDistance,
        2
      );

      sensors.push({
        angle,
        pheromone: pheromoneValue * intensityScale,
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
  settings: AntColonySettings,
  grid: Grid
): number {
  // Avoid obstacles
  const obstacleAvoidance = sensors.some((s) => s.isObstacle) ? Math.PI : 0;

  // Find the strongest pheromone reading
  const maxPheromone = Math.max(...sensors.map((s) => s.pheromone));

  // Follow pheromone trail with weighted steering
  const weightedDirection = sensors.reduce((sum, sensor) => {
    // Stronger influence from higher pheromone concentrations
    const weight = sensor.pheromone / (maxPheromone || 1);
    return sum + sensor.angle * weight * settings.pheromoneStrength;
  }, 0);

  // When ant has food, bias movement towards nest
  let homewardBias = 0;
  if (ant.hasFood) {
    const nestDirection = Math.atan2(
      grid.length / 2 - ant.position.y,
      grid[0].length / 2 - ant.position.x
    );
    const directionDiff = normalizeAngle(nestDirection - ant.direction);
    homewardBias = directionDiff * 0.5; // Bias towards nest
  }

  // Reduce random movement when following strong trails or carrying food
  const randomScale = maxPheromone > 0.5 || ant.hasFood ? 0.1 : 1;
  const randomness = (Math.random() - 0.5) * Math.PI * 0.5 * randomScale;

  // Combine all components with adjusted weights
  let newDirection = ant.direction;

  if (ant.hasFood) {
    // Prioritize going home when has food
    newDirection +=
      homewardBias * 0.5 + weightedDirection * 0.3 + randomness * 0.2;
  } else if (maxPheromone > 0.2) {
    // Follow strong pheromone trails
    newDirection += weightedDirection * 0.6 + randomness * 0.4;
  } else {
    // Explore when no strong trails
    newDirection += weightedDirection * 0.3 + randomness * 0.7;
  }

  // Add obstacle avoidance
  newDirection += obstacleAvoidance;

  // Normalize direction
  return normalizeAngle(newDirection);
}

// Helper function to normalize angle
function normalizeAngle(angle: number): number {
  while (angle > Math.PI * 2) angle -= Math.PI * 2;
  while (angle < 0) angle += Math.PI * 2;
  return angle;
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
      homePheromone: Math.max(
        0,
        cell.homePheromone * (1 - settings.pheromoneEvaporation)
      ),
      foodPheromone: Math.max(
        0,
        cell.foodPheromone * (1 - settings.pheromoneEvaporation)
      ),
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
    const cell = newGrid[y][x];

    // Increase pheromone amount based on distance from nest
    const distanceFromNest = distance(position, {
      x: grid[0].length / 2,
      y: grid.length / 2,
    });
    const distanceScale = Math.min(1, distanceFromNest / 20); // Scale up with distance
    const pheromoneAmount =
      type === "food" ? amount * distanceScale : amount * 1.5 * distanceScale;

    if (type === "home") {
      cell.homePheromone = Math.min(2, cell.homePheromone + pheromoneAmount);
    } else {
      cell.foodPheromone = Math.min(2, cell.foodPheromone + pheromoneAmount);
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
