// src/components/genetic-art/algorithms/pointillism.ts
interface Dot {
  x: number;
  y: number;
  radius: number;
  color: string;
}

interface PointillismSettings {
  numShapes: number;
  minSize: number;
  maxSize: number;
  mutationRate: number;
}

class PointillismArtGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private settings: PointillismSettings;
  private targetImageData: ImageData;
  private currentDots: Dot[] = [];
  private bestFitness: number = 0;
  private bestDots: Dot[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    targetImageData: ImageData,
    settings: PointillismSettings
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.targetImageData = targetImageData;
    this.settings = settings;
    this.initializeDots();
  }

  private initializeDots() {
    // Clear existing dots
    this.currentDots = [];

    // Sample colors from original image for initial dots
    for (let i = 0; i < this.settings.numShapes; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const radius =
        Math.random() * (this.settings.maxSize - this.settings.minSize) +
        this.settings.minSize;

      // Sample color from target image
      const color = this.sampleColor(Math.floor(x), Math.floor(y));

      this.currentDots.push({ x, y, radius, color });
    }
  }

  private sampleColor(x: number, y: number): string {
    const index = (y * this.canvas.width + x) * 4;
    const r = this.targetImageData.data[index];
    const g = this.targetImageData.data[index + 1];
    const b = this.targetImageData.data[index + 2];
    return `rgba(${r},${g},${b},0.5)`; // Semi-transparent dots
  }

  private renderDots(dots: Dot[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Sort dots by radius (larger dots first)
    const sortedDots = [...dots].sort((a, b) => b.radius - a.radius);

    sortedDots.forEach((dot) => {
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = dot.color;
      this.ctx.fill();
    });
  }

  private mutateDot(dot: Dot): Dot {
    if (Math.random() > this.settings.mutationRate) return dot;

    const mutated = { ...dot };

    // Position mutations
    mutated.x += (Math.random() - 0.5) * 20;
    mutated.y += (Math.random() - 0.5) * 20;

    // Radius mutations
    mutated.radius = Math.max(
      this.settings.minSize,
      Math.min(
        this.settings.maxSize,
        mutated.radius * (0.8 + Math.random() * 0.4)
      )
    );

    // Color mutations (sample from nearby area)
    if (Math.random() < 0.3) {
      mutated.color = this.sampleColor(
        Math.floor(mutated.x),
        Math.floor(mutated.y)
      );
    }

    // Keep within canvas bounds
    mutated.x = Math.max(0, Math.min(this.canvas.width, mutated.x));
    mutated.y = Math.max(0, Math.min(this.canvas.height, mutated.y));

    return mutated;
  }

  public evolve() {
    // Create mutated version
    const mutatedDots = this.currentDots.map((dot) => this.mutateDot(dot));

    // Calculate fitness for both versions
    const currentFitness = this.calculateFitness(this.currentDots);
    const mutatedFitness = this.calculateFitness(mutatedDots);

    // Keep track of the best solution
    if (mutatedFitness > this.bestFitness) {
      this.bestFitness = mutatedFitness;
      this.bestDots = [...mutatedDots];
      this.currentDots = mutatedDots;
    } else if (mutatedFitness > currentFitness) {
      this.currentDots = mutatedDots;
    }

    return {
      dots: this.currentDots,
      fitness: this.bestFitness,
    };
  }

  private calculateFitness(dots: Dot[]): number {
    this.renderDots(dots);

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

    const averageDifference = totalDifference / totalPixels;
    return Math.max(0, Math.min(1, 1 - averageDifference));
  }

  public getCanvasImage(): string {
    return this.canvas.toDataURL("image/png");
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public reset() {
    this.bestFitness = 0;
    this.bestDots = [];
    this.initializeDots();
  }

  public reinitialize(
    canvas: HTMLCanvasElement,
    targetImageData: ImageData,
    settings: PointillismSettings
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.targetImageData = targetImageData;
    this.settings = settings;
    this.reset();
  }
}

export default PointillismArtGenerator;
