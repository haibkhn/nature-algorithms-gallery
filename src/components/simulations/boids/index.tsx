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
} from "./utils/FlockingRules";

const DEFAULT_SETTINGS: FlockingSettings = {
  alignmentForce: 1.0,
  cohesionForce: 1.0,
  separationForce: 1.2,
  visualRange: 50,
  separationRange: 25,
  numberOfBoids: 50, // Reduced for initial testing
  maxSpeed: 4,
  maxForce: 0.2,
  type: "boids",
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

  const canvasWidth = 800;
  const canvasHeight = 600;
  const animationFrameRef = useRef<number>();

  // Initialize boids
  const initializeBoids = useCallback(() => {
    console.log("Initializing boids..."); // Debug log
    const newBoids: Boid[] = [];
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
      });
    }
    console.log("Created boids:", newBoids.length); // Debug log
    setBoids(newBoids);
  }, [settings.numberOfBoids, settings.maxSpeed, settings.maxForce]);

  // Update simulation
  const updateSimulation = useCallback(() => {
    if (!isRunning) return;

    setBoids((currentBoids) => {
      return currentBoids.map((boid) => {
        // Calculate forces
        const alignment = calculateAlignment(boid, currentBoids, settings);
        const cohesion = calculateCohesion(boid, currentBoids, settings);
        const separation = calculateSeparation(boid, currentBoids, settings);

        // Update acceleration
        const acceleration = {
          x: alignment.x + cohesion.x + separation.x,
          y: alignment.y + cohesion.y + separation.y,
        };

        // Update velocity
        const velocity = {
          x: boid.velocity.x + acceleration.x,
          y: boid.velocity.y + acceleration.y,
        };

        // Limit speed
        const speed = Math.sqrt(
          velocity.x * velocity.x + velocity.y * velocity.y
        );
        if (speed > settings.maxSpeed) {
          velocity.x = (velocity.x / speed) * settings.maxSpeed;
          velocity.y = (velocity.y / speed) * settings.maxSpeed;
        }

        // Update position
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
    });

    animationFrameRef.current = requestAnimationFrame(updateSimulation);
  }, [isRunning, settings]);

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
    console.log("Component mounted"); // Debug log
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
      console.log("Starting simulation"); // Debug log
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
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1 min-h-[600px] bg-white rounded-lg overflow-hidden">
          <Canvas
            boids={boids}
            settings={settings}
            width={canvasWidth}
            height={canvasHeight}
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
        />
      </div>
    </div>
  );
};

export default Boids;
