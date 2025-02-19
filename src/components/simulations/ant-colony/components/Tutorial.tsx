// src/components/simulations/ant-colony/components/Tutorial.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { TutorialProps } from "../types";

const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const steps = [
    {
      title: "Welcome to Ant Colony!",
      content:
        "This simulation demonstrates how ants find optimal paths to food using pheromone trails. Let's learn how to use it.",
      icon: "🐜",
    },
    {
      title: "Place Food Sources",
      content:
        "Select 'Food' mode and click on the grid to place food sources. Ants will search for and collect food, bringing it back to their nest.",
      icon: "🍎",
    },
    {
      title: "Create Obstacles",
      content:
        "Switch to 'Wall' mode to place obstacles. This will force ants to find alternative paths and demonstrate their problem-solving abilities.",
      icon: "🧱",
    },
    {
      title: "Watch Pheromone Trails",
      content:
        "As ants move, they leave pheromone trails - blue when returning home and green when heading to food. Stronger trails appear brighter.",
      icon: "👣",
    },
    {
      title: "Adjust Parameters",
      content:
        "Use the control panel to adjust ant behavior. Try changing pheromone strength, evaporation rate, and ant speed to see different patterns emerge.",
      icon: "🎮",
    },
    {
      title: "Colony Statistics",
      content:
        "Monitor colony performance through the stats panel. Watch how path lengths decrease as ants optimize their routes over time.",
      icon: "📊",
    },
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg mx-4 p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{steps[currentStep].icon}</span>
            <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close tutorial"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-600 mb-8">{steps[currentStep].content}</p>

        {/* Progress dots */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {currentStep < steps.length - 1 ? "Next" : "Get Started"}
            </button>
          </div>
        </div>

        {/* Skip option */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setShowTutorial(false);
              onClose();
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
