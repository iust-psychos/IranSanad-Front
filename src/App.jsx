import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "../Components/Sign_up";
import Login from "../Components/Login";
import Forgot_password from "../Components/Forgot_password";
import UserDashboard from "../Components/UserDashboard/user_dashboard";
import "../Styles/App.css";
import { useState , useEffect } from "react";
import Loading from '../Components/Loading';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route path="login" element={<Login />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot_password" element={<Forgot_password />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}
