// src/components/genetic-art/hooks/useGeneticArt.ts
import { useEffect, useRef, useState } from "react";
import GeometricArtGenerator from "../algorithms/geometric";

interface UseGeneticArtProps {
  originalImage: string | null;
  style: string;
  settings: any;
  isGenerating: boolean;
}

export function useGeneticArt({
  originalImage,
  style,
  settings,
  isGenerating,
}: UseGeneticArtProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [fitness, setFitness] = useState(0);
  const [generation, setGeneration] = useState(0);
  const generatorRef = useRef<GeometricArtGenerator | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize generator when image changes
  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;

    // Load image and create generator
    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;

      // Set canvas size to match image
      canvasRef.current.width = img.width;
      canvasRef.current.height = img.height;

      // Draw image and get its data
      const ctx = canvasRef.current.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      // Create new generator
      generatorRef.current = new GeometricArtGenerator(
        canvasRef.current,
        imageData,
        {
          numShapes: settings.numShapes || 100,
          minSize: settings.minSize || 5,
          maxSize: settings.maxSize || 50,
          shapeTypes: ["circle", "triangle", "rectangle"],
          mutationRate: settings.mutationRate || 0.1,
          populationSize: settings.populationSize || 1,
        }
      );

      // Reset stats
      setGeneration(0);
      setFitness(0);
    };
    img.src = originalImage;
  }, [originalImage, settings]);

  // Run evolution when generating
  useEffect(() => {
    if (!isGenerating || !generatorRef.current || !canvasRef.current) return;

    let animationFrame: number;

    const evolve = () => {
      const result = generatorRef.current!.evolve();
      console.log("Evolution result:", result);
      setFitness(result.fitness);
      setGeneration((g) => g + 1);

      // Convert canvas to image
      setGeneratedImage(canvasRef.current!.toDataURL("image/png"));

      if (isGenerating) {
        animationFrame = requestAnimationFrame(evolve);
      }
    };

    animationFrame = requestAnimationFrame(evolve);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isGenerating]);

  return {
    generatedImage,
    fitness,
    generation,
    canvasRef,
  };
}
