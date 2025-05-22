import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
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
import { contentEditorLoader } from "../Managers/content-editor-manager";
import cookieManager from "../Managers/CookieManager";
import Landing from "../Components/Landing";
import { isAuthenticated } from "../Utilities/Auth/AuthManager";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { editorConfig } from "../Components/ContentEdit/editor-config";

const ProtectedRoute = ({
  isAuthenticated,
  redirectPath = "/login",
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login />,
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
    path: "/EmailVerification",
    element: <EmailVerification />,
  },
  {
    path: "/landing",
    element: <Landing />,
  },
  // Protected routes group
  {
    element: <ProtectedRoute isAuthenticated={isAuthenticated} />,
    children: [
      {
        path: "/profile",
        element: <UserProfile />,
      },
      {
        path: "/dashboard",
        element: <UserDashboard />,
        loader: userDashboardLoader,
      },
      {
        path: "/document/:doc_uuid",
        element: (
          <LexicalComposer initialConfig={editorConfig}>
            <ContentEditor />
          </LexicalComposer>
        ),
        loader: contentEditorLoader,
      },
      {
        path: "/share",
        element: <Share />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
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

  return isLoading ? <Loading /> : <Navigate to="/landing" />;
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) setIsDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  // const toggleTheme = () => {
  //   setIsDarkMode(!isDarkMode);
  // };

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
