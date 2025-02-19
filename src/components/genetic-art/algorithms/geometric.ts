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
  private bestShapes: Shape[] = [];

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
    this.currentShapes = [];
    const gridSize = Math.ceil(Math.sqrt(this.settings.numShapes));
    const cellWidth = this.canvas.width / gridSize;
    const cellHeight = this.canvas.height / gridSize;

    for (let i = 0; i < this.settings.numShapes; i++) {
      // Place shapes in a grid pattern initially
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const x = (col + 0.5) * cellWidth;
      const y = (row + 0.5) * cellHeight;

      // Sample color from target image
      const index = (Math.floor(y) * this.canvas.width + Math.floor(x)) * 4;
      const r = this.targetImageData.data[index];
      const g = this.targetImageData.data[index + 1];
      const b = this.targetImageData.data[index + 2];

      this.currentShapes.push({
        type: this.settings.shapeTypes[
          Math.floor(Math.random() * this.settings.shapeTypes.length)
        ],
        x,
        y,
        size:
          Math.random() * (this.settings.maxSize - this.settings.minSize) +
          this.settings.minSize,
        color: `rgba(${r},${g},${b},0.5)`,
        opacity: 0.5,
        rotation: Math.random() * Math.PI * 2,
      });
    }
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

  public evolve() {
    // Create mutated version of current shapes
    const mutatedShapes = this.currentShapes.map((shape) =>
      this.mutateShape(shape)
    );

    // Calculate fitness for both versions
    const currentFitness = this.calculateFitness(this.currentShapes);
    const mutatedFitness = this.calculateFitness(mutatedShapes);

    // Keep track of the best solution
    if (mutatedFitness > this.bestFitness) {
      this.bestFitness = mutatedFitness;
      this.bestShapes = [...mutatedShapes];
      this.currentShapes = mutatedShapes;
    } else if (mutatedFitness > currentFitness) {
      this.currentShapes = mutatedShapes;
    }

    // Always return the best fitness we've found
    return {
      shapes: this.currentShapes,
      fitness: this.bestFitness,
    };
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

  public getCanvasImage(): string {
    return this.canvas.toDataURL("image/png");
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public reinitialize(
    canvas: HTMLCanvasElement,
    targetImageData: ImageData,
    settings: GeometricArtSettings
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.targetImageData = targetImageData;
    this.settings = settings;
    this.reset();
  }

  private calculateFitness(shapes: Shape[]): number {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw shapes
    this.renderShapes(shapes);

    // Get current image data
    const currentImageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    ).data;
    const targetData = this.targetImageData.data;

    let totalDifference = 0;
    const totalPixels = this.canvas.width * this.canvas.height;

    // Compare each pixel's RGB values
    for (let i = 0; i < currentImageData.length; i += 4) {
      const rDiff = Math.abs(currentImageData[i] - targetData[i]);
      const gDiff = Math.abs(currentImageData[i + 1] - targetData[i + 1]);
      const bDiff = Math.abs(currentImageData[i + 2] - targetData[i + 2]);

      // Normalize differences to 0-1 range and weight them
      const normalizedDiff =
        (rDiff / 255) * 0.299 + (gDiff / 255) * 0.587 + (bDiff / 255) * 0.114;

      totalDifference += normalizedDiff;
    }

    // Calculate fitness (0 to 1, where 1 is perfect match)
    const averageDifference = totalDifference / totalPixels;
    const fitness = 1 - averageDifference;

    // Ensure we return a valid number between 0 and 1
    return Math.max(0, Math.min(1, fitness));
  }

  public reset() {
    this.bestFitness = 0;
    this.bestShapes = [];
    this.initializeShapes();
  }

  private mutateShape(shape: Shape): Shape {
    const mutated = { ...shape };

    if (Math.random() < this.settings.mutationRate) {
      // Position - allow smaller movements for fine-tuning
      mutated.x += (Math.random() - 0.5) * (this.canvas.width * 0.1);
      mutated.y += (Math.random() - 0.5) * (this.canvas.height * 0.1);

      // Size - proportional to current size
      mutated.size *= 0.8 + Math.random() * 0.4; // 80% to 120% of current size
      mutated.size = Math.max(
        this.settings.minSize,
        Math.min(this.settings.maxSize, mutated.size)
      );

      // Color - sample from target image occasionally
      if (Math.random() < 0.3) {
        const sampleX = Math.floor(mutated.x);
        const sampleY = Math.floor(mutated.y);
        if (
          sampleX >= 0 &&
          sampleX < this.canvas.width &&
          sampleY >= 0 &&
          sampleY < this.canvas.height
        ) {
          const index = (sampleY * this.canvas.width + sampleX) * 4;
          const r = this.targetImageData.data[index];
          const g = this.targetImageData.data[index + 1];
          const b = this.targetImageData.data[index + 2];
          mutated.color = `rgba(${r},${g},${b},${mutated.opacity})`;
        }
      } else {
        // Small color adjustments
        const color = mutated.color.match(/\d+/g)!.map(Number);
        for (let i = 0; i < 3; i++) {
          color[i] = Math.max(
            0,
            Math.min(255, color[i] + (Math.random() - 0.5) * 30)
          );
        }
        mutated.color = `rgba(${color[0]},${color[1]},${color[2]},${mutated.opacity})`;
      }

      // Opacity - smaller changes
      mutated.opacity = Math.max(
        0.1,
        Math.min(0.9, mutated.opacity + (Math.random() - 0.5) * 0.2)
      );

      // Rotation - smaller angles for fine-tuning
      if (mutated.type !== "circle") {
        mutated.rotation =
          (mutated.rotation || 0) + ((Math.random() - 0.5) * Math.PI) / 4;
      }
    }

    // Keep shape within canvas bounds
    mutated.x = Math.max(0, Math.min(this.canvas.width, mutated.x));
    mutated.y = Math.max(0, Math.min(this.canvas.height, mutated.y));

    return mutated;
  }

  // Add method to initialize shapes with colors from the target image
  private initializeShapesWithTargetColors(): Shape[] {
    const shapes: Shape[] = [];

    for (let i = 0; i < this.settings.numShapes; i++) {
      // Sample a random position
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;

      // Get color from target image
      const index = (Math.floor(y) * this.canvas.width + Math.floor(x)) * 4;
      const r = this.targetImageData.data[index];
      const g = this.targetImageData.data[index + 1];
      const b = this.targetImageData.data[index + 2];

      shapes.push({
        type: this.settings.shapeTypes[
          Math.floor(Math.random() * this.settings.shapeTypes.length)
        ],
        x,
        y,
        size:
          Math.random() * (this.settings.maxSize - this.settings.minSize) +
          this.settings.minSize,
        color: `rgba(${r},${g},${b},0.5)`,
        opacity: 0.5,
        rotation: Math.random() * Math.PI * 2,
      });
    }

    return shapes;
  }
}

export default GeometricArtGenerator;
