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

      // Calculate pheromone value based on ant state
      let pheromoneValue = 0;
      if (ant.hasFood) {
        // When carrying food, follow home pheromones
        pheromoneValue = cell.homePheromone;
      } else {
        // When searching for food, follow food pheromones
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

  // Much stronger pheromone influence
  const weightedDirection = sensors.reduce((sum, sensor) => {
    // Cubic weighting to make strong trails even more attractive
    const weight = Math.pow(sensor.pheromone / (maxPheromone || 1), 3);
    return sum + sensor.angle * weight * settings.pheromoneStrength * 3;
  }, 0);

  let homewardBias = 0;
  if (ant.hasFood) {
    const nestDirection = Math.atan2(
      grid.length / 2 - ant.position.y,
      grid[0].length / 2 - ant.position.x
    );
    const directionDiff = normalizeAngle(nestDirection - ant.direction);
    homewardBias = directionDiff * 0.7;
  }

  // Almost no randomness when on strong trails
  // Lower threshold (0.1) to make ants follow even weaker trails
  const randomScale = maxPheromone > 0.1 ? 0.01 : 0.5;
  const randomness = (Math.random() - 0.5) * Math.PI * 0.5 * randomScale;

  let newDirection = ant.direction;

  if (ant.hasFood) {
    // Strong home bias when carrying food
    newDirection +=
      homewardBias * 0.7 + weightedDirection * 0.25 + randomness * 0.05;
  } else if (maxPheromone > 0.1) {
    // Lower threshold for following trails
    // Even stronger trail following (0.95 weight to trail)
    newDirection += weightedDirection * 0.95 + randomness * 0.05;
  } else {
    // Normal exploration when no trails
    newDirection += weightedDirection * 0.3 + randomness * 0.7;
  }

  newDirection += obstacleAvoidance;
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

    const distanceFromNest = distance(position, {
      x: grid[0].length / 2,
      y: grid.length / 2,
    });
    const distanceScale = Math.min(1, distanceFromNest / 20);

    if (type === "home") {
      cell.homePheromone = Math.min(
        3,
        cell.homePheromone + amount * distanceScale
      );
    } else {
      // Much higher max level for food pheromones
      cell.foodPheromone = Math.min(
        6, // Increased from 4
        cell.foodPheromone + amount * 3 * distanceScale // Increased multiplier
      );
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
