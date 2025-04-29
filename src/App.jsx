import { createBrowserRouter, RouterProvider, Navigate, Outlet} from "react-router-dom";
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
import cookieManager from "../Managers/CookieManager"

const isAuthenticated = cookieManager.LoadToken() ? true : false ;

const ProtectedRoute = ({ isAuthenticated, redirectPath = '/login', children }) => {
  console.log(isAuthenticated)
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
        loader: isAuthenticated ? userDashboardLoader : null,
      },
      {
        path: "/document/:doc_uuid",
        element: <ContentEditor />,
        loader: isAuthenticated ? contentEditorLoader : null,
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
  
  return isLoading ? <Loading /> : <Navigate to = '/dashboard'/>;
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
