import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

function ImageToBase64() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setFileName(acceptedFiles[0].name);
    },
  });

  const convertToFileUrl = () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileUrl).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 "
      style={{ marginTop: "-80px" }}
    >
      <div
        {...getRootProps({ className: "dropzone" })}
        className="w-full max-w-lg p-6 bg-white border-2 border-dashed border-blue-500 rounded-lg cursor-pointer text-center"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag 'n' drop some files here, or click to select files
        </p>
        {fileName && <p className="mt-2 text-sm text-gray-700">{fileName}</p>}
      </div>
      <button
        onClick={convertToFileUrl}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Convert
      </button>
      <div className="mt-6 w-full max-w-lg">
        <textarea
          value={fileUrl}
          readOnly
          className="w-full h-48 p-2 bg-white border border-gray-300 rounded-lg overflow-y-scroll"
        />
        <button
          onClick={copyToClipboard}
          disabled={!fileUrl}
          className={`mt-4 px-6 py-2 rounded-lg text-white ${
            fileUrl
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default ImageToBase64;
