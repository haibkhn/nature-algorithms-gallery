import React, { useState } from "react";
import { X } from "lucide-react";

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const steps = [
    {
      title: "Welcome to Boids!",
      content:
        "This simulation shows how complex flocking behavior emerges from simple rules. Let's learn about the new features.",
      icon: "👋",
    },
    {
      title: "Mouse Interaction",
      content:
        "Move your mouse over the simulation to interact with boids. Use the controls to switch between attract and repel modes.",
      icon: "🖱️",
    },
    {
      title: "Predators",
      content:
        "Red triangles are predators that chase nearby boids. Regular boids will try to escape when predators get too close.",
      icon: "🦅",
    },
    {
      title: "Controls",
      content:
        "Adjust forces, speeds, and behaviors using the control panel. Try different combinations to create unique patterns!",
      icon: "🎮",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTutorial(false);
      onClose();
    }
  };

  if (!showTutorial) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md mx-4 p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{steps[currentStep].icon}</span>
            <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
          </div>
          <button
            onClick={() => {
              setShowTutorial(false);
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">{steps[currentStep].content}</p>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {currentStep < steps.length - 1 ? "Next" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
