interface GlassPanel {
  points: { x: number; y: number }[];
  color: string;
  centerX: number;
  centerY: number;
}

interface StainedGlassSettings {
  numShapes: number; // Number of glass panels
  minSize: number; // Minimum panel size
  maxSize: number; // Maximum panel size
  mutationRate: number;
  borderWidth: number; // Width of the lead between panels
  borderColor: string; // Color of the lead
}

class StainedGlassGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private settings: StainedGlassSettings;
  private targetImageData: ImageData;
  private currentPanels: GlassPanel[] = [];
  private bestFitness: number = 0;
  private bestPanels: GlassPanel[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    targetImageData: ImageData,
    settings: StainedGlassSettings
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.targetImageData = targetImageData;
    this.settings = {
      ...settings,
      borderWidth: 2,
      borderColor: "#1a1a1a",
    };
    this.initializePanels();
  }

  private initializePanels() {
    this.currentPanels = [];

    // Create initial panels using Voronoi-like distribution
    for (let i = 0; i < this.settings.numShapes; i++) {
      const centerX = Math.random() * this.canvas.width;
      const centerY = Math.random() * this.canvas.height;

      // Create irregular polygon points around center
      const points = this.generatePolygonPoints(centerX, centerY);
      const color = this.sampleColor(centerX, centerY);

      this.currentPanels.push({
        points,
        color,
        centerX,
        centerY,
      });
    }
  }

  private generatePolygonPoints(
    centerX: number,
    centerY: number
  ): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];
    const numPoints = 5 + Math.floor(Math.random() * 3); // 5-7 points
    const radius =
      this.settings.minSize +
      Math.random() * (this.settings.maxSize - this.settings.minSize);

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const variance = 0.5 + Math.random() * 0.5; // Random radius variance

      points.push({
        x: centerX + Math.cos(angle) * radius * variance,
        y: centerY + Math.sin(angle) * radius * variance,
      });
    }

    return points;
  }

  private sampleColor(x: number, y: number): string {
    // Sample 5x5 area around point
    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const pixelX = Math.min(
          Math.max(Math.round(x + i), 0),
          this.canvas.width - 1
        );
        const pixelY = Math.min(
          Math.max(Math.round(y + j), 0),
          this.canvas.height - 1
        );
        const index = (pixelY * this.canvas.width + pixelX) * 4;

        r += this.targetImageData.data[index];
        g += this.targetImageData.data[index + 1];
        b += this.targetImageData.data[index + 2];
        count++;
      }
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    return `rgba(${r},${g},${b},0.9)`; // Slight transparency for glass effect
  }

  private renderPanels(panels: GlassPanel[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw panels
    panels.forEach((panel) => {
      // Draw panel
      this.ctx.beginPath();
      this.ctx.moveTo(panel.points[0].x, panel.points[0].y);

      for (let i = 1; i < panel.points.length; i++) {
        this.ctx.lineTo(panel.points[i].x, panel.points[i].y);
      }

      this.ctx.closePath();

      // Fill with glass color
      this.ctx.fillStyle = panel.color;
      this.ctx.fill();

      // Draw lead outline
      this.ctx.strokeStyle = this.settings.borderColor;
      this.ctx.lineWidth = this.settings.borderWidth;
      this.ctx.stroke();
    });
  }

  private mutatePanel(panel: GlassPanel): GlassPanel {
    if (Math.random() > this.settings.mutationRate) return panel;

    const mutated = { ...panel };

    // Mutate center position
    mutated.centerX += (Math.random() - 0.5) * 20;
    mutated.centerY += (Math.random() - 0.5) * 20;

    // Regenerate points around new center
    if (Math.random() < 0.3) {
      mutated.points = this.generatePolygonPoints(
        mutated.centerX,
        mutated.centerY
      );
    }

    // Mutate individual points slightly
    mutated.points = mutated.points.map((point) => ({
      x: point.x + (Math.random() - 0.5) * 10,
      y: point.y + (Math.random() - 0.5) * 10,
    }));

    // Resample color occasionally
    if (Math.random() < 0.2) {
      mutated.color = this.sampleColor(mutated.centerX, mutated.centerY);
    }

    return mutated;
  }

  public evolve() {
    const mutatedPanels = this.currentPanels.map((panel) =>
      this.mutatePanel(panel)
    );
    const mutatedFitness = this.calculateFitness(mutatedPanels);

    if (mutatedFitness > this.bestFitness) {
      this.bestFitness = mutatedFitness;
      this.bestPanels = [...mutatedPanels];
      this.currentPanels = mutatedPanels;
    }

    return {
      panels: this.currentPanels,
      fitness: this.bestFitness,
    };
  }

  private calculateFitness(panels: GlassPanel[]): number {
    this.renderPanels(panels);

    const currentImageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    ).data;
    const targetData = this.targetImageData.data;

    let totalDifference = 0;
    const totalPixels = this.canvas.width * this.canvas.height;

    for (let i = 0; i < currentImageData.length; i += 4) {
      const rDiff = Math.abs(currentImageData[i] - targetData[i]);
      const gDiff = Math.abs(currentImageData[i + 1] - targetData[i + 1]);
      const bDiff = Math.abs(currentImageData[i + 2] - targetData[i + 2]);

      const weightedDiff =
        (rDiff / 255) * 0.299 + (gDiff / 255) * 0.587 + (bDiff / 255) * 0.114;

      totalDifference += weightedDiff;
    }

    return Math.max(0, Math.min(1, 1 - totalDifference / totalPixels));
  }

  public getCanvasImage(): string {
    return this.canvas.toDataURL("image/png");
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public reset() {
    this.bestFitness = 0;
    this.bestPanels = [];
    this.initializePanels();
  }

  public reinitialize(
    canvas: HTMLCanvasElement,
    targetImageData: ImageData,
    settings: StainedGlassSettings
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.targetImageData = targetImageData;
    this.settings = {
      ...settings,
      borderWidth: 2,
      borderColor: "#1a1a1a",
    };
    this.reset();
  }
}

export default StainedGlassGenerator;
