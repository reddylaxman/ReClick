import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./Resize.css";

const ImageResizer = () => {
  const [images, setImages] = useState([]);
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [selectedPercentage, setSelectedPercentage] = useState(null);
  const [resizeMode, setResizeMode] = useState("pixels");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(false);
  const [doNotEnlarge, setDoNotEnlarge] = useState(false);
  const [reWidth, setReWidth] = useState(1920);
  const [reHeight, setReHeight] = useState(1080);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({ name: file.name, dataUrl: reader.result, file });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((imageData) => {
      setImages(
        imageData.map((image) => ({
          ...image,
          originalWidth: 0,
          originalHeight: 0,
          resizedWidth: 0,
          resizedHeight: 0,
        }))
      );
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleImageChange({ target: { files } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const loadImageDimensions = async () => {
      const updatedImages = await Promise.all(
        images.map((image) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                ...image,
                originalWidth: img.width,
                originalHeight: img.height,
                resizedWidth: img.width,
                resizedHeight: img.height,
              });
            };
            img.src = image.dataUrl;
          });
        })
      );
      setImages(updatedImages);
    };

    if (images.length > 0) {
      loadImageDimensions();
    }
  }, [images]);

  const resizeImage = (img, targetWidth, targetHeight) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    return canvas.toDataURL("image/jpeg");
  };

  const handleResizeAndCompress = () => {
    if (images.length === 1) {
      const image = images[0];
      const img = new Image();
      img.onload = () => {
        let targetWidth = width;
        let targetHeight = height;

        if (resizeMode === "percentage" && selectedPercentage) {
          const scale = selectedPercentage / 100;
          targetWidth = image.originalWidth * scale;
          targetHeight = image.originalHeight * scale;
        }

        if (maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          if (targetWidth / targetHeight > aspectRatio) {
            targetWidth = targetHeight * aspectRatio;
          } else {
            targetHeight = targetWidth / aspectRatio;
          }
        }

        if (doNotEnlarge) {
          if (targetWidth > img.width || targetHeight > img.height) {
            targetWidth = img.width;
            targetHeight = img.height;
          }
        }

        const resizedDataUrl = resizeImage(img, targetWidth, targetHeight);
        const blob = dataURLtoBlob(resizedDataUrl);
        saveAs(blob, image.name);
      };
      img.src = image.dataUrl;
    } else {
      const resizedImagesPromises = images.map((imageData) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            let targetWidth = width;
            let targetHeight = height;

            if (resizeMode === "percentage" && selectedPercentage) {
              const scale = selectedPercentage / 100;
              targetWidth = imageData.originalWidth * scale;
              targetHeight = imageData.originalHeight * scale;
            }

            if (maintainAspectRatio) {
              const aspectRatio = img.width / img.height;
              if (targetWidth / targetHeight > aspectRatio) {
                targetWidth = targetHeight * aspectRatio;
              } else {
                targetHeight = targetWidth / aspectRatio;
              }
            }

            if (doNotEnlarge) {
              if (targetWidth > img.width || targetHeight > img.height) {
                targetWidth = img.width;
                targetHeight = img.height;
              }
            }

            const resizedDataUrl = resizeImage(img, targetWidth, targetHeight);
            resolve({
              ...imageData,
              dataUrl: resizedDataUrl,
              resizedWidth: targetWidth,
              resizedHeight: targetHeight,
            });
          };
          img.src = imageData.dataUrl;
        });
      });

      Promise.all(resizedImagesPromises).then((resizedImages) => {
        const zip = new JSZip();
        resizedImages.forEach((image) => {
          const base64Data = image.dataUrl.split("base64,")[1];
          zip.file(image.name, base64Data, { base64: true });
        });
        zip.generateAsync({ type: "blob" }).then((blob) => {
          saveAs(blob, "resized_images.zip");
        });
      });
    }
  };

  const handlePercentageClick = (percentage) => {
    setSelectedPercentage(percentage);
    updateResizedDimensions(percentage);
  };

  const updateResizedDimensions = (percentage) => {
    const updatedImages = images.map((imageData) => {
      const scale = percentage / 100;
      let targetWidth = imageData.originalWidth * scale;
      let targetHeight = imageData.originalHeight * scale;

      if (maintainAspectRatio) {
        const aspectRatio = imageData.originalWidth / imageData.originalHeight;
        if (targetWidth / targetHeight > aspectRatio) {
          targetWidth = targetHeight * aspectRatio;
        } else {
          targetHeight = targetWidth / aspectRatio;
        }
      }

      setReWidth(targetWidth);
      setReHeight(targetHeight);

      return {
        ...imageData,
        resizedWidth: targetWidth,
        resizedHeight: targetHeight,
      };
    });

    setImages(updatedImages);
  };

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <div className="container">
      <div
        className="left-side"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div
          className="drag-drop-zone"
          style={{ display: images.length > 0 ? "none" : "block" }}
        >
          <label htmlFor="imageInput" className="upload-label">
            <i className="fas fa-cloud-upload-alt"></i>
            Drag & Drop Images Here
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
        {images.length > 0 && (
          <div className="previews">
            {images.map((image, index) => (
              <div key={index} className="preview-item">
                <img
                  className="preview-image"
                  src={image.dataUrl}
                  alt="Preview"
                />
                <div className="preview-info"></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <aside className="right-side controls-section">
        <h2>Resize Options</h2>
        <div className="resize-mode-buttons">
          <button
            className={`resize-mode-button ${
              resizeMode === "pixels" ? "selected" : ""
            }`}
            onClick={() => {
              setResizeMode("pixels");
              setSelectedPercentage(null);
            }}
          >
            By pixels
          </button>
          <button
            className={`resize-mode-button ${
              resizeMode === "percentage" ? "selected" : ""
            }`}
            onClick={() => setResizeMode("percentage")}
          >
            By percentage
          </button>
        </div>

        {resizeMode === "pixels" && (
          <div className="controls">
            <div className="control-group">
              <label htmlFor="resizeWidth">Width (px):</label>
              <input
                type="number"
                id="resizeWidth"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                onBlur={() =>
                  updateResizedDimensions(selectedPercentage || 100)
                }
              />
            </div>
            <div className="control-group">
              <label htmlFor="resizeHeight">Height (px):</label>
              <input
                type="number"
                id="resizeHeight"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                onBlur={() =>
                  updateResizedDimensions(selectedPercentage || 100)
                }
              />
            </div>
            <div className="control-group">
              <input
                type="checkbox"
                id="maintainAspectRatio"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              />
              <label htmlFor="maintainAspectRatio">Maintain aspect ratio</label>
            </div>
            <div className="control-group">
              <input
                type="checkbox"
                id="doNotEnlarge"
                checked={doNotEnlarge}
                onChange={(e) => setDoNotEnlarge(e.target.checked)}
              />
              <label htmlFor="doNotEnlarge">Do not enlarge if smaller</label>
            </div>
          </div>
        )}

        {resizeMode === "percentage" && (
          <div className="controls">
            <div className="control-group">
              <label>Resize by Percentage:</label>
              <div className="percentage-options">
                <button
                  className={selectedPercentage === 25 ? "selected" : ""}
                  onClick={() => handlePercentageClick(25)}
                >
                  25% SMALLER
                </button>
                <button
                  className={selectedPercentage === 50 ? "selected" : ""}
                  onClick={() => handlePercentageClick(50)}
                >
                  50% SMALLER
                </button>
                <button
                  className={selectedPercentage === 75 ? "selected" : ""}
                  onClick={() => handlePercentageClick(75)}
                >
                  75% SMALLER
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          id="resizeButton"
          onClick={handleResizeAndCompress}
          disabled={images.length === 0}
        >
          {images.length === 1 ? "Download Image" : "Download Images"}
        </button>
      </aside>
    </div>
  );
};

export default ImageResizer;
