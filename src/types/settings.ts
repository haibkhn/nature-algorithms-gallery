// src/types/settings.ts
export type ShapeType = "circle" | "rectangle" | "triangle";

export interface BaseSettings {
  numShapes: number;
  mutationRate: number;
  minSize: number;
  maxSize: number;
  populationSize: number;
}

export interface GeometricSettings extends BaseSettings {
  type: "geometric";
  shapeTypes: ShapeType[];
}

export interface StainedGlassSettings extends BaseSettings {
  type: "stained-glass";
  borderWidth: number;
  borderColor: string;
}

export interface MosaicSettings extends BaseSettings {
  type: "mosaic";
}

export interface PointillismSettings extends BaseSettings {
  type: "pointillism";
}

export type ArtSettings =
  | GeometricSettings
  | StainedGlassSettings
  | MosaicSettings
  | PointillismSettings;

export const getDefaultSettings = (style: string): ArtSettings => {
  const baseSettings = {
    mutationRate: 0.1,
    populationSize: 50,
  };

  switch (style) {
    case "stained-glass":
      return {
        type: "stained-glass",
        ...baseSettings,
        numShapes: 100,
        minSize: 20,
        maxSize: 100,
        borderWidth: 2,
        borderColor: "#1a1a1a",
      };

    case "geometric":
      return {
        type: "geometric",
        ...baseSettings,
        numShapes: 500,
        minSize: 10,
        maxSize: 50,
        shapeTypes: ["circle", "rectangle", "triangle"],
      };

    case "mosaic":
      return {
        type: "mosaic",
        ...baseSettings,
        numShapes: 200,
        minSize: 20,
        maxSize: 100,
      };

    case "pointillism":
      return {
        type: "pointillism",
        ...baseSettings,
        numShapes: 1000,
        minSize: 2,
        maxSize: 10,
      };

    default:
      return {
        type: "geometric",
        ...baseSettings,
        numShapes: 500,
        minSize: 10,
        maxSize: 50,
        shapeTypes: ["circle", "rectangle", "triangle"],
      };
  }
};
