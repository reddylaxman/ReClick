import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import Card from "./Card";
import Footer from "./Footer";

const tools = [
  {
    title: "Crop IMAGE",
    description: "Crop your images to remove unwanted areas.",
    icon: "crop",
    link: "/crop",
  },
  {
    title: "Resize IMAGE",
    description:
      "Resize your images to the desired dimensions or by percentage.",
    icon: "resize",
    link: "/resize",
  },
  {
    title: "Compress IMAGE",
    description:
      "Compress your images to reduce file size while maintaining quality.",
    icon: "compress",
    link: "/compressor",
  },
  {
    title: "Convert IMAGE",
    description: "Convert your images to different formats.",
    icon: "exchange-alt",
    link: "/converter",
  },
  {
    title: "Image Editor",
    description: "Edit your images with various tools and effects.",
    icon: "edit",
    link: "/image-editor",
  },
  {
    title: "Remove Background",
    description: "Automatically remove the background from your images.",
    icon: "eraser",
    link: "/remove-bg",
    premium: true, // Added premium flag
  },
  {
    title: "Watermark IMAGE",
    description: "Add a watermark to your images for protection.",
    icon: "tint",
    link: "/watermark",
  },
  {
    title: "Image to Base64",
    description: "Convert your images to Base64 format.",
    icon: "code",
    link: "/image-to-base64",
  },
  {
    title: "Base64 to Image",
    description: "Convert Base64 strings back to images.",
    icon: "image",
    link: "/base64-to-image",
  },
];

const Home = () => {
  const typedElement = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    const options = {
      strings: token
        ? [
            `Welcome ${username}!<br>You can edit your image by <span class="highlight">clicking it</span>`,
            `Welcome ${username}!<br>You can edit your image by <span class="highlight">re-clicking it</span>`,
          ]
        : [
            'You can edit your image by <span class="highlight">clicking it</span>',
            'You can edit your image by <span class="highlight">re-clicking it</span>',
          ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    };

    const typed = new Typed(typedElement.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="bg-blue-grey-300 text-gray-800 w-100">
      <main className="max-w-screen-lg mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8">
          <span ref={typedElement}></span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={index}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              link={tool.link}
              premium={tool.premium}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
