import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function Converter() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [convertedImages, setConvertedImages] = useState([]);
  const [conversionType, setConversionType] = useState("png");
  const [conversionProgress, setConversionProgress] = useState(0);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    readImages(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    readImages(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const readImages = (files) => {
    const newSelectedImages = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newSelectedImages.push({ file, url: e.target.result });
        if (newSelectedImages.length === files.length) {
          setSelectedImages((prev) => [...prev, ...newSelectedImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const cancelUpload = (fileName) => {
    setSelectedImages((prev) =>
      prev.filter((image) => image.file.name !== fileName)
    );
  };

  const convertImages = () => {
    const totalImages = selectedImages.length;
    let completedImages = 0;
    const newConvertedImages = [];

    selectedImages.forEach((image) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const convertedUrl = URL.createObjectURL(blob);
          newConvertedImages.push({
            name: image.file.name,
            url: convertedUrl,
            blob,
          });
          completedImages++;
          setConversionProgress((completedImages / totalImages) * 100);
          if (completedImages === totalImages) {
            setConvertedImages(newConvertedImages);
          }
        }, `image/${conversionType}`);
      };
      img.src = image.url;
    });
  };

  const downloadImages = () => {
    if (convertedImages.length === 1) {
      const image = convertedImages[0];
      saveAs(image.blob, `${image.name.split(".")[0]}.${conversionType}`);
    } else {
      const zip = new JSZip();
      convertedImages.forEach((image) => {
        zip.file(`${image.name.split(".")[0]}.${conversionType}`, image.blob);
      });
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "converted_images.zip");
      });
    }
  };

  return (
    <div className="converter-container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="dropzone mb-3"
            style={{
              border: "2px dashed #007bff",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <p>Drag & drop images here</p>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          {selectedImages.map((image, index) => (
            <div key={index} className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span>{image.file.name}</span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => cancelUpload(image.file.name)}
                >
                  X
                </button>
              </div>
            </div>
          ))}
          <select
            className="form-control mb-3"
            value={conversionType}
            onChange={(e) => setConversionType(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
          </select>
          <button
            className="btn btn-primary mb-3"
            onClick={convertImages}
            disabled={selectedImages.length === 0}
          >
            Convert Images
          </button>
          <div className="progress mb-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${conversionProgress}%` }}
              aria-valuenow={conversionProgress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          {conversionProgress === 100 && (
            <button className="btn btn-success" onClick={downloadImages}>
              Download Converted Image
              {convertedImages.length > 1 ? "s as ZIP" : ""}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Converter;
