// Components/Compressor.js
import React, { useState, useEffect, useRef } from "react";
import { compress } from "image-conversion";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./Compressor.css";

function CompressorComp() {
  const [compressedLink, setCompressedLink] = useState("");
  const [originalImages, setOriginalImages] = useState([]);
  const [originalLinks, setOriginalLinks] = useState([]);
  const [outputFileNames, setOutputFileNames] = useState([]);
  const [compressionQuality, setCompressionQuality] = useState(0.8);
  const [originalSizes, setOriginalSizes] = useState([]);
  const [compressedSizes, setCompressedSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadEnabled, setDownloadEnabled] = useState(false);
  const dropAreaRef = useRef(null);

  useEffect(() => {
    if (originalImages.length > 0) {
      setCompressedLink("");
      setCompressedSizes([]);
      setDownloadEnabled(false);
    }
  }, [originalImages]);

  async function uploadLink(event) {
    const imageFiles = Array.from(event.target.files);
    processImages(imageFiles);
  }

  async function handleDrop(event) {
    event.preventDefault();
    const imageFiles = Array.from(event.dataTransfer.files);
    processImages(imageFiles);
  }

  async function processImages(imageFiles) {
    const links = imageFiles.map((file) => URL.createObjectURL(file));
    const names = imageFiles.map((file) => file.name);
    const sizes = imageFiles.map((file) => file.size);

    setOriginalLinks(links);
    setOriginalImages(imageFiles);
    setOutputFileNames(names);
    setOriginalSizes(sizes);
  }

  async function compressImages() {
    if (originalImages.length === 0) {
      alert("Please upload images first.");
      return;
    }
    try {
      setLoading(true);
      if (originalImages.length === 1) {
        const compressedImage = await compress(originalImages[0], {
          quality: compressionQuality,
        });
        setCompressedLink(URL.createObjectURL(compressedImage));
        setCompressedSizes([compressedImage.size]);
      } else {
        const compressedImages = await Promise.all(
          originalImages.map((image) =>
            compress(image, { quality: compressionQuality })
          )
        );

        const zip = new JSZip();
        const compressedSizes = compressedImages.map((image, index) => {
          zip.file(outputFileNames[index], image, { binary: true });
          return image.size;
        });

        const compressedBlob = await zip.generateAsync({ type: "blob" });
        setCompressedLink(URL.createObjectURL(compressedBlob));
        setCompressedSizes(compressedSizes);
      }
      setDownloadEnabled(true);
    } catch (error) {
      console.error("Image compression failed:", error);
      alert("Image compression failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function resetApp() {
    setOriginalLinks([]);
    setOriginalImages([]);
    setOutputFileNames([]);
    setCompressionQuality(0.8);
    setOriginalSizes([]);
    setCompressedSizes([]);
    setCompressedLink("");
    setDownloadEnabled(false);
  }

  function preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    const dropArea = dropAreaRef.current;
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    dropArea.addEventListener("drop", handleDrop, false);

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.removeEventListener(eventName, preventDefaults, false);
      });
      dropArea.removeEventListener("drop", handleDrop, false);
    };
  }, []);

  const totalOriginalSize = originalSizes.reduce((acc, size) => acc + size, 0);
  const totalCompressedSize = compressedSizes.reduce(
    (acc, size) => acc + size,
    0
  );
  const compressionRatio = (
    (totalCompressedSize / totalOriginalSize) *
    100
  ).toFixed(2);

  return (
    <div className="compressor-container">
      <h1>Image Compressor</h1>
      <p>Compress your images without losing quality.</p>
      <div className="image-section">
        <div className="image-preview">
          {originalLinks.length > 0 ? (
            <img src={originalLinks[0]} alt="Original" />
          ) : (
            <div ref={dropAreaRef} className="placeholder drop-area">
              <span>Upload or drag images here</span>
              <input
                type="file"
                accept="image/*"
                onChange={uploadLink}
                className="upload-input"
                multiple
              />
            </div>
          )}
        </div>
        <div className="image-preview">
          {compressedLink ? (
            <img src={compressedLink} alt="Compressed" />
          ) : (
            <div className="placeholder">
              <span>Compressed images will appear here</span>
            </div>
          )}
        </div>
      </div>
      <div className="compression-controls">
        <span>Number of images: {originalImages.length}</span>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={compressionQuality}
          onChange={(event) =>
            setCompressionQuality(parseFloat(event.target.value))
          }
          className="compression-slider"
        />
        <div className="compression-info">
          <span>Original Size: {(totalOriginalSize / 1024).toFixed(2)} KB</span>
          <span>
            Compressed Size: {(totalCompressedSize / 1024).toFixed(2)} KB
          </span>
          <span>Compression Ratio: {compressionRatio}%</span>
        </div>
        <button
          onClick={compressImages}
          disabled={loading}
          className="compress-button"
        >
          {loading ? "Compressing..." : "Compress"}
        </button>
        <button onClick={resetApp} className="reset-button">
          Reset
        </button>
      </div>
      <a
        href={compressedLink}
        download={
          originalImages.length === 1
            ? outputFileNames[0]
            : "compressed_images.zip"
        }
        className={`download-button ${!downloadEnabled ? "disabled" : ""}`}
        onClick={(e) => {
          if (!downloadEnabled) {
            e.preventDefault();
          }
        }}
      >
        Download{" "}
        {originalImages.length === 1 ? "Compressed Image" : "Compressed Images"}
      </a>
    </div>
  );
}

export default CompressorComp;
