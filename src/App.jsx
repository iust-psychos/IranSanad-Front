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
import Share from "../Components/Share";

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
      {isLoading && location.pathname === "/" ? (
        <Loading />
      ) : (
        <Routes>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<UserDashboard />}
            // loader={userDashboardLoader}
          />
          <Route path="/EmailVerification" element={<EmailVerification />} />
          <Route path="/contentedit" element={<ContentEdit />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot_password" element={<Forgot_password />} />
          <Route path="/share" element={<Share />} />
        </Routes>
      )}
    </>
  );
}
