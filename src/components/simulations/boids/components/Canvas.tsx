import React, { useRef, useEffect, useState } from "react";
import { CanvasProps, Vector } from "../types";

const Canvas: React.FC<CanvasProps> = ({
  boids,
  settings,
  width,
  height,
  onMousePositionUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<Vector | null>(null);

  // Draw a single boid
  const drawBoid = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    isPredator: boolean = false
  ) => {
    const size = isPredator ? 15 : 10;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Draw boid
    ctx.beginPath();
    ctx.moveTo(size, 0);
    ctx.lineTo(-size, size / 2);
    ctx.lineTo(-size, -size / 2);
    ctx.closePath();

    // Fill and stroke - red for predators, blue for regular boids
    ctx.fillStyle = isPredator
      ? "rgba(239, 68, 68, 0.8)"
      : "rgba(59, 130, 246, 0.8)";
    ctx.strokeStyle = isPredator ? "rgb(185, 28, 28)" : "rgb(29, 78, 216)";
    ctx.lineWidth = 1;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  // Handle mouse movement
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    const newPos = { x, y };
    setMousePos(newPos);
    onMousePositionUpdate(newPos);
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    onMousePositionUpdate(null);
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

    // Draw mouse influence area if mouse is over canvas
    if (mousePos && settings.mouseInteraction !== "none") {
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, settings.mouseRadius, 0, Math.PI * 2);
      ctx.strokeStyle =
        settings.mouseInteraction === "attract"
          ? "rgba(59, 130, 246, 0.3)"
          : "rgba(239, 68, 68, 0.3)";
      ctx.stroke();
      ctx.fillStyle =
        settings.mouseInteraction === "attract"
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(239, 68, 68, 0.1)";
      ctx.fill();
    }

    // Draw all boids
    boids.forEach((boid) => {
      const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
      drawBoid(ctx, boid.position.x, boid.position.y, angle, boid.isPredator);
    });
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

  // Render when boids update
  useEffect(() => {
    render();
  }, [boids, mousePos, settings.mouseInteraction, settings.mouseRadius]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
