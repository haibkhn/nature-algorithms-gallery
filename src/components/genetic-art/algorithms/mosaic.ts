// src/components/genetic-art/algorithms/mosaic.ts
interface Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface MosaicSettings {
  numShapes: number; // Number of tiles
  minSize: number; // Minimum tile size
  maxSize: number; // Maximum tile size
  mutationRate: number;
}

class MosaicArtGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private settings: MosaicSettings;
  private targetImageData: ImageData;
  private currentTiles: Tile[] = [];
  private bestFitness: number = 0;
  private bestTiles: Tile[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    targetImageData: ImageData,
    settings: MosaicSettings
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.targetImageData = targetImageData;
    this.settings = settings;
    this.initializeTiles();
  }

  private initializeTiles() {
    this.currentTiles = [];

    // Calculate tiles based on aspect ratio
    const aspectRatio = this.canvas.width / this.canvas.height;
    let tilesX, tilesY;

    if (aspectRatio >= 1) {
      // Landscape or square
      tilesX = Math.ceil(Math.sqrt(this.settings.numShapes * aspectRatio));
      tilesY = Math.ceil(tilesX / aspectRatio);
    } else {
      // Portrait
      tilesY = Math.ceil(Math.sqrt(this.settings.numShapes / aspectRatio));
      tilesX = Math.ceil(tilesY * aspectRatio);
    }

    const tileWidth = this.canvas.width / tilesX;
    const tileHeight = this.canvas.height / tilesY;

    for (let i = 0; i < tilesY; i++) {
      for (let j = 0; j < tilesX; j++) {
        const x = j * tileWidth;
        const y = i * tileHeight;

        // Sample average color from the area this tile will cover
        const color = this.sampleAverageColor(x, y, tileWidth, tileHeight);

        this.currentTiles.push({
          x,
          y,
          width: tileWidth,
          height: tileHeight,
          color,
        });
      }
    }
  }

  private sampleAverageColor(
    x: number,
    y: number,
    width: number,
    height: number
  ): string {
    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    const stepX = Math.max(1, Math.floor(width / 4));
    const stepY = Math.max(1, Math.floor(height / 4));

    for (let i = 0; i < width; i += stepX) {
      for (let j = 0; j < height; j += stepY) {
        const pixelX = Math.min(Math.floor(x + i), this.canvas.width - 1);
        const pixelY = Math.min(Math.floor(y + j), this.canvas.height - 1);
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

    return `rgb(${r},${g},${b})`;
  }

  private renderTiles(tiles: Tile[]) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Add grout effect
    this.ctx.fillStyle = "#333333";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    tiles.forEach((tile) => {
      this.ctx.fillStyle = tile.color;
      // Slightly smaller to create grout effect
      this.ctx.fillRect(
        tile.x + 1,
        tile.y + 1,
        tile.width - 2,
        tile.height - 2
      );
    });
  }

  private mutateTile(tile: Tile): Tile {
    if (Math.random() > this.settings.mutationRate) return tile;

    const mutated = { ...tile };

    // Adjust color slightly
    const currentColor = tile.color.match(/\d+/g)!.map(Number);
    const r = Math.max(
      0,
      Math.min(255, currentColor[0] + (Math.random() - 0.5) * 30)
    );
    const g = Math.max(
      0,
      Math.min(255, currentColor[1] + (Math.random() - 0.5) * 30)
    );
    const b = Math.max(
      0,
      Math.min(255, currentColor[2] + (Math.random() - 0.5) * 30)
    );
    mutated.color = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;

    // Occasionally resample color from target image
    if (Math.random() < 0.1) {
      mutated.color = this.sampleAverageColor(
        tile.x,
        tile.y,
        tile.width,
        tile.height
      );
    }

    return mutated;
  }

  public evolve() {
    const mutatedTiles = this.currentTiles.map((tile) => this.mutateTile(tile));
    const mutatedFitness = this.calculateFitness(mutatedTiles);

    if (mutatedFitness > this.bestFitness) {
      this.bestFitness = mutatedFitness;
      this.bestTiles = [...mutatedTiles];
      this.currentTiles = mutatedTiles;
    }

    return {
      tiles: this.currentTiles,
      fitness: this.bestFitness,
    };
  }

  private calculateFitness(tiles: Tile[]): number {
    this.renderTiles(tiles);

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
    this.bestTiles = [];
    this.initializeTiles();
  }

  public reinitialize(
    canvas: HTMLCanvasElement,
    targetImageData: ImageData,
    settings: MosaicSettings
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.targetImageData = targetImageData;
    this.settings = settings;
    this.reset();
  }
}

export default MosaicArtGenerator;
