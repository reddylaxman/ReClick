import React, { useState } from "react";

export default function RemoveBackground() {
  const [image, setImage] = useState(null);
  const [bgRemove, setBgRemove] = useState(null);

  const handleRemoveBackground = async () => {
    const apiKey = "cPEMRw4sGGwqG9qKmeNoDnwX";
    const apiUrl = "https://api.remove.bg/v1.0/removebg";

    const formData = new FormData();
    formData.append("image_file", image, image.name);
    formData.append("size", "auto");

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body: formData,
      });

      const data = await res.blob();

      const reader = new FileReader();
      reader.onloadend = () => setBgRemove(reader.result);
      reader.readAsDataURL(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setImage(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center mt-1"
      style={{ marginTop: "-30px" }}
    >
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex flex-col items-center">
          {/* Drag and Drop Zone */}
          <div
            className="border-4 border-dashed border-gray-400 rounded-lg p-10 mb-5 w-full flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            <p className="text-gray-700 mb-2">Drag and drop an image here</p>
            <p className="text-gray-500 mb-2">or</p>
            <button
              type="button"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
              className="text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Select Image
            </button>
          </div>

          {/* Remove Background Button */}
          <div className="flex justify-center mb-5 w-full">
            <button
              type="button"
              onClick={handleRemoveBackground}
              className="text-white bg-green-500 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
            >
              Remove Background
            </button>
          </div>

          {/* Output */}
          <div className="flex gap-4 mb-5 w-full">
            {image && (
              <div className="border border-gray-300 rounded-lg flex justify-center p-2 w-full lg:w-80">
                <img
                  className="w-full h-auto"
                  src={URL.createObjectURL(image)}
                  alt="Selected"
                />
              </div>
            )}

            {bgRemove && (
              <div className="border border-gray-300 rounded-lg flex justify-center p-2 w-full lg:w-80">
                <img
                  className="w-full h-auto"
                  src={bgRemove}
                  alt="Background Removed"
                />
              </div>
            )}
          </div>

          {bgRemove && (
            <div className="flex justify-center w-full">
              <a
                className="w-full"
                href={bgRemove}
                download={"background_removed.png"}
              >
                <button className="bg-blue-500 text-white w-full py-2 px-3 rounded-lg">
                  Download
                </button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
