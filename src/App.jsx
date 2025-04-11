import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "../Styles/App.css";
import SignUp from "../Components/Sign_up";
import Login from "../Components/Login";
import Forgot_password from "../Components/Forgot_password";
import UserDashboard from "../Components/user-dashboard/UserDashboard";
import { userDashboardLoader } from "../Managers/user-dashboard-manager";
import Loading from "../Components/Loading";

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [location.pathname]);

  return (
    <>
      {isLoading && location.pathname === "/" ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/" element={<div>Home Page Content</div>} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<UserDashboard />}
            // loader={userDashboardLoader}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot_password" element={<Forgot_password />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
