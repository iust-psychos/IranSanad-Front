import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "../Components/Sign_up";
import Login from "../Components/Login";
import Forgot_password from "../Components/Forgot_password";
import UserDashboard from "../Components/user-dashboard/components/UserDashboard";
import { userDashboardLoader } from "../Managers/user-dashboard-manager";
import Loading from "../Components/Loading";
import UserProfile from "../Components/UserProfile";
import { ToastContainer } from "react-toastify";
import ContentEdit from "../Components/ContentEdit/ContentEdit";
import EmailVerification from "../Components/EmailVerification";
import ErrorPage from "../Components/error/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Loading />,
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
    path: "/contentedit",
    element: <ContentEdit />,
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
]);

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
