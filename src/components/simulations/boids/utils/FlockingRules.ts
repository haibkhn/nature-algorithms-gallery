// src/components/simulations/boids/utils/FlockingRules.ts
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
