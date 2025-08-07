import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import SignUp from "@/pages/SignUp/index";
import Login from "@/pages/Login/index";
import Forgot_password from "@/pages/ForgetPassword/index";
import UserDashboard from "@/pages/UserDashboard/index";
import { userDashboardLoader } from "@/managers/UserDashboardManager";
import { ToastContainer } from "react-toastify";
import ContentEditor from "@/pages/ContentEdit/index";
import EmailVerification from "@/Components/EmailVerification";
import ErrorPage from "@/pages/Error/index";
import Share from "@/pages/Share/index";
import UserProfile from "@/pages/UserProfile/index";
import { useState, useEffect } from "react";
import "@/styles/App.css";
import "react-toastify/dist/ReactToastify.css";
import { contentEditorLoader } from "@/managers/ContentEditorManager";
import Landing from "@/pages/Landing/index";
import { isAuthenticated } from "@/utils/AuthManager";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { editorConfig } from "@/pages/ContentEdit/EditorConfig";
import { ThemeContext } from "@/src/ThemeContext";

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
    element: <Landing />,
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

function updateFavicon(mode) {
  const favicon =
    document.getElementById("favicon") || document.createElement("link");
  favicon.id = "favicon";
  favicon.rel = "icon";
  favicon.type = "image";
  favicon.href = mode ? "/logo_dark.png" : "/logo_light.png";
  document.head.appendChild(favicon);
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handleColorSchemeChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleColorSchemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleColorSchemeChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  useEffect(() => {
    updateFavicon(isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
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
    </ThemeContext.Provider>
  );
}
