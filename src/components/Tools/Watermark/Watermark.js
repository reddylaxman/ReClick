// ImageWatermark.js
import React, { useState } from "react";
import { Watermark, Radio, Input, Slider, Row, Col } from "antd";
import { SketchPicker } from "react-color";
import html2canvas from "html2canvas";
import "antd/dist/reset.css";
import "./Watermark.css";

const ImageWatermark = () => {
  const [image, setImage] = useState(null);
  const [watermarkType, setWatermarkType] = useState("text");
  const [content, setContent] = useState("ReClick");
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [color, setColor] = useState("rgba(0, 0, 0, 0.15)");
  const [fontSize, setFontSize] = useState(16);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [rotate, setRotate] = useState(-22);
  const [gap, setGap] = useState([100, 100]);
  const [offset, setOffset] = useState([0, 0]);
  const [zIndex, setZIndex] = useState(0);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleWatermarkImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setWatermarkImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    html2canvas(document.querySelector("#watermarked-image"), {
      allowTaint: true,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "watermarked-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <div className="watermark-container">
      <div
        className="drop-zone-watermark"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>Drag & Drop files here</p>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
      </div>
      {image && (
        <div className="watermark-main-content">
          <div className="watermark-image-preview" id="watermarked-image">
            <Watermark
              content={watermarkType === "text" ? content : undefined}
              image={watermarkType === "image" ? watermarkImage : undefined}
              font={{ color, fontSize }}
              gap={gap}
              offset={offset}
              rotate={rotate}
              width={watermarkType === "image" ? width : undefined}
              height={watermarkType === "image" ? height : undefined}
            >
              <img
                src={image}
                alt="Selected"
                className="watermark-preview-image"
              />
            </Watermark>
          </div>
          <div className="watermark-settings">
            <Radio.Group
              onChange={(e) => setWatermarkType(e.target.value)}
              value={watermarkType}
              className="watermark-type"
            >
              <Radio value="text">Text Watermark</Radio>
              <Radio value="image">Image Watermark</Radio>
            </Radio.Group>
            {watermarkType === "text" && (
              <>
                <label className="block mb-2">Content</label>
                <Input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <Row gutter={16} className="mt-1">
                  <Col span={12}>
                    <label className="block mb-2">Color</label>
                    <SketchPicker
                      color={color}
                      onChangeComplete={(color) => setColor(color.hex)}
                    />
                  </Col>
                  <Col span={12}>
                    <label className="block mb-2">Font Size</label>
                    <Slider
                      min={10}
                      max={100}
                      value={fontSize}
                      onChange={(value) => setFontSize(value)}
                    />
                    <label className="block mt-2 mb-2">Rotate</label>
                    <Slider
                      min={-180}
                      max={180}
                      value={rotate}
                      onChange={(value) => setRotate(value)}
                    />
                    <label className="block mt-1 mb-2">Gap</label>
                    <div className="watermark-input-group">
                      <Input
                        placeholder="Gap X"
                        value={gap[0]}
                        onChange={(e) =>
                          setGap([Number(e.target.value), gap[1]])
                        }
                      />
                      <Input
                        placeholder="Gap Y"
                        value={gap[1]}
                        onChange={(e) =>
                          setGap([gap[0], Number(e.target.value)])
                        }
                      />
                    </div>
                    <label className="block mt-1 mb-2">Offset</label>
                    <div className="watermark-input-group">
                      <Input
                        placeholder="Offset X"
                        value={offset[0]}
                        onChange={(e) =>
                          setOffset([Number(e.target.value), offset[1]])
                        }
                      />
                      <Input
                        placeholder="Offset Y"
                        value={offset[1]}
                        onChange={(e) =>
                          setOffset([offset[0], Number(e.target.value)])
                        }
                      />
                    </div>
                    <Col span={24}>
                      <label className="block mb-2">Z-Index</label>
                      <Input
                        type="number"
                        value={zIndex}
                        onChange={(e) => setZIndex(Number(e.target.value))}
                      />
                    </Col>
                  </Col>
                </Row>
              </>
            )}
            {watermarkType === "image" && (
              <>
                <label className="block mb-2">Upload Watermark Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWatermarkImageUpload}
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <label className="block mt-4 mb-2">Width</label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                    />
                  </Col>
                  <Col span={12}>
                    <label className="block mt-4 mb-2">Height</label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </Col>
                  <Col span={12}>
                    <label className="block mb-2">Rotate</label>
                    <Slider
                      min={-180}
                      max={180}
                      value={rotate}
                      onChange={(value) => setRotate(value)}
                    />
                  </Col>
                  <Col span={12}>
                    <label className="block mb-2">Gap</label>
                    <div className="watermark-input-group">
                      <Input
                        placeholder="Gap X"
                        value={gap[0]}
                        onChange={(e) =>
                          setGap([Number(e.target.value), gap[1]])
                        }
                      />
                      <Input
                        placeholder="Gap Y"
                        value={gap[1]}
                        onChange={(e) =>
                          setGap([gap[0], Number(e.target.value)])
                        }
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <label className="block mb-2">Offset</label>
                    <div className="watermark-input-group">
                      <Input
                        placeholder="Offset X"
                        value={offset[0]}
                        onChange={(e) =>
                          setOffset([Number(e.target.value), offset[1]])
                        }
                      />
                      <Input
                        placeholder="Offset Y"
                        value={offset[1]}
                        onChange={(e) =>
                          setOffset([offset[0], Number(e.target.value)])
                        }
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <label className="block mb-2">Z-Index</label>
                    <Input
                      type="number"
                      value={zIndex}
                      onChange={(e) => setZIndex(Number(e.target.value))}
                    />
                  </Col>
                </Row>
              </>
            )}
            <button onClick={downloadImage} className="download-button">
              Download Watermarked Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWatermark;
