// src/components/simulations/ant-colony/components/Canvas.tsx
import React, { useRef, useEffect } from "react";
import { CanvasProps } from "../types";

const Canvas: React.FC<CanvasProps> = ({
  grid,
  ants,
  food,
  settings,
  width,
  height,
  onCellClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellSize = Math.min(width, height) / grid.length;

  // Draw grid cell with pheromones
  const drawCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cell: (typeof grid)[0][0]
  ) => {
    const pixelX = x * cellSize;
    const pixelY = y * cellSize;

    // Draw base cell
    ctx.fillStyle = "white";
    ctx.fillRect(pixelX, pixelY, cellSize, cellSize);

    // Draw pheromones
    if (cell.homePheromone > 0 || cell.foodPheromone > 0) {
      const homeIntensity = Math.min(cell.homePheromone, 1);
      const foodIntensity = Math.min(cell.foodPheromone, 1);

      ctx.fillStyle = `rgba(0, 0, 255, ${homeIntensity * 0.3})`; // Blue for home
      ctx.fillRect(pixelX, pixelY, cellSize, cellSize);

      ctx.fillStyle = `rgba(0, 255, 0, ${foodIntensity * 0.3})`; // Green for food
      ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
    }

    // Draw obstacles
    if (cell.isObstacle) {
      ctx.fillStyle = "#4B5563"; // Gray
      ctx.fillRect(pixelX, pixelY, cellSize, cellSize);
    }

    // Draw nest
    if (cell.isNest) {
      ctx.fillStyle = "#B45309"; // Brown
      ctx.beginPath();
      ctx.arc(
        pixelX + cellSize / 2,
        pixelY + cellSize / 2,
        cellSize / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Draw food
    if (cell.isFood) {
      ctx.fillStyle = "#059669"; // Green
      ctx.beginPath();
      ctx.arc(
        pixelX + cellSize / 2,
        pixelY + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  // Draw an ant
  const drawAnt = (ctx: CanvasRenderingContext2D, ant: (typeof ants)[0]) => {
    const x = ant.position.x * cellSize + cellSize / 2;
    const y = ant.position.y * cellSize + cellSize / 2;
    const size = cellSize * 0.6;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ant.direction);

    // Ant body
    ctx.fillStyle = ant.hasFood ? "#059669" : "#000000";
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(-size / 2, size / 4);
    ctx.lineTo(-size / 2, -size / 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  // Main render function
  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid and pheromones
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        drawCell(ctx, x, y, grid[y][x]);
      }
    }

    // Draw ants
    ants.forEach((ant) => drawAnt(ctx, ant));

    // Optional: Draw grid lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= grid[0].length; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height);
      ctx.stroke();
    }

    for (let y = 0; y <= grid.length; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width, y * cellSize);
      ctx.stroke();
    }
  };

  // Handle canvas clicks
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);

    if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
      onCellClick(x, y);
    }
  };

  // Set up canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [width, height]);

  // Render when state changes
  useEffect(() => {
    render();
  }, [grid, ants, food]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="border border-gray-200 rounded-lg shadow-inner"
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
};

export default Canvas;
