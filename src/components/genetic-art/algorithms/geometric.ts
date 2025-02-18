// src/components/genetic-art/algorithms/geometric.ts
interface Shape {
  type: "circle" | "triangle" | "rectangle";
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotation?: number; // for triangles and rectangles
}

interface GeometricArtSettings {
  numShapes: number;
  minSize: number;
  maxSize: number;
  shapeTypes: ("circle" | "triangle" | "rectangle")[];
  mutationRate: number;
  populationSize: number;
}

class GeometricArtGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private settings: GeometricArtSettings;
  private targetImageData: ImageData;
  private currentShapes: Shape[] = [];
  private bestFitness: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    targetImageData: ImageData,
    settings: GeometricArtSettings
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.targetImageData = targetImageData;
    this.settings = settings;
    this.initializeShapes();
  }

  private initializeShapes() {
    this.currentShapes = Array(this.settings.numShapes)
      .fill(null)
      .map(() => this.createRandomShape());
  }

  private createRandomShape(): Shape {
    const type =
      this.settings.shapeTypes[
        Math.floor(Math.random() * this.settings.shapeTypes.length)
      ];

    return {
      type,
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size:
        Math.random() * (this.settings.maxSize - this.settings.minSize) +
        this.settings.minSize,
      color: `rgba(${Math.random() * 255},${Math.random() * 255},${
        Math.random() * 255
      },1)`,
      opacity: Math.random(),
      rotation: type !== "circle" ? Math.random() * Math.PI * 2 : undefined,
    };
  }

  private mutateShape(shape: Shape): Shape {
    const mutated = { ...shape };

    if (Math.random() < this.settings.mutationRate) {
      // Randomly modify one property
      const property = Math.random();

      if (property < 0.2) {
        mutated.x = Math.max(
          0,
          Math.min(this.canvas.width, mutated.x + (Math.random() - 0.5) * 20)
        );
      } else if (property < 0.4) {
        mutated.y = Math.max(
          0,
          Math.min(this.canvas.height, mutated.y + (Math.random() - 0.5) * 20)
        );
      } else if (property < 0.6) {
        mutated.size = Math.max(
          this.settings.minSize,
          Math.min(
            this.settings.maxSize,
            mutated.size + (Math.random() - 0.5) * 10
          )
        );
      } else if (property < 0.8) {
        const color = mutated.color.match(/\d+/g)!.map(Number);
        const index = Math.floor(Math.random() * 3);
        color[index] = Math.max(
          0,
          Math.min(255, color[index] + (Math.random() - 0.5) * 20)
        );
        mutated.color = `rgba(${color[0]},${color[1]},${color[2]},1)`;
      } else {
        mutated.opacity = Math.max(
          0,
          Math.min(1, mutated.opacity + (Math.random() - 0.5) * 0.2)
        );
      }
    }

    return mutated;
  }

  public evolve() {
    // Create mutated version of current shapes
    const mutatedShapes = this.currentShapes.map((shape) =>
      this.mutateShape(shape)
    );

    // Render both versions and compare fitness
    const currentFitness = this.calculateFitness(this.currentShapes);
    const mutatedFitness = this.calculateFitness(mutatedShapes);

    // Keep the better version
    if (mutatedFitness > currentFitness) {
      this.currentShapes = mutatedShapes;
      this.bestFitness = mutatedFitness;
    }

    return {
      shapes: this.currentShapes,
      fitness: this.bestFitness,
    };
  }

  private calculateFitness(shapes: Shape[]): number {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw shapes
    this.renderShapes(shapes);

    // Compare with target image
    const currentImageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Calculate difference
    return this.compareImages(currentImageData, this.targetImageData);
  }

  private compareImages(current: ImageData, target: ImageData): number {
    // Simple pixel-by-pixel comparison
    let difference = 0;
    for (let i = 0; i < current.data.length; i += 4) {
      difference += Math.abs(current.data[i] - target.data[i]); // R
      difference += Math.abs(current.data[i + 1] - target.data[i + 1]); // G
      difference += Math.abs(current.data[i + 2] - target.data[i + 2]); // B
    }
    return 1 - difference / (target.data.length * 255);
  }

  private renderShapes(shapes: Shape[]) {
    // Sort shapes by size (larger shapes first)
    const sortedShapes = [...shapes].sort((a, b) => b.size - a.size);

    sortedShapes.forEach((shape) => {
      this.ctx.save();
      this.ctx.globalAlpha = shape.opacity;
      this.ctx.fillStyle = shape.color;

      switch (shape.type) {
        case "circle":
          this.drawCircle(shape);
          break;
        case "triangle":
          this.drawTriangle(shape);
          break;
        case "rectangle":
          this.drawRectangle(shape);
          break;
      }

      this.ctx.restore();
    });
  }

  private drawCircle(shape: Shape) {
    this.ctx.beginPath();
    this.ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawTriangle(shape: Shape) {
    const rotation = shape.rotation || 0;
    this.ctx.translate(shape.x, shape.y);
    this.ctx.rotate(rotation);

    // Draw equilateral triangle
    this.ctx.beginPath();
    const height = (shape.size * Math.sqrt(3)) / 2;
    this.ctx.moveTo(0, -height / 2); // Top point
    this.ctx.lineTo(-shape.size / 2, height / 2); // Bottom left
    this.ctx.lineTo(shape.size / 2, height / 2); // Bottom right
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawRectangle(shape: Shape) {
    const rotation = shape.rotation || 0;
    this.ctx.translate(shape.x, shape.y);
    this.ctx.rotate(rotation);

    // Randomly vary width and height for more interesting shapes
    const width = shape.size * (0.5 + Math.random() * 0.5);
    const height = shape.size * (0.5 + Math.random() * 0.5);

    this.ctx.fillRect(-width / 2, -height / 2, width, height);
  }

  // Add more advanced shape drawing
  private drawShape(shape: Shape) {
    // Common setup
    this.ctx.save();
    this.ctx.globalAlpha = shape.opacity;
    this.ctx.fillStyle = shape.color;
    this.ctx.translate(shape.x, shape.y);
    this.ctx.rotate(shape.rotation || 0);

    // Draw based on type
    switch (shape.type) {
      case "circle":
        this.drawCircle(shape);
        break;
      case "triangle":
        this.drawTriangle(shape);
        break;
      case "rectangle":
        this.drawRectangle(shape);
        break;
    }

    this.ctx.restore();
  }

  // Add color sampling from original image
  private sampleColor(x: number, y: number): string {
    const pixel = this.ctx.getImageData(x, y, 1, 1).data;
    return `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 1)`;
  }

  // Add function to create random shape with sampled color
  private createRandomShapeWithSampledColor(): Shape {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;

    return {
      type: this.settings.shapeTypes[
        Math.floor(Math.random() * this.settings.shapeTypes.length)
      ],
      x,
      y,
      size:
        Math.random() * (this.settings.maxSize - this.settings.minSize) +
        this.settings.minSize,
      color: this.sampleColor(x, y),
      opacity: 0.1 + Math.random() * 0.5, // Lower opacity for better blending
      rotation: Math.random() * Math.PI * 2,
    };
  }
}

export default GeometricArtGenerator;
