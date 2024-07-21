import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpandArrowsAlt,
  faCompress,
  faExchangeAlt,
  faEdit,
  faEraser,
  faTint,
  faCode,
  faImage,
  faCrop,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const iconMap = {
  resize: faExpandArrowsAlt,
  compress: faCompress,
  "exchange-alt": faExchangeAlt,
  edit: faEdit,
  eraser: faEraser,
  tint: faTint,
  code: faCode,
  image: faImage,
  crop: faCrop,
};

function Card({ title, description, icon, link, premium }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg mx-auto relative">
      <Link to={link}>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
            <FontAwesomeIcon icon={iconMap[icon]} />
          </div>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-gray-600">{description}</p>
        {premium && (
          <FontAwesomeIcon
            icon={faCrown}
            className="premium-icon"
            title="Premium"
            style={{
              color: "gold",
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          />
        )}
      </Link>
    </div>
  );
}

export default Card;
