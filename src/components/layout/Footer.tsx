import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>Nature & Art Algorithms Gallery © {new Date().getFullYear()}</p>
        <p className="text-sm mt-1">Built with React & TypeScript</p>
      </div>
    </footer>
  );
};

export default Footer;
