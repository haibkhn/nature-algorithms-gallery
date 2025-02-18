// src/pages/GeneticArt.tsx
import React, { useState } from "react";
import ImageUpload from "../components/genetic-art/ImageUpload";
import ArtDisplay from "../components/genetic-art/ArtDisplay";
import ControlPanel from "../components/genetic-art/ControlPanel";

const GeneticArt: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedArt, setGeneratedArt] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("geometric");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageUpload = (imageData: string) => {
    setOriginalImage(imageData);
    setGeneratedArt(null); // Reset generated art when new image is uploaded
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Genetic Art Generator</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Control Panel - Left Side */}
        <div className="lg:w-72 flex-shrink-0 space-y-6">
          <ImageUpload onImageUpload={handleImageUpload} />
          <ControlPanel
            selectedStyle={selectedStyle}
            onStyleChange={setSelectedStyle}
            isGenerating={isGenerating}
            onGenerationToggle={setIsGenerating}
            hasImage={!!originalImage}
          />
        </div>

        {/* Main Display - Right Side */}
        <div className="flex-1 min-h-[500px] bg-white rounded-lg shadow-lg p-6">
          <ArtDisplay
            originalImage={originalImage}
            generatedArt={generatedArt}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneticArt;
