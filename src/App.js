import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegistrationPage from "./components/pages/SignupPage";
import Compressor from "./components/Tools/Compressor/Compressor";
import Resize from "./components/Tools/Resize/Resize";
import Converter from "./components/Tools/Converter/Converter";
import ImageEditor from "./components/Tools/Image Editor/ImageEditor";
import RemoveBackground from "./components/Tools/Background removal/BackgroundRemoval";
import Watermark from "./components/Tools/Watermark/Watermark";
import ImageToBase64 from "./components/Tools/ImageToBase64/ImageToBase64";
import Base64ToImage from "./components/Tools/Base64ToImage/Base64ToImage";
import CropTool from "./components/Tools/Crop/Crop";
import MyNavbar from "./components/Layouts/MyNavbar";
import Home from "./components/Layouts/Home";
import LoginRedirect from "./components/Redirects/LoginRedirect";
import PageNotFound from "./components/pages/404page";
function App() {
  const token = localStorage.getItem("token");
  console.log("token", token);
  return (
    <div>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/crop" element={<CropTool />} />
        <Route path="/resize" element={<Resize />} />
        <Route path="/compressor" element={<Compressor />} />
        <Route path="/converter" element={<Converter />} />
        <Route path="/image-editor" element={<ImageEditor />} />
        <Route
          path="/remove-bg"
          element={token ? <RemoveBackground /> : <LoginRedirect />}
        />
        <Route path="/watermark" element={<Watermark />} />
        <Route path="/image-to-base64" element={<ImageToBase64 />} />
        <Route path="/base64-to-image" element={<Base64ToImage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
