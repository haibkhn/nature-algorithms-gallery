import React, { useCallback } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

// Sample images array
const SAMPLE_IMAGES = [
  "/samples/sample1.jpg",
  "/samples/sample2.jpg",
  "/samples/sample3.jpg",
];

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        processFile(file);
      }
    },
    [onImageUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [onImageUpload]
  );

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadSampleImage = (imagePath: string) => {
    // Load the sample image
    fetch(imagePath)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "sample.jpg", { type: "image/jpeg" });
        processFile(file);
      })
      .catch((error) => console.error("Error loading sample image:", error));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Upload Image</h2>

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="w-8 h-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            Drag and drop an image here, or click to select
          </div>
        </label>
      </div>

      {/* Sample Images */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Or try a sample:
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_IMAGES.map((imagePath, index) => (
            <button
              key={index}
              className="aspect-square p-2 border rounded hover:bg-gray-50 relative overflow-hidden"
              onClick={() => loadSampleImage(imagePath)}
            >
              <img
                src={imagePath}
                alt={`Sample ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
