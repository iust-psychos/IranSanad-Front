import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "../Styles/App.css";
import SignUp from "../Components/Sign_up";
import Login from "../Components/Login";
import Forgot_password from "../Components/Forgot_password";
import UserDashboard from "../Components/UserDashboard/user_dashboard";
import Loading from "../Components/Loading";
import UserProfile from "../Components/UserProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentEdit from "../Components/ContentEdit/ContentEdit";
import EmailVerification from "../Components/EmailVerification";

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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {isLoading && location.pathname === "/" ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/EmailVerification" element={<EmailVerification />} />
          <Route path="/contentedit" element={<ContentEdit />} />
          <Route path="/dashboard" element={<UserDashboard />} />
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
