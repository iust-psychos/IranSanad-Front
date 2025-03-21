import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sign_up from "../Components/Sign_up";
import Login from "../Components/Login"
import Forgot_password from "../Components/Forgot_password";
import '../Styles/App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Sign_up />} />
          <Route path="forgot_password" element={<Forgot_password />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
