import React, { useState } from "react";

function Base64ToImage() {
  const [fileUrl, setFileUrl] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [isDownloadable, setIsDownloadable] = useState(false);

  const convertToImage = () => {
    if (fileUrl) {
      setImageSrc(fileUrl);
      setIsDownloadable(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileUrl).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100"
      style={{ marginTop: "-60px" }}
    >
      <div className="mt-6 w-full max-w-lg">
        <textarea
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="Paste Base64 URL here"
          className="w-full h-48 p-2 bg-white border border-gray-300 rounded-lg overflow-y-scroll"
        />
        <button
          onClick={convertToImage}
          disabled={!fileUrl}
          className={`mt-4 px-6 py-2 rounded-lg text-white ${
            fileUrl
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Convert to Image
        </button>
      </div>
      {imageSrc && (
        <div className="mt-6 w-full max-w-lg text-center">
          <img
            src={imageSrc}
            alt="Converted"
            className="w-full max-w-xs mx-auto border border-gray-300 rounded-lg"
          />
          <a
            href={imageSrc}
            download="base64_to_image.png"
            className={`mt-4 inline-block px-6 py-2 rounded-lg text-white ${
              isDownloadable
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
}

export default Base64ToImage;
