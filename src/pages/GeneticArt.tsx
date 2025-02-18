// src/pages/GeneticArt.tsx
import React, { useState, useEffect } from "react";
import ImageUpload from "../components/genetic-art/ImageUpload";
import ArtDisplay from "../components/genetic-art/ArtDisplay";
import ControlPanel from "../components/genetic-art/ControlPanel";
import GeometricArtGenerator from "../components/genetic-art/algorithms/geometric";

const GeneticArt: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("geometric");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generator, setGenerator] = useState<GeometricArtGenerator | null>(
    null
  );
  const [settings, setSettings] = useState({
    numShapes: 200,
    mutationRate: 0.1,
    minSize: 5,
    maxSize: 50,
  });
  const [stats, setStats] = useState({
    generation: 0,
    fitness: 0,
    shapes: 100,
  });

  // Handle file upload
  const handleImageUpload = (imageData: string) => {
    setOriginalImage(imageData);
    setGeneratedImage(null);
    setIsGenerating(false);
    setStats({ generation: 0, fitness: 0, shapes: 100 });
  };

  // Update generator when settings change
  const handleSettingsChange = (newSettings: any) => {
    setSettings(newSettings);
    if (generator) {
      setIsGenerating(false);
      // Wait for next frame to ensure generation has stopped
      requestAnimationFrame(() => {
        const canvas = generator.getCanvas();
        handleCanvasReady(canvas);
      });
    }
  };

  // Initialize generator when canvas is ready
  const handleCanvasReady = (canvas: HTMLCanvasElement) => {
    if (!originalImage) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      if (generator) {
        // Reinitialize existing generator
        generator.reinitialize(canvas, imageData, {
          numShapes: settings.numShapes,
          minSize: settings.minSize,
          maxSize: settings.maxSize,
          shapeTypes: ["circle", "triangle", "rectangle"],
          mutationRate: settings.mutationRate,
          populationSize: 1,
        });
      } else {
        // Create new generator
        const newGenerator = new GeometricArtGenerator(canvas, imageData, {
          numShapes: settings.numShapes,
          minSize: settings.minSize,
          maxSize: settings.maxSize,
          shapeTypes: ["circle", "triangle", "rectangle"],
          mutationRate: settings.mutationRate,
          populationSize: 1,
        });
        setGenerator(newGenerator);
      }
    };
    img.src = originalImage;
  };

  // Run evolution
  useEffect(() => {
    if (!isGenerating || !generator) return;

    let animationFrame: number;
    const evolve = () => {
      const result = generator.evolve();

      // Only update stats if we got valid results
      if (result && typeof result.fitness === "number") {
        setStats((prev) => ({
          ...prev,
          generation: prev.generation + 1,
          fitness: result.fitness,
        }));
        setGeneratedImage(generator.getCanvasImage());
      }

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
            onStyleChange={setSelectedStyle}
            isGenerating={isGenerating}
            onGenerationToggle={setIsGenerating}
            hasImage={!!originalImage}
            settings={settings}
            onSettingsChange={handleSettingsChange}
          />
        </div>

        <div className="flex-1 min-h-[500px] bg-white rounded-lg shadow-lg p-6">
          <ArtDisplay
            originalImage={originalImage}
            generatedImage={generatedImage}
            onCanvasReady={handleCanvasReady}
            stats={{
              generation: stats.generation,
              fitness: stats.fitness,
              shapes: settings.numShapes,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneticArt;
