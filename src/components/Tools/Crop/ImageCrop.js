import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { canvasPreview } from "./cropTool";

export default function ImageCrop({ url }) {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const download = async () => {
    if (imgRef.current && completedCrop) {
      await canvasPreview(imgRef.current, completedCrop);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <ReactCrop
        src={url}
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        className="mb-4"
      >
        <img
          ref={imgRef}
          alt="Error"
          src={url}
          className="border border-gray-300 rounded-lg flex justify-center p-2 w-full lg:w-40 h-30 object-contain"
          style={{ width: "500px", height: "300px" }}
        />
      </ReactCrop>
      <button
        className={`inline-block px-4 py-2 mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:shadow-outline`}
        onClick={download}
      >
        Download
      </button>
    </div>
  );
}
