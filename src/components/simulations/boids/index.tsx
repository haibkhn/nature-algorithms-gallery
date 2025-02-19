// src/components/simulations/boids/index.tsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import StatsPanel from "./components/StatsPanel";
import { Boid, FlockingSettings, FlockStats, Vector } from "./types";
import {
  calculateAlignment,
  calculateCohesion,
  calculateSeparation,
  calculateFlockingForces,
} from "./utils/FlockingRules";
import Tutorial from "./components/Tutorial";

const DEFAULT_SETTINGS: FlockingSettings = {
  type: "boids",
  alignmentForce: 1.0,
  cohesionForce: 1.0,
  separationForce: 1.2,
  visualRange: 50,
  separationRange: 25,
  numberOfBoids: 50,
  maxSpeed: 4,
  maxForce: 0.2,
  // New settings with default values
  mouseForce: 1.0,
  mouseRadius: 100,
  predatorForce: 1.0,
  numberOfPredators: 0,
  mouseInteraction: "none" as const,
};

const Boids: React.FC = () => {
  const [boids, setBoids] = useState<Boid[]>([]);
  const [settings, setSettings] = useState<FlockingSettings>(DEFAULT_SETTINGS);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<FlockStats>({
    averageSpeed: 0,
    averageAlignment: 0,
    groupCount: 1,
  });
  const [historyData, setHistoryData] = useState<
    { timestamp: number; alignment: number; groupCount: number }[]
  >([]);
  const [mousePosition, setMousePosition] = useState<Vector | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);

  const canvasWidth = 800;
  const canvasHeight = 600;
  const animationFrameRef = useRef<number>();

  // Initialize boids
  const initializeBoids = useCallback(() => {
    // console.log("Initializing boids...");
    const newBoids: Boid[] = [];

    // Regular boids
    for (let i = 0; i < settings.numberOfBoids; i++) {
      newBoids.push({
        position: {
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
        },
        velocity: {
          x: (Math.random() * 2 - 1) * settings.maxSpeed,
          y: (Math.random() * 2 - 1) * settings.maxSpeed,
        },
        acceleration: { x: 0, y: 0 },
        maxSpeed: settings.maxSpeed,
        maxForce: settings.maxForce,
        isPredator: false,
      });
    }

    // Add predators
    for (let i = 0; i < settings.numberOfPredators; i++) {
      newBoids.push({
        position: {
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
        },
        velocity: {
          x: (Math.random() * 2 - 1) * settings.maxSpeed * 1.2,
          y: (Math.random() * 2 - 1) * settings.maxSpeed * 1.2,
        },
        acceleration: { x: 0, y: 0 },
        maxSpeed: settings.maxSpeed * 1.2,
        maxForce: settings.maxForce * 1.2,
        isPredator: true,
      });
    }

    // console.log("Created boids:", newBoids.length);
    setBoids(newBoids);
  }, [
    settings.numberOfBoids,
    settings.numberOfPredators,
    settings.maxSpeed,
    settings.maxForce,
  ]);

  // Update simulation
  const updateSimulation = useCallback(() => {
    if (!isRunning) return;

    setBoids((currentBoids) => {
      const updatedBoids = currentBoids.map((boid) => {
        // Calculate forces using combined flocking rules
        const forces = calculateFlockingForces(
          boid,
          currentBoids,
          mousePosition,
          settings
        );

        // Apply forces to create new acceleration
        const acceleration = {
          x: forces.x,
          y: forces.y,
        };

        // Update velocity
        const velocity = {
          x: boid.velocity.x + acceleration.x,
          y: boid.velocity.y + acceleration.y,
        };

        // Apply speed limit based on boid type
        const maxSpeed = boid.isPredator
          ? settings.maxSpeed * 1.2
          : settings.maxSpeed;
        const speed = Math.sqrt(
          velocity.x * velocity.x + velocity.y * velocity.y
        );
        if (speed > maxSpeed) {
          velocity.x = (velocity.x / speed) * maxSpeed;
          velocity.y = (velocity.y / speed) * maxSpeed;
        }

        // Update position with wrapping
        const position = {
          x: (boid.position.x + velocity.x + canvasWidth) % canvasWidth,
          y: (boid.position.y + velocity.y + canvasHeight) % canvasHeight,
        };

        return {
          ...boid,
          position,
          velocity,
          acceleration,
        };
      });

      // Calculate stats with the updated boids
      const stats = calculateStats(updatedBoids);
      setStats(stats);
      updateHistoryData(stats);

      return updatedBoids;
    });

    animationFrameRef.current = requestAnimationFrame(updateSimulation);
  }, [isRunning, settings, mousePosition, canvasWidth, canvasHeight]);

  // Calculate statistics for the flock
  const calculateStats = (boids: Boid[]) => {
    const regularBoids = boids.filter((b) => !b.isPredator);

    // Calculate average speed
    const avgSpeed =
      regularBoids.reduce((sum, boid) => {
        const speed = Math.sqrt(
          boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y
        );
        return sum + speed;
      }, 0) / regularBoids.length;

    // Calculate alignment (how aligned the boids are in direction)
    const avgDirection = regularBoids.reduce(
      (sum, boid) => {
        const mag = Math.sqrt(
          boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y
        );
        return {
          x: sum.x + boid.velocity.x / mag,
          y: sum.y + boid.velocity.y / mag,
        };
      },
      { x: 0, y: 0 }
    );

    const alignmentValue =
      Math.sqrt(
        avgDirection.x * avgDirection.x + avgDirection.y * avgDirection.y
      ) / regularBoids.length;

    // Count distinct groups
    const groups = countGroups(regularBoids);

    return {
      averageSpeed: avgSpeed,
      averageAlignment: alignmentValue,
      groupCount: groups,
    };
  };

  // Helper function to count distinct groups
  const countGroups = (boids: Boid[], groupRadius: number = 50): number => {
    const visited = new Set<Boid>();
    let groupCount = 0;

    const findGroup = (boid: Boid) => {
      if (visited.has(boid)) return;
      visited.add(boid);

      boids.forEach((other) => {
        if (!visited.has(other)) {
          const dx = boid.position.x - other.position.x;
          const dy = boid.position.y - other.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < groupRadius) {
            findGroup(other);
          }
        }
      });
    };

    boids.forEach((boid) => {
      if (!visited.has(boid)) {
        groupCount++;
        findGroup(boid);
      }
    });

    return groupCount;
  };

  // Update history data for graphs
  const updateHistoryData = (currentStats: FlockStats) => {
    setHistoryData((prev) => {
      const newData = [
        ...prev,
        {
          timestamp: Date.now(),
          alignment: currentStats.averageAlignment * 100,
          groupCount: currentStats.groupCount,
        },
      ];

      // Keep only last 50 data points
      if (newData.length > 50) {
        newData.shift();
      }

      return newData;
    });
  };

  // Handle mouse position updates from Canvas
  const handleMousePositionUpdate = (position: Vector | null) => {
    setMousePosition(position);
    // Update boid behavior based on mouse position
    if (position) {
      // Update boid behaviors with mouse position
      // This will be used for attraction/repulsion based on settings.mouseInteraction
    }
  };

  // Handle controls
  const handleToggleRun = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    initializeBoids();
  };

  const handleScatter = () => {
    setBoids((currentBoids) => {
      return currentBoids.map((boid) => ({
        ...boid,
        velocity: {
          x: (Math.random() * 2 - 1) * settings.maxSpeed * 2,
          y: (Math.random() * 2 - 1) * settings.maxSpeed * 2,
        },
      }));
    });
  };

  // Initialize on mount
  useEffect(() => {
    // console.log("Component mounted"); // Debug log
    initializeBoids();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeBoids]);

  // Start/stop animation
  useEffect(() => {
    if (isRunning) {
      // console.log("Starting simulation"); // Debug log
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
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 min-h-[600px] bg-white rounded-lg overflow-hidden">
          <Canvas
            boids={boids}
            settings={settings}
            width={canvasWidth}
            height={canvasHeight}
            onMousePositionUpdate={handleMousePositionUpdate}
          />
        </div>
        <div className="mt-4">
          <StatsPanel stats={stats} historyData={historyData} />
        </div>
      </div>

      <div className="lg:w-72 flex-shrink-0">
        <Controls
          isRunning={isRunning}
          onToggleRun={handleToggleRun}
          settings={settings}
          onSettingsChange={setSettings}
          onReset={handleReset}
          onScatter={handleScatter}
          onShowTutorial={() => setShowTutorial(true)}
        />
      </div>
    </div>
  );
};

export default Boids;
