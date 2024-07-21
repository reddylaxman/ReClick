import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "Please Login",
      text: "You need to be logged in to use the Remove Background tool.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      } else {
        navigate("/");
      }
    });
  }, [navigate]);

  return null;
};

export default LoginRedirect;
