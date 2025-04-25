import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "../Components/Sign_up";
import Login from "../Components/Login";
import Forgot_password from "../Components/Forgot_password";
import UserDashboard from "../Components/user-dashboard/components/UserDashboard";
import { userDashboardLoader } from "../Managers/user-dashboard-manager";
import Loading from "../Components/Loading";
import UserProfile from "../Components/UserProfile";
import { ToastContainer } from "react-toastify";
import ContentEditor from "../Components/ContentEdit/ContentEditor";
import EmailVerification from "../Components/EmailVerification";
import ErrorPage from "../Components/error/ErrorPage";
import Share from "../Components/Share";
import { useState, useEffect } from "react";
import "../Styles/App.css";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/profile",
    element: <UserProfile />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <UserDashboard />,
    loader: userDashboardLoader,
  },
  {
    path: "/EmailVerification",
    element: <EmailVerification />,
  },
  {
    path: "/document/:doc",
    element: <ContentEditor />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot_password",
    element: <Forgot_password />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/share",
    element: <Share />,
  },
]);

function Root() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <Loading /> : null;
}

export default function App() {
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
      <RouterProvider router={router} />
    </>
  );
}
