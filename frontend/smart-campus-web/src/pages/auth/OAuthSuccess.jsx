import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUserRole } from "../../utils/jwtUtils";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const roleFromParams = searchParams.get("role");

    if (token) {
      localStorage.setItem("token", token);
      if (roleFromParams) {
        localStorage.setItem("role", roleFromParams);
      }
      
      const userRole = roleFromParams || getUserRole();
      if (userRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (userRole === "TECHNICIAN") {
        navigate("/technician/tickets");
      } else {
        navigate("/user/resources");
      }

    } else {
      navigate("/user/resources");
    }
  }, [navigate, searchParams]);

  return <div style={{ padding: "24px" }}>Signing you in...</div>;
};

export default OAuthSuccess;
