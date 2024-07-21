import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

const MyNavbar = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  };
  return (
    <div>
      <Navbar className="bg-white shadow-md p-4">
        <Navbar.Brand as={Link} to="/" className="flex items-center">
          <span className="text-blue-500">
            <b>Re</b>
          </span>
          <b>Click</b>
        </Navbar.Brand>
        <Nav className="flex-grow">
          <Nav.Link
            as={Link}
            to="/resize"
            className={`text-gray-700 hover:text-blue-500 ${
              location.pathname === "/resize" ? "text-blue-500 font-bold" : ""
            }`}
          >
            Resize
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/compressor"
            className={`text-gray-700 hover:text-blue-500 ${
              location.pathname === "/compressor"
                ? "text-blue-500 font-bold"
                : ""
            }`}
          >
            Compressor
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/converter"
            className={`text-gray-700 hover:text-blue-500 ${
              location.pathname === "/converter"
                ? "text-blue-500 font-bold"
                : ""
            }`}
          >
            Converter
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/crop"
            className={`text-gray-700 hover:text-blue-500 ${
              location.pathname === "/crop" ? "text-blue-500 font-bold" : ""
            }`}
          >
            Crop
          </Nav.Link>
          <Dropdown
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            show={dropdownOpen}
          >
            <Dropdown.Toggle
              variant="white"
              className="text-gray-700 hover:text-blue-500"
            >
              More Tools
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                as={Link}
                to="/image-editor"
                className="text-gray-700 hover:bg-blue-100"
              >
                Image Editor
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/image-to-base64"
                className="text-gray-700 hover:bg-blue-100"
              >
                Image to Base64
              </Dropdown.Item>
              <Dropdown.Item
                as={Link}
                to="/base64-to-image"
                className="text-gray-700 hover:bg-blue-100"
              >
                Base64 to Image
              </Dropdown.Item>

              <Dropdown.Item
                as={Link}
                to="/watermark"
                className="text-gray-700 hover:bg-blue-100"
              >
                Image Watermark
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
        <div className="flex items-center space-x-4">
          {token ? (
            <div className="flex items-center relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR6OsEdiEgdaXSU8q7MEJwpmM9QJLoa4CLtw&s"
                alt="Profile"
                className="w-12 h-12 rounded-full mr-2"
              />
              <select
                onChange={handleLogout}
                className="w-48 h-10 px-2 py-1 bg-white text-base focus:outline-none text-lg"
              >
                <option value="" disabled selected hidden>
                  {username}
                </option>
                <option
                  value="logout"
                  className="bg-white text-black text-sm cursor-pointer"
                >
                  Logout
                </option>
              </select>
            </div>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/login"
                className="text-blue-500 hover:text-blue-700"
              >
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/signup">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </button>
              </Nav.Link>
            </>
          )}
        </div>
      </Navbar>
    </div>
  );
};
export default MyNavbar;
