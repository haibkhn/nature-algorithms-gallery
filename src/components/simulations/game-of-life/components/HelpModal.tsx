import React from "react";
import { X } from "lucide-react";
import { HelpModalProps } from "../types";

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Game of Life - Help</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Rules</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Live cells with fewer than 2 neighbors die</li>
                <li>Live cells with 2 or 3 neighbors survive</li>
                <li>Live cells with more than 3 neighbors die</li>
                <li>Dead cells with exactly 3 neighbors become alive</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Scenarios</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Glider Gun</h4>
                  <p className="text-sm text-gray-600">
                    Creates an infinite stream of gliders, demonstrating pattern
                    reproduction.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">Spaceship Fleet</h4>
                  <p className="text-sm text-gray-600">
                    Multiple spaceships moving in formation, showing pattern
                    movement.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Controls</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Click cells to toggle them alive/dead</li>
                <li>Use the speed slider to adjust simulation speed</li>
                <li>Choose a scenario or create your own pattern</li>
                <li>Watch the population graph to track changes</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
