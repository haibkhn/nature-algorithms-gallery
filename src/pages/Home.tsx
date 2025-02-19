import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, GitBranch, Sparkles, Code, Brain, Brush } from "lucide-react";

const Home: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Nature & Art Algorithms Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the intersection of nature, art, and computation through
            interactive simulations and creative algorithms
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Simulations Card */}
          <Link
            to="/simulations"
            className="group relative"
            onMouseEnter={() => setHoveredCard("simulations")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Nature Simulations
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-600 text-lg">
                    Explore fascinating natural phenomena through interactive
                    simulations:
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-blue-50">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Game of Life Evolution
                        </h3>
                        <p className="text-sm text-gray-600">
                          Watch cellular patterns emerge and evolve
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-blue-50">
                      <GitBranch className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Flocking Behavior
                        </h3>
                        <p className="text-sm text-gray-600">
                          Simulate bird flocking patterns
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-blue-50">
                      <Code className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Ant Colony Optimization
                        </h3>
                        <p className="text-sm text-gray-600">
                          Discover emergent path-finding behaviors
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 flex justify-between items-center">
                <span className="text-blue-600 font-medium">
                  Explore Simulations
                </span>
                <span className="text-blue-600 transition-transform group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Genetic Art Card */}
          <Link
            to="/genetic-art"
            className="group relative"
            onMouseEnter={() => setHoveredCard("genetic")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Brush className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Genetic Art
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-gray-600 text-lg">
                    Transform images using evolutionary algorithms and artistic
                    filters:
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-purple-50">
                      <Camera className="w-5 h-5 text-purple-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Stained Glass Effect
                        </h3>
                        <p className="text-sm text-gray-600">
                          Create beautiful stained glass interpretations
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-purple-50">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Mosaic Patterns
                        </h3>
                        <p className="text-sm text-gray-600">
                          Generate intricate mosaic designs
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-purple-50">
                      <GitBranch className="w-5 h-5 text-purple-500" />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Geometric Abstractions
                        </h3>
                        <p className="text-sm text-gray-600">
                          Create abstract geometric compositions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 flex justify-between items-center">
                <span className="text-purple-600 font-medium">
                  Explore Genetic Art
                </span>
                <span className="text-purple-600 transition-transform group-hover:translate-x-2">
                  →
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Feature Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex gap-2 items-center px-4 py-2 bg-gray-100 rounded-full text-gray-600 mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive & Real-time</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Nature-Inspired</h3>
              <p className="text-gray-600">
                Algorithms based on natural phenomena and evolutionary processes
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brush className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Creative Tools</h3>
              <p className="text-gray-600">
                Transform images and create unique artistic effects
              </p>
            </div>

            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">
                Explore and experiment with algorithm parameters in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
