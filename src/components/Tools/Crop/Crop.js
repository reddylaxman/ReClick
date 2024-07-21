import React, { useState } from "react";
import ImageCrop from "./ImageCrop";

function Crop() {
  const [url, setUrl] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => setUrl(e.target.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => setUrl(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100"
      style={{ marginTop: "-3rem" }}
    >
      <div
        className="w-full max-w-lg p-6 bg-white border-2 border-dashed border-blue-500 rounded-lg cursor-pointer text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p className="mb-4">Drag & Drop an image here or</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
        >
          Browse
        </label>
      </div>
      {url && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
          <ImageCrop url={url} />
        </div>
      )}
    </div>
  );
}

export default Crop;
