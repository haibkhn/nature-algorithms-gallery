// src/pages/GeneticArt.tsx
import React, { useState, useEffect } from "react";
import ImageUpload from "../components/genetic-art/ImageUpload";
import ArtDisplay from "../components/genetic-art/ArtDisplay";
import ControlPanel from "../components/genetic-art/ControlPanel";
import GeometricArtGenerator from "../components/genetic-art/algorithms/geometric";
import PointillismArtGenerator from "../components/genetic-art/algorithms/pointillism";
import MosaicArtGenerator from "../components/genetic-art/algorithms/mosaic";
import StainedGlassGenerator from "../components/genetic-art/algorithms/stainedGlass";
import { ArtSettings, getDefaultSettings } from "../types/settings";

const GeneticArt: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("geometric");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generator, setGenerator] = useState<
    | GeometricArtGenerator
    | PointillismArtGenerator
    | MosaicArtGenerator
    | StainedGlassGenerator
    | null
  >(null);
  const [settings, setSettings] = useState<ArtSettings>(
    getDefaultSettings("geometric")
  );
  const [stats, setStats] = useState({
    generation: 0,
    fitness: 0,
    shapes: settings.numShapes,
  });

  // Handle file upload
  const handleImageUpload = (imageData: string) => {
    setOriginalImage(imageData);
    setGeneratedImage(null);
    setIsGenerating(false);
    setStats({ generation: 0, fitness: 0, shapes: settings.numShapes });
  };

  // Reset function
  const resetGeneration = () => {
    setIsGenerating(false);
    setGeneratedImage(null);
    setStats({ generation: 0, fitness: 0, shapes: settings.numShapes });
    if (generator) {
      generator.reset();
    }
  };

  // Handle style change
  const handleStyleChange = (newStyle: string) => {
    setSelectedStyle(newStyle);
    setIsGenerating(false);
    setGeneratedImage(null);

    const newSettings = getDefaultSettings(newStyle);
    setSettings(newSettings);
    setStats({ generation: 0, fitness: 0, shapes: newSettings.numShapes });

    if (originalImage) {
      const canvas = generator?.getCanvas();
      if (canvas) {
        handleCanvasReady(canvas, newStyle);
      }
    }
  };

  // Handle settings change
  const handleSettingsChange = (newSettings: ArtSettings) => {
    setSettings(newSettings);
    setStats((prev) => ({ ...prev, shapes: newSettings.numShapes }));
    if (generator) {
      setIsGenerating(false);
      requestAnimationFrame(() => {
        const canvas = generator.getCanvas();
        handleCanvasReady(canvas);
      });
    }
  };

  // Initialize generator when canvas is ready
  const handleCanvasReady = (canvas: HTMLCanvasElement, style?: string) => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      const currentStyle = style || selectedStyle;
      let newGenerator;

      switch (currentStyle) {
        case "pointillism":
          newGenerator = new PointillismArtGenerator(
            canvas,
            imageData,
            settings
          );
          break;
        case "mosaic":
          newGenerator = new MosaicArtGenerator(canvas, imageData, settings);
          break;
        case "stained-glass":
          if (settings.type === "stained-glass") {
            newGenerator = new StainedGlassGenerator(
              canvas,
              imageData,
              settings
            );
          }
          break;
        case "geometric":
          if (settings.type === "geometric") {
            newGenerator = new GeometricArtGenerator(
              canvas,
              imageData,
              settings
            );
          }
          break;
      }

      setGenerator(newGenerator);
    };
    img.src = originalImage;
  };

  // Run evolution
  useEffect(() => {
    if (!isGenerating || !generator) return;

    let animationFrame: number;
    const evolve = () => {
      const result = generator.evolve();
      setStats((prev) => ({
        ...prev,
        generation: prev.generation + 1,
        fitness: result.fitness,
      }));
      setGeneratedImage(generator.getCanvasImage());

      if (isGenerating) {
        animationFrame = requestAnimationFrame(evolve);
      }
    };

    animationFrame = requestAnimationFrame(evolve);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isGenerating, generator]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Genetic Art Generator</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-72 flex-shrink-0 space-y-6">
          <ImageUpload onImageUpload={handleImageUpload} />
          <ControlPanel
            selectedStyle={selectedStyle}
            onStyleChange={handleStyleChange}
            isGenerating={isGenerating}
            onGenerationToggle={setIsGenerating}
            hasImage={!!originalImage}
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onReset={resetGeneration}
          />
        </div>

        <div className="flex-1 min-h-[500px] bg-white rounded-lg shadow-lg p-6">
          <ArtDisplay
            originalImage={originalImage}
            generatedImage={generatedImage}
            onCanvasReady={handleCanvasReady}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneticArt;
