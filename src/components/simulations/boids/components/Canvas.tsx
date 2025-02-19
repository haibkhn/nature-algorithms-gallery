// src/components/simulations/boids/components/Canvas.tsx
import React, { useRef, useEffect } from "react";
import { CanvasProps, Boid } from "../types";

const Canvas: React.FC<CanvasProps> = ({ boids, settings, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw a single boid
  const drawBoid = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) => {
    const size = 10;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Draw boid
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size, size / 2);
    ctx.lineTo(-size, -size / 2);
    ctx.closePath();

    // Fill and stroke
    ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
    ctx.strokeStyle = "rgb(29, 78, 216)";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  // Main render function
  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = "rgba(229, 231, 235, 0.5)";
    ctx.lineWidth = 0.5;
    const gridSize = 50;

    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw all boids
    boids.forEach((boid) => {
      const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
      drawBoid(ctx, boid.position.x, boid.position.y, angle);
    });

    // Draw debug info
    ctx.fillStyle = "black";
    ctx.font = "12px monospace";
    ctx.fillText(`Boids: ${boids.length}`, 10, 20);
  };

  // Draw background grid
  const drawBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.save();
    ctx.strokeStyle = "rgba(229, 231, 235, 0.5)";
    ctx.lineWidth = 0.5;

    // Draw vertical lines
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Draw debug information
  const drawDebugInfo = (
    ctx: CanvasRenderingContext2D,
    boids: Boid[],
    settings: CanvasProps["settings"]
  ) => {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.font = "12px monospace";

    const info = [
      `Boids: ${boids.length}`,
      `Alignment: ${settings.alignmentForce}`,
      `Cohesion: ${settings.cohesionForce}`,
      `Separation: ${settings.separationForce}`,
    ];

    info.forEach((text, i) => {
      ctx.fillText(text, 10, 20 + i * 15);
    });

    ctx.restore();
  };

  // Set up canvas and start animation
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

  // Render when boids update
  useEffect(() => {
    render();
  }, [boids]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
        className="border border-gray-200 rounded-lg shadow-inner"
      />
    </div>
  );
};

export default Canvas;
