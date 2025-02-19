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
  isPredator?: boolean;
}

export interface FlockingSettings {
  type: "boids";
  alignmentForce: number;
  cohesionForce: number;
  separationForce: number;
  visualRange: number;
  separationRange: number;
  numberOfBoids: number;
  maxSpeed: number;
  maxForce: number;
  mouseForce: number;
  mouseRadius: number;
  predatorForce: number;
  numberOfPredators: number;
  mouseInteraction: "none" | "attract" | "repel";
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
  onShowTutorial: () => void;
}

export interface StatsPanelProps {
  stats: FlockStats;
  historyData: {
    timestamp: number;
    alignment: number;
    groupCount: number;
  }[];
}

export interface TutorialStep {
  target: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "left" | "right";
}

export interface CanvasProps {
  boids: Boid[];
  settings: FlockingSettings;
  width: number;
  height: number;
  onMousePositionUpdate: (position: Vector | null) => void;
}
