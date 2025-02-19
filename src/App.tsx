import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Simulations from "./pages/Simulations";
import GeneticArt from "./pages/GeneticArt";

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulations" element={<Simulations />} />
          <Route path="/genetic-art" element={<GeneticArt />} />
          <Route path="*" element={<Home />} /> {/* Catch-all route */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
