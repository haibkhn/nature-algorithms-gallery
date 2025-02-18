// src/components/genetic-art/algorithms/brushStrokes.ts
interface BrushStroke {
  startPoint: { x: number; y: number };
  controlPoints: { x: number; y: number }[];
  endPoint: { x: number; y: number };
  width: number;
  color: string;
  opacity: number;
  style: "round" | "flat" | "textured" | "calligraphy";
}

interface BrushStrokeSettings {
  numStrokes: number;
  maxLength: number;
  minWidth: number;
  maxWidth: number;
  curvature: number;
  followEdges: boolean;
  useImageColors: boolean;
  brushStyle: "round" | "flat" | "textured" | "calligraphy";
}

function generateBrushStrokes(
  imageData: ImageData,
  settings: BrushStrokeSettings
): BrushStroke[] {
  // 1. Process image
  const edges = detectEdges(imageData);
  const colorMap = createColorMap(imageData);

  // 2. Generate initial strokes
  let strokes: BrushStroke[] = [];

  // 3. Place strokes based on image features
  for (let i = 0; i < settings.numStrokes; i++) {
    // Find good starting point (edge or high contrast area)
    const startPoint = findStartPoint(edges);

    // Determine stroke direction
    const direction = settings.followEdges
      ? getEdgeDirection(edges, startPoint)
      : getRandomDirection();

    // Create control points for natural curve
    const controlPoints = generateControlPoints(
      startPoint,
      direction,
      settings.maxLength,
      settings.curvature
    );

    // Get color from image
    const color = settings.useImageColors
      ? getColorFromImage(colorMap, startPoint)
      : generateArtisticColor();

    // Add stroke
    strokes.push({
      startPoint,
      controlPoints,
      endPoint: controlPoints[controlPoints.length - 1],
      width: generateStrokeWidth(settings.minWidth, settings.maxWidth),
      color,
      opacity: generateOpacity(),
      style: settings.brushStyle,
    });
  }

  return strokes;
}

// Helper functions for rendering strokes to canvas
function renderStroke(ctx: CanvasRenderingContext2D, stroke: BrushStroke) {
  ctx.beginPath();
  ctx.moveTo(stroke.startPoint.x, stroke.startPoint.y);

  // Create bezier curve through control points
  for (let i = 0; i < stroke.controlPoints.length - 2; i += 2) {
    ctx.bezierCurveTo(
      stroke.controlPoints[i].x,
      stroke.controlPoints[i].y,
      stroke.controlPoints[i + 1].x,
      stroke.controlPoints[i + 1].y,
      stroke.controlPoints[i + 2].x,
      stroke.controlPoints[i + 2].y
    );
  }

  // Apply stroke style
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = stroke.style === "round" ? "round" : "butt";
  ctx.globalAlpha = stroke.opacity;

  // Apply texture if needed
  if (stroke.style === "textured") {
    applyBrushTexture(ctx);
  }

  ctx.stroke();
}
