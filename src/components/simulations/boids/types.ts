// src/components/simulations/boids/types.ts
export interface Vector {
  x: number;
  y: number;
}

export interface Boid {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  maxSpeed: number;
  maxForce: number;
}

export interface FlockingSettings {
  type: "boids"; // Add this to distinguish from other simulation settings
  alignmentForce: number;
  cohesionForce: number;
  separationForce: number;
  visualRange: number;
  separationRange: number;
  numberOfBoids: number;
  maxSpeed: number;
  maxForce: number;
}

export interface FlockStats {
  averageSpeed: number;
  averageAlignment: number;
  groupCount: number;
}

export interface CanvasProps {
  boids: Boid[];
  settings: FlockingSettings;
  width: number;
  height: number;
}

export interface ControlsProps {
  isRunning: boolean;
  onToggleRun: () => void;
  settings: FlockingSettings;
  onSettingsChange: (settings: FlockingSettings) => void;
  onReset: () => void;
  onScatter: () => void;
}

export interface StatsPanelProps {
  stats: FlockStats;
  historyData: {
    timestamp: number;
    alignment: number;
    groupCount: number;
  }[];
}
