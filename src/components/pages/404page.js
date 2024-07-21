import React from "react";
import illustration_404 from "./images/illiustration_404.png";
const PageNotFound = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
      style={{ marginTop: "-60px" }}
    >
      <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={illustration_404}
          alt="404 Illustration"
          className="w-full md:w-1/2 object-cover"
        />
        <div className="p-8 text-center md:text-left">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The image you're trying to click on this page doesn't exist.
          </p>
          <a
            href="/"
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Click to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};
export default PageNotFound;
