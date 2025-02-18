import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Nature & Art Algorithms Gallery
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Simulations Section */}
        <Link
          to="/simulations"
          className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Nature Simulations</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Explore interactive simulations of natural phenomena:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Game of Life Evolution
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Flocking Behavior (Coming Soon)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Ant Colony Optimization (Coming Soon)
                </li>
              </ul>
            </div>
          </div>
        </Link>

        {/* Genetic Art Section */}
        <Link
          to="/genetic-art"
          className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Genetic Art</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Transform images using genetic algorithms:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Stained Glass Effect (Coming Soon)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Mosaic Patterns (Coming Soon)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Geometric Abstractions (Coming Soon)
                </li>
              </ul>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
