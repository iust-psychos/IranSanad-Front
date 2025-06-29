import React from "react";
import { useNavigate } from "react-router-dom";
import { IconLogo, SvgError } from "@/pages/Error/Icons";
import "@/pages/Error/index.css";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error error-container">
      <div className="error error-content">
        <IconLogo classname="error logo" />
        <h1 className="error error-content title">مشکلی پیش آمده!</h1>
        <p className="error error-content description">
          برگه ها پخش و پلا شدن ولی ما جمعشون می‌کنیم.
        </p>
        <div className="error error-content buttons">
          <button
            onClick={() => window.location.reload()}
            className="error error-content buttons button-reload"
          >
            تلاش مجدد
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="error error-content buttons button-dashboard"
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>
      <SvgError alt="Error illustration" classname="error error-svg" />
    </div>
  );
}
