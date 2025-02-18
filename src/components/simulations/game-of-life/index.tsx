// src/components/simulations/game-of-life/index.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import Grid from "./components/Grid";
import Controls from "./components/Controls";
import StatsPanel from "./components/StatsPanel";
import HelpModal from "./components/HelpModal";
import { SCENARIOS } from "./constants/scenarios";
import { Grid as GridType, GridSize, PopulationData } from "./types";

const GameOfLife: React.FC = () => {
  // Initialize with a larger grid
  const [gridSize] = useState<GridSize>({ rows: 100, cols: 100 });
  const [grid, setGrid] = useState<GridType>(() => createEmptyGrid(gridSize));
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [generation, setGeneration] = useState(0);
  const [populationHistory, setPopulationHistory] = useState<PopulationData[]>(
    []
  );
  const [showHelp, setShowHelp] = useState(false);
  const runningRef = useRef(isRunning);
  runningRef.current = isRunning;

  // Create empty grid
  function createEmptyGrid(size: GridSize): GridType {
    return Array(size.rows)
      .fill(null)
      .map(() => Array(size.cols).fill(false));
  }

  // Place pattern at specific position
  const placePattern = (
    pattern: number[][],
    startRow: number,
    startCol: number
  ): void => {
    setGrid((grid) => {
      const newGrid = grid.map((row) => [...row]);
      pattern.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (startRow + i < gridSize.rows && startCol + j < gridSize.cols) {
            newGrid[startRow + i][startCol + j] = cell === 1;
          }
        });
      });
      return newGrid;
    });
  };

  // Load scenario
  const loadScenario = (scenarioKey: string): void => {
    const scenario = SCENARIOS[scenarioKey];
    if (!scenario) return;

    // Clear the grid first
    setGrid(createEmptyGrid(gridSize));
    setGeneration(0);
    setPopulationHistory([]);

    // Place all patterns from the scenario
    scenario.patterns.forEach(({ pattern, position }) => {
      placePattern(pattern, position.x, position.y);
    });
  };

  // Count live cells
  const countLiveCells = useCallback((grid: GridType): number => {
    return grid.reduce(
      (sum, row) =>
        sum + row.reduce((rowSum, cell) => rowSum + (cell ? 1 : 0), 0),
      0
    );
  }, []);

  // Update population history
  useEffect(() => {
    const liveCells = countLiveCells(grid);
    setPopulationHistory((prev) => {
      const newHistory = [...prev, { generation, population: liveCells }];
      if (newHistory.length > 50) newHistory.shift(); // Keep last 50 generations
      return newHistory;
    });
  }, [grid, generation, countLiveCells]);

  // Count neighbors
  const countNeighbors = (grid: GridType, i: number, j: number): number => {
    let count = 0;
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue;
        const newI = i + x;
        const newJ = j + y;
        if (
          newI >= 0 &&
          newI < gridSize.rows &&
          newJ >= 0 &&
          newJ < gridSize.cols
        ) {
          count += grid[newI][newJ] ? 1 : 0;
        }
      }
    }
    return count;
  };

  // Run simulation
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid((g) => {
      const newGrid = g.map((row) => [...row]);

      for (let i = 0; i < gridSize.rows; i++) {
        for (let j = 0; j < gridSize.cols; j++) {
          const neighbors = countNeighbors(g, i, j);

          if (g[i][j]) {
            // Live cell
            if (neighbors < 2 || neighbors > 3) {
              newGrid[i][j] = false; // Dies
            }
          } else {
            // Dead cell
            if (neighbors === 3) {
              newGrid[i][j] = true; // Becomes alive
            }
          }
        }
      }

      return newGrid;
    });

    setGeneration((g) => g + 1);
    setTimeout(runSimulation, speed);
  }, [gridSize.rows, gridSize.cols, speed]);

  // Toggle cell
  const toggleCell = (i: number, j: number): void => {
    setGrid((grid) => {
      const newGrid = grid.map((row) => [...row]);
      newGrid[i][j] = !newGrid[i][j];
      return newGrid;
    });
  };

  // Random grid
  const randomGrid = (): void => {
    const newGrid = createEmptyGrid(gridSize);
    // Only randomize a 40x40 area in the center
    const centerStartRow = Math.floor((gridSize.rows - 40) / 2);
    const centerStartCol = Math.floor((gridSize.cols - 40) / 2);

    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 40; j++) {
        newGrid[centerStartRow + i][centerStartCol + j] = Math.random() > 0.7;
      }
    }

    setGrid(newGrid);
    setGeneration(0);
    setPopulationHistory([]);
  };

  // Clear grid
  const clearGrid = (): void => {
    setGrid(createEmptyGrid(gridSize));
    setGeneration(0);
    setPopulationHistory([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {/* Left side - Grid and Stats */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 min-h-[500px] bg-white rounded-lg">
          <Grid grid={grid} toggleCell={toggleCell} />
        </div>
        <div className="mt-4">
          <StatsPanel
            generation={generation}
            liveCells={countLiveCells(grid)}
            populationHistory={populationHistory}
          />
        </div>
      </div>

      {/* Right side - Controls */}
      <div className="lg:w-72 flex-shrink-0">
        <Controls
          isRunning={isRunning}
          onToggleRun={() => {
            setIsRunning(!isRunning);
            if (!isRunning) {
              runningRef.current = true;
              runSimulation();
            }
          }}
          onClear={clearGrid}
          onRandom={randomGrid}
          speed={speed}
          onSpeedChange={setSpeed}
          onSelectScenario={loadScenario}
          onShowHelp={() => setShowHelp(true)}
        />
      </div>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default GameOfLife;
