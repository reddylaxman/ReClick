import React, { useState } from "react";
import { FaArrowRotateLeft, FaArrowRotateRight } from "react-icons/fa6";
import { BiReflectVertical, BiReflectHorizontal } from "react-icons/bi";
import ImagePlaceholder from "../images/image-placeholder.svg";
import "./ImageEditor.css";

const ImageEditor = () => {
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [inversion, setInversion] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [transparent, setTransparent] = useState(100);
  const [coloration, setColoration] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(1);
  const [flipVertical, setFlipVertical] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("brightness");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const applyFilterStyle = () => {
    return {
      filter: `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%)
                     grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%) opacity(${transparent}%)
                     hue-rotate(${coloration}deg)`,
      transform: `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`,
    };
  };

  const resetFilters = () => {
    setBrightness(100);
    setSaturation(100);
    setInversion(0);
    setGrayscale(0);
    setBlur(0);
    setSepia(0);
    setTransparent(100);
    setColoration(0);
    setRotate(0);
    setFlipHorizontal(1);
    setFlipVertical(1);
    setSelectedFilter("brightness");
  };

  const saveImage = () => {
    if (!image) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%)
                          grayscale(${grayscale}%) blur(${blur}px) sepia(${sepia}%) opacity(${transparent}%)
                          hue-rotate(${coloration}deg)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (rotate !== 0) {
        ctx.rotate((rotate * Math.PI) / 180);
      }
      ctx.scale(flipHorizontal, flipVertical);
      ctx.drawImage(
        img,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );

      const link = document.createElement("a");
      link.download = "image.jpg";
      link.href = canvas.toDataURL();
      link.click();
    };
  };

  const filters = [
    {
      name: "Brightness",
      value: brightness,
      setValue: setBrightness,
      max: 200,
    },
    {
      name: "Saturation",
      value: saturation,
      setValue: setSaturation,
      max: 200,
    },
    { name: "Inversion", value: inversion, setValue: setInversion, max: 100 },
    { name: "Grayscale", value: grayscale, setValue: setGrayscale, max: 100 },
    { name: "Blur", value: blur, setValue: setBlur, max: 50 },
    { name: "Sepia", value: sepia, setValue: setSepia, max: 100 },
    {
      name: "Transparent",
      value: transparent,
      setValue: setTransparent,
      max: 100,
    },
    {
      name: "Coloration",
      value: coloration,
      setValue: setColoration,
      max: 360,
    },
  ];

  const currentFilter = filters.find(
    (filter) => filter.name.toLowerCase() === selectedFilter
  );

  return (
    <div className="image-editor-container">
      <h2>Image Editor</h2>
      <div className="wrapper">
        <div className="editor-panel">
          <div className="filter">
            <label className="title">Filters</label>
            <div className="options">
              {filters.map((filter) => (
                <button
                  key={filter.name}
                  className={
                    selectedFilter === filter.name.toLowerCase() ? "active" : ""
                  }
                  onClick={() => setSelectedFilter(filter.name.toLowerCase())}
                >
                  {filter.name}
                </button>
              ))}
            </div>
            <div className="slider">
              <div className="filter-info">
                <p className="name">{currentFilter.name}</p>
                <p className="value">{currentFilter.value}%</p>
              </div>
              <input
                type="range"
                value={currentFilter.value}
                min="0"
                max={currentFilter.max}
                onChange={(e) => currentFilter.setValue(e.target.value)}
              />
            </div>
          </div>
          <div className="rotate">
            <label className="title">Rotate & Flip</label>
            <div className="options">
              <button onClick={() => setRotate(rotate - 90)}>
                <FaArrowRotateLeft className="i-center" />
              </button>
              <button onClick={() => setRotate(rotate + 90)}>
                <FaArrowRotateRight className="i-center" />
              </button>
              <button onClick={() => setFlipHorizontal(flipHorizontal * -1)}>
                <BiReflectVertical className="i-center" />
              </button>
              <button onClick={() => setFlipVertical(flipVertical * -1)}>
                <BiReflectHorizontal className="i-center" />
              </button>
            </div>
          </div>
        </div>
        <div className="preview-img">
          {image ? (
            <img src={image} alt="preview" style={applyFilterStyle()} />
          ) : (
            <img
              src={ImagePlaceholder}
              alt="preview"
              style={applyFilterStyle()}
            />
          )}
        </div>
      </div>
      <div className="controls">
        <button className="reset-filter" onClick={resetFilters}>
          Reset Filters
        </button>
        <div className="row">
          <input
            type="file"
            className="file-input"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          <button
            className="choose-img"
            onClick={() => document.querySelector(".file-input").click()}
          >
            Choose Image
          </button>
          <button className="save-img" onClick={saveImage}>
            Save Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
