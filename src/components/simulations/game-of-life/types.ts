export type Cell = boolean;
export type Grid = Cell[][];

export interface GridSize {
  rows: number;
  cols: number;
}

export interface Pattern {
  name: string;
  pattern: number[][];
}

export interface Position {
  x: number;
  y: number;
}

export interface PatternPlacement {
  pattern: number[][];
  position: Position;
}

export interface Scenario {
  name: string;
  description: string;
  // gridSize: GridSize;
  patterns: PatternPlacement[];
}

export interface PopulationData {
  generation: number;
  population: number;
}

// Props interfaces
export interface GridProps {
  grid: Grid;
  toggleCell: (i: number, j: number) => void;
  cellSize?: number;
}

export interface ControlsProps {
  isRunning: boolean;
  onToggleRun: () => void;
  onClear: () => void;
  onRandom: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onSelectScenario: (key: string) => void;
  onShowHelp: () => void;
}

export interface StatsPanelProps {
  generation: number;
  liveCells: number;
  populationHistory: PopulationData[];
}

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}
