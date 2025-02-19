import { Boid, Vector, FlockingSettings } from "../types";

// Calculate distance between two points
export function distance(a: Vector, b: Vector): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Normalize a vector to a given magnitude
export function normalize(vector: Vector, magnitude: number): Vector {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (length === 0) return vector;
  return {
    x: (vector.x / length) * magnitude,
    y: (vector.y / length) * magnitude,
  };
}

// Limit vector magnitude
export function limit(vector: Vector, max: number): Vector {
  const lengthSq = vector.x * vector.x + vector.y * vector.y;
  if (lengthSq > max * max) {
    const ratio = max / Math.sqrt(lengthSq);
    return {
      x: vector.x * ratio,
      y: vector.y * ratio,
    };
  }
  return vector;
}

// Calculate force from mouse position
export function calculateMouseForce(
  boid: Boid,
  mousePos: Vector | null,
  settings: FlockingSettings
): Vector {
  if (!mousePos || settings.mouseInteraction === "none") {
    return { x: 0, y: 0 };
  }

  const d = distance(boid.position, mousePos);
  if (d > settings.mouseRadius) {
    return { x: 0, y: 0 };
  }

  // Calculate direction from boid to mouse
  const direction = {
    x: mousePos.x - boid.position.x,
    y: mousePos.y - boid.position.y,
  };

  // Normalize and scale by force
  const force = settings.mouseForce * (1 - d / settings.mouseRadius);
  const normalized = normalize(direction, force);

  // Invert force if repelling
  return settings.mouseInteraction === "attract"
    ? normalized
    : { x: -normalized.x, y: -normalized.y };
}

// Calculate force from nearby predators
export function calculatePredatorAvoidance(
  boid: Boid,
  boids: Boid[],
  settings: FlockingSettings
): Vector {
  if (boid.isPredator) return { x: 0, y: 0 };

  let avoidance = { x: 0, y: 0 };
  let count = 0;

  boids.forEach((other) => {
    if (!other.isPredator) return;

    const d = distance(boid.position, other.position);
    if (d < settings.visualRange * 1.5) {
      // Larger range for predator detection
      // Vector pointing away from predator
      const diff = {
        x: boid.position.x - other.position.x,
        y: boid.position.y - other.position.y,
      };

      // Weighted by distance (closer predators cause stronger avoidance)
      const weight =
        (settings.visualRange * 1.5 - d) / (settings.visualRange * 1.5);
      avoidance.x += diff.x * weight;
      avoidance.y += diff.y * weight;
      count++;
    }
  });

  if (count > 0) {
    avoidance.x /= count;
    avoidance.y /= count;
    avoidance = normalize(avoidance, settings.maxSpeed * 2); // Stronger than normal forces
    avoidance = limit(avoidance, settings.maxForce * 2);
  }

  return {
    x: avoidance.x * settings.predatorForce,
    y: avoidance.y * settings.predatorForce,
  };
}

// Predator chase behavior
export function calculatePredatorChase(
  predator: Boid,
  boids: Boid[],
  settings: FlockingSettings
): Vector {
  if (!predator.isPredator) return { x: 0, y: 0 };

  let chase = { x: 0, y: 0 };
  let closestDist = Infinity;
  let hasTarget = false;

  boids.forEach((other) => {
    if (other.isPredator) return;

    const d = distance(predator.position, other.position);
    if (d < settings.visualRange * 1.5 && d < closestDist) {
      closestDist = d;
      chase = {
        x: other.position.x - predator.position.x,
        y: other.position.y - predator.position.y,
      };
      hasTarget = true;
    }
  });

  if (hasTarget) {
    chase = normalize(chase, settings.maxSpeed * 1.2); // Predators are slightly faster
    chase = limit(chase, settings.maxForce * 1.2);
  }

  return chase;
}

// Main flocking forces
export function calculateFlockingForces(
  boid: Boid,
  boids: Boid[],
  mousePos: Vector | null,
  settings: FlockingSettings
): Vector {
  if (boid.isPredator) {
    const chase = calculatePredatorChase(boid, boids, settings);
    return chase;
  }

  const alignment = calculateAlignment(boid, boids, settings);
  const cohesion = calculateCohesion(boid, boids, settings);
  const separation = calculateSeparation(boid, boids, settings);
  const mouseForce = calculateMouseForce(boid, mousePos, settings);
  const predatorAvoidance = calculatePredatorAvoidance(boid, boids, settings);

  return {
    x:
      alignment.x +
      cohesion.x +
      separation.x +
      mouseForce.x +
      predatorAvoidance.x,
    y:
      alignment.y +
      cohesion.y +
      separation.y +
      mouseForce.y +
      predatorAvoidance.y,
  };
}

// Rule 1: Alignment
// Steer towards the average heading of local flockmates
export function calculateAlignment(
  boid: Boid,
  boids: Boid[],
  settings: FlockingSettings
): Vector {
  let steering = { x: 0, y: 0 };
  let total = 0;

  boids.forEach((other) => {
    if (other === boid) return;

    const d = distance(boid.position, other.position);
    if (d < settings.visualRange) {
      steering.x += other.velocity.x;
      steering.y += other.velocity.y;
      total++;
    }
  });

  if (total > 0) {
    steering.x /= total;
    steering.y /= total;

    // Normalize to maxSpeed
    steering = normalize(steering, settings.maxSpeed);

    // Subtract current velocity to get steering force
    steering.x -= boid.velocity.x;
    steering.y -= boid.velocity.y;

    // Limit steering force
    steering = limit(steering, settings.maxForce);
  }

  return {
    x: steering.x * settings.alignmentForce,
    y: steering.y * settings.alignmentForce,
  };
}

// Rule 2: Cohesion
// Steer towards the average position of local flockmates
export function calculateCohesion(
  boid: Boid,
  boids: Boid[],
  settings: FlockingSettings
): Vector {
  let centerOfMass = { x: 0, y: 0 };
  let total = 0;

  boids.forEach((other) => {
    if (other === boid) return;

    const d = distance(boid.position, other.position);
    if (d < settings.visualRange) {
      centerOfMass.x += other.position.x;
      centerOfMass.y += other.position.y;
      total++;
    }
  });

  if (total > 0) {
    centerOfMass.x /= total;
    centerOfMass.y /= total;

    // Create desired velocity towards center of mass
    const desired = {
      x: centerOfMass.x - boid.position.x,
      y: centerOfMass.y - boid.position.y,
    };

    // Normalize and scale by maxSpeed
    const normalized = normalize(desired, settings.maxSpeed);

    // Calculate steering force
    let steering = {
      x: normalized.x - boid.velocity.x,
      y: normalized.y - boid.velocity.y,
    };

    // Limit steering force
    steering = limit(steering, settings.maxForce);

    return {
      x: steering.x * settings.cohesionForce,
      y: steering.y * settings.cohesionForce,
    };
  }

  return { x: 0, y: 0 };
}

// Rule 3: Separation
// Steer to avoid crowding local flockmates
export function calculateSeparation(
  boid: Boid,
  boids: Boid[],
  settings: FlockingSettings
): Vector {
  let steering = { x: 0, y: 0 };
  let total = 0;

  boids.forEach((other) => {
    if (other === boid) return;

    const d = distance(boid.position, other.position);
    if (d < settings.separationRange) {
      // Calculate vector pointing away from neighbor
      let diff = {
        x: boid.position.x - other.position.x,
        y: boid.position.y - other.position.y,
      };

      // Weight by distance (closer = stronger)
      diff = normalize(diff, 1 / Math.max(d, 0.1));

      steering.x += diff.x;
      steering.y += diff.y;
      total++;
    }
  });

  if (total > 0) {
    steering.x /= total;
    steering.y /= total;

    // Normalize to maxSpeed
    steering = normalize(steering, settings.maxSpeed);

    // Subtract current velocity
    steering.x -= boid.velocity.x;
    steering.y -= boid.velocity.y;

    // Limit force
    steering = limit(steering, settings.maxForce);
  }

  return {
    x: steering.x * settings.separationForce,
    y: steering.y * settings.separationForce,
  };
}

// Additional helper for calculating overall flock statistics
export function calculateFlockStats(boids: Boid[]): {
  averageSpeed: number;
  averageAlignment: number;
  groupCount: number;
} {
  let totalSpeed = 0;
  let averageHeading = { x: 0, y: 0 };

  // Calculate average speed and heading
  boids.forEach((boid) => {
    const speed = Math.sqrt(
      boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y
    );
    totalSpeed += speed;

    // Normalize velocity to get heading
    const heading = normalize({ x: boid.velocity.x, y: boid.velocity.y }, 1);
    averageHeading.x += heading.x;
    averageHeading.y += heading.y;
  });

  // Calculate group count using spatial partitioning
  const groups = findGroups(boids);

  return {
    averageSpeed: totalSpeed / boids.length,
    averageAlignment: Math.sqrt(
      (averageHeading.x * averageHeading.x +
        averageHeading.y * averageHeading.y) /
        (boids.length * boids.length)
    ),
    groupCount: groups.length,
  };
}

// Helper function to find distinct groups of boids
function findGroups(boids: Boid[], groupDistance: number = 50): Boid[][] {
  const groups: Boid[][] = [];
  const visited = new Set<Boid>();

  boids.forEach((boid) => {
    if (!visited.has(boid)) {
      const group = findConnectedBoids(boid, boids, visited, groupDistance);
      if (group.length > 0) {
        groups.push(group);
      }
    }
  });

  return groups;
}

function findConnectedBoids(
  boid: Boid,
  boids: Boid[],
  visited: Set<Boid>,
  groupDistance: number
): Boid[] {
  const group: Boid[] = [boid];
  visited.add(boid);

  boids.forEach((other) => {
    if (
      !visited.has(other) &&
      distance(boid.position, other.position) < groupDistance
    ) {
      group.push(...findConnectedBoids(other, boids, visited, groupDistance));
    }
  });

  return group;
}
