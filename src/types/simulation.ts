export interface Pattern {
  title: string;
  description: string;
  component: React.ComponentType | null;
  tags: string[];
}

export interface SimulationMap {
  [key: string]: {
    title: string;
    description: string;
    component: React.FC;
    tags: string[];
  };
}

export interface GridSize {
  rows: number;
  cols: number;
}

export interface PatternPosition {
  pattern: number[][];
  position: {
    x: number;
    y: number;
  };
}

export interface Scenario {
  name: string;
  description: string;
  gridSize?: GridSize;
  patterns: PatternPosition[];
}

export interface ScenarioMap {
  [key: string]: Scenario;
}

export interface PopulationDataPoint {
  generation: number;
  population: number;
}
