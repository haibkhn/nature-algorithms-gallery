// src/components/simulations/ant-colony/types.ts
export interface Position {
  x: number;
  y: number;
}

export interface Ant {
  id: number;
  position: Position;
  path: Position[];
  hasFood: boolean;
  direction: number; // angle in radians
}

export interface Food {
  position: Position;
  amount: number;
}

export interface AntColonySettings {
  type: "ant-colony";
  numberOfAnts: number;
  pheromoneStrength: number;
  pheromoneEvaporation: number;
  antSpeed: number;
  sensorDistance: number;
  sensorAngle: number;
  foodAmount: number;
}

export interface GridCell {
  homePheromone: number;
  foodPheromone: number;
  isObstacle: boolean;
  isNest: boolean;
  isFood: boolean;
}

export type Grid = GridCell[][];

export interface Stats {
  foodCollected: number;
  activeAnts: number;
  averagePathLength: number;
  totalPheromoneIntensity: number;
}

// Props interfaces
export interface CanvasProps {
  grid: Grid;
  ants: Ant[];
  food: Food[];
  settings: AntColonySettings;
  width: number;
  height: number;
  onCellClick: (x: number, y: number) => void;
}

export interface ControlsProps {
  isRunning: boolean;
  onToggleRun: () => void;
  settings: AntColonySettings;
  onSettingsChange: (settings: AntColonySettings) => void;
  onReset: () => void;
  onClear: () => void;
  mode: "food" | "obstacle" | "none";
  onModeChange: (mode: "food" | "obstacle" | "none") => void;
  onShowTutorial: () => void;
}

export interface StatsPanelProps {
  stats: Stats;
  historyData: {
    timestamp: number;
    foodCollected: number;
    avgPathLength: number;
  }[];
}

export interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}
