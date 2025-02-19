// src/components/simulations/ant-colony/index.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import StatsPanel from "./components/StatsPanel";
import Tutorial from "./components/Tutorial";
import {
  Ant,
  Food,
  Grid,
  GridCell,
  Position,
  AntColonySettings,
  Stats,
} from "./types";
import { updateAnt, updatePheromones, addPheromone } from "./utils/antLogic";
import { calculateStats, evaluatePathEfficiency } from "./utils/statsHelper";

const DEFAULT_SETTINGS: AntColonySettings = {
  type: "ant-colony",
  numberOfAnts: 50,
  pheromoneStrength: 1.0,
  pheromoneEvaporation: 0.005, // Reduced evaporation rate
  antSpeed: 1.0,
  sensorDistance: 20,
  sensorAngle: Math.PI / 4,
  foodAmount: 100,
};

const GRID_SIZE = 100;
const NEST_POSITION = { x: GRID_SIZE / 2, y: GRID_SIZE / 2 };

const AntColony: React.FC = () => {
  // State
  const [grid, setGrid] = useState<Grid>(() => createGrid());
  const [ants, setAnts] = useState<Ant[]>([]);
  const [food, setFood] = useState<Food[]>([]);
  const [settings, setSettings] = useState<AntColonySettings>(DEFAULT_SETTINGS);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"food" | "obstacle" | "none">("none");
  const [stats, setStats] = useState<Stats>({
    foodCollected: 0,
    activeAnts: 0,
    averagePathLength: 0,
    totalPheromoneIntensity: 0,
  });
  const [historyData, setHistoryData] = useState<
    {
      timestamp: number;
      foodCollected: number;
      avgPathLength: number;
    }[]
  >([]);
  const [showTutorial, setShowTutorial] = useState(true);

  const animationFrameRef = useRef<number>();

  // Initialize grid
  function createGrid(): Grid {
    const grid: Grid = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => ({
            homePheromone: 0,
            foodPheromone: 0,
            isObstacle: false,
            isNest: false,
            isFood: false,
          }))
      );

    // Set nest position
    grid[NEST_POSITION.y][NEST_POSITION.x].isNest = true;

    return grid;
  }

  // Initialize ants
  const initializeAnts = useCallback(() => {
    const newAnts: Ant[] = [];
    for (let i = 0; i < settings.numberOfAnts; i++) {
      newAnts.push({
        id: i,
        position: { ...NEST_POSITION },
        path: [{ ...NEST_POSITION }],
        hasFood: false,
        direction: Math.random() * Math.PI * 2,
      });
    }
    setAnts(newAnts);
  }, [settings.numberOfAnts]);

  // Handle cell click
  const handleCellClick = (x: number, y: number) => {
    // Don't allow modification of the nest cell
    if (x === NEST_POSITION.x && y === NEST_POSITION.y) return;

    if (mode === "food") {
      setFood((prevFood) => [
        ...prevFood,
        {
          position: { x, y },
          amount: settings.foodAmount,
        },
      ]);
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        newGrid[y][x].isFood = true;
        return newGrid;
      });
    } else if (mode === "obstacle") {
      setGrid((prev) => {
        // Create a deep copy of the grid
        const newGrid = prev.map((row) => row.map((cell) => ({ ...cell })));

        // Toggle the obstacle state
        newGrid[y][x].isObstacle = !newGrid[y][x].isObstacle;

        // If we're adding a wall and there's food here, remove it
        if (newGrid[y][x].isObstacle && newGrid[y][x].isFood) {
          newGrid[y][x].isFood = false;
          setFood((prevFood) =>
            prevFood.filter((f) => f.position.x !== x || f.position.y !== y)
          );
        }

        // Clear pheromones if it's a wall
        if (newGrid[y][x].isObstacle) {
          newGrid[y][x].homePheromone = 0;
          newGrid[y][x].foodPheromone = 0;
        }

        return newGrid;
      });
    }
  };

  // Update statistics
  const updateStats = useCallback(() => {
    const newStats = calculateStats(ants, grid);
    setStats(newStats);

    setHistoryData((prev) => {
      const newData = [
        ...prev,
        {
          timestamp: Date.now(),
          foodCollected: newStats.foodCollected,
          avgPathLength: newStats.averagePathLength,
        },
      ];
      if (newData.length > 50) newData.shift();
      return newData;
    });
  }, [ants, grid]);

  // Main simulation update
  const updateSimulation = useCallback(() => {
    if (!isRunning) return;

    // Update ants
    setAnts((currentAnts) => {
      const updatedAnts = currentAnts.map((ant) => {
        const updatedAnt = updateAnt(ant, grid, food, settings);

        // Add pheromones based on ant state
        if (updatedAnt.hasFood) {
          setGrid((prev) =>
            addPheromone(
              prev,
              updatedAnt.position,
              "home",
              settings.pheromoneStrength
            )
          );
        } else {
          setGrid((prev) =>
            addPheromone(
              prev,
              updatedAnt.position,
              "food",
              settings.pheromoneStrength
            )
          );
        }

        return updatedAnt;
      });

      return updatedAnts;
    });

    // Update pheromones
    setGrid((prev) => updatePheromones(prev, settings));

    // Update stats
    updateStats();

    animationFrameRef.current = requestAnimationFrame(updateSimulation);
  }, [isRunning, grid, food, settings, updateStats]);

  // Reset simulation
  const handleReset = () => {
    setIsRunning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setGrid(createGrid());
    setFood([]);
    initializeAnts();
    setStats({
      foodCollected: 0,
      activeAnts: 0,
      averagePathLength: 0,
      totalPheromoneIntensity: 0,
    });
    setHistoryData([]);
  };

  // Clear obstacles and food
  const handleClear = () => {
    setGrid((prev) => {
      const newGrid = prev.map((row) =>
        row.map((cell) => ({
          ...cell,
          isObstacle: false,
          isFood: false,
          homePheromone: 0,
          foodPheromone: 0,
        }))
      );
      newGrid[NEST_POSITION.y][NEST_POSITION.x].isNest = true;
      return newGrid;
    });
    setFood([]);
  };

  // Initialize on mount
  useEffect(() => {
    initializeAnts();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeAnts]);

  // Start/stop simulation
  useEffect(() => {
    if (isRunning) {
      updateSimulation();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, updateSimulation]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      {showTutorial && (
        <Tutorial
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 min-h-[600px] bg-white rounded-lg overflow-hidden">
          <Canvas
            grid={grid}
            ants={ants}
            food={food}
            settings={settings}
            width={600}
            height={600}
            onCellClick={handleCellClick}
          />
        </div>
        <div className="mt-4">
          <StatsPanel stats={stats} historyData={historyData} />
        </div>
      </div>

      <div className="lg:w-72 flex-shrink-0">
        <Controls
          isRunning={isRunning}
          onToggleRun={() => setIsRunning(!isRunning)}
          settings={settings}
          onSettingsChange={setSettings}
          onReset={handleReset}
          onClear={handleClear}
          mode={mode}
          onModeChange={setMode}
          onShowTutorial={() => setShowTutorial(true)}
        />
      </div>

      {/* <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} /> */}
    </div>
  );
};

export default AntColony;
