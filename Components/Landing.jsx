import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useVisibilityRatio } from "../hooks/useVisibilityRatio";
import "../Styles/Landing.css";
import Service1 from "../src/Images/LandingPage/service1.svg";
import Service2 from "../src/Images/LandingPage/service2.svg";
import Service3 from "../src/Images/LandingPage/service3.svg";
import Service4 from "../src/Images/LandingPage/service4.svg";
import Join from "../src/Images/LandingPage/join.svg";
import { MdEmail, MdPhoneEnabled, MdLocationPin } from "react-icons/md";
import { TbLanguage } from "react-icons/tb";
import CountryIcon from "../src/Images/LandingPage/country.png";
import DocumentIcon from "../src/Images/LandingPage/document.png";
import UserIcon from "../src/Images/LandingPage/user.png";
import AnimatedSVG from "./AnimatedSVG";
import CountUp from "react-countup";
import { toPersianDigit } from "../Scripts/persian-number-converter";
// import { useInView } from "react-intersection-observer";

const Landing = () => {
  const [ref1, ratio1] = useVisibilityRatio();
  const [ref2, ratio2] = useVisibilityRatio();
  const [ref3, ratio3] = useVisibilityRatio();
  const [ref4, ratio4] = useVisibilityRatio();

  const [ref5, ratio5] = useVisibilityRatio();

  const scale1 = 0.9 + ratio1 * 0.1;
  const scale2 = 0.9 + ratio2 * 0.1;
  const scale3 = 0.9 + ratio3 * 0.1;
  const scale4 = 0.9 + ratio4 * 0.1;

  const scale5 = 0.8 + ratio5 * 0.1;

  const nav = useNavigate();

  const handleJoinClick = (e) => {
    e.preventDefault();

    setTimeout(() => {
      nav("/signup");
    }, 500);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const { ref, inView } = useInView({
  //   triggerOnce: false,
  //   threshold: 0.5,
  // });

  return (
    <div className="landing">
      {/* <div className="landing-navbar">
        به دلیل مشکلات فنی نوبار در حال حاضر در دسترس نیست...
      </div> */}
      <div className="landing-hero">
        <div className="landing-hero-text">
          <h1 className="landing-hero-header">
            ایران‌سند؛
            <br className="landing-hero-header-br" /> ساده، هوشمند، قدرتمند
          </h1>
          <p className="landing-hero-body">
            با ایران‌سند، اسناد خود را به صورت آنلاین ایجاد، ویرایش و مدیریت
            کنید! <br /> ✨ همکاری در لحظه، ذخیره‌سازی ابری و ابزارهای پیشرفته
            ...
          </p>
          <button
            className="landing-hero-button"
            type="button"
            onClick={handleJoinClick}
          >
            شروع کنید 🚀
          </button>
        </div>
        <AnimatedSVG
          width={isMobile ? "100%" : "50%"}
          className="landing-hero-image"
        />
      </div>
      <div className="landing-services">
        <h1 className="landing-services-title">خدمات ایران‌سند</h1>
        <div className="landing-services-grid">
          <motion.div
            ref={ref1}
            style={{ scale: scale1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="landing-services-grid-item"
          >
            <img
              className="landing-services-grid-item-img"
              src={Service4}
              alt="ویرایش آنلاین اسناد"
            />
            <h2 className="landing-services-grid-item-title">
              ویرایش آنلاین اسناد
            </h2>
            <div className="landing-services-grid-item-body">
              <p>
                ویرایش همزمان اسناد به صورت آنلاین با قابلیت ذخیره‌سازی خودکار و
                تاریخچه تغییرات
              </p>
            </div>
          </motion.div>
          <motion.div
            ref={ref2}
            style={{ scale: scale2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="landing-services-grid-item"
          >
            <img
              className="landing-services-grid-item-img"
              src={Service1}
              alt="همکاری تیمی"
            />
            <h2 className="landing-services-grid-item-title">همکاری تیمی</h2>
            <div className="landing-services-grid-item-body">
              <p>
                امکان کار تیمی روی اسناد با تعیین سطوح دسترسی مختلف برای هر عضو
                تیم
              </p>
            </div>
          </motion.div>
          <motion.div
            ref={ref3}
            style={{ scale: scale3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="landing-services-grid-item"
          >
            <img
              className="landing-services-grid-item-img"
              src={Service2}
              alt="قالب‌های آماده"
            />
            <h2 className="landing-services-grid-item-title">قالب‌های آماده</h2>
            <div className="landing-services-grid-item-body">
              <p>
                مجموعه‌ای از قالب‌های حرفه‌ای برای انواع سندهای اداری، آموزشی و
                تجاری
              </p>
            </div>
          </motion.div>
          <motion.div
            ref={ref4}
            style={{ scale: scale4 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="landing-services-grid-item"
          >
            <img
              className="landing-services-grid-item-img"
              src={Service3}
              alt="همگام‌سازی لحظه‌ای"
            />
            <h2 className="landing-services-grid-item-title">
              همگام‌سازی لحظه‌ای
            </h2>
            <div className="landing-services-grid-item-body">
              <p>
                دسترسی به اسناد از هر دستگاه و هر مکان با همگام‌سازی خودکار
                تغییرات
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="landing-stats">
        <div
          className="landing-stats-item"
          // ref={ref}
        >
          <h1 className="landing-stats-item-number">
            {/* {inView ? ( */}
            <CountUp
              end={10}
              duration={3}
              separator=","
              formattingFn={toPersianDigit}
            />
            {/* ) : (
              "۱۰۰۰۰۰"
            )} */}
          </h1>
          <p className="landing-stats-item-desc">کاربر فعال</p>
          <img src={UserIcon} className="landing-stats-item-icon" />
        </div>
        <div className="landing-stats-item">
          <h1 className="landing-stats-item-number">
            <CountUp
              end={35}
              duration={3}
              separator=","
              formattingFn={toPersianDigit}
            />
          </h1>
          <p className="landing-stats-item-desc">سند منتشر شده</p>
          <img src={DocumentIcon} className="landing-stats-item-icon" />
        </div>
        <div className="landing-stats-item">
          <h1 className="landing-stats-item-number">
            <CountUp
              end={2}
              duration={1}
              separator=","
              formattingFn={toPersianDigit}
            />
          </h1>
          <p className="landing-stats-item-desc">زبان تحت پوشش</p>
          <TbLanguage className="landing-stats-item-icon" color="#9D27B0ff" />
        </div>
        <div className="landing-stats-item">
          <h1 className="landing-stats-item-number">
            <CountUp
              end={7}
              duration={2}
              separator=","
              formattingFn={toPersianDigit}
            />
          </h1>
          <p className="landing-stats-item-desc">کشور تحت سرویس</p>
          <img src={CountryIcon} className="landing-stats-item-icon" />
        </div>
      </div>
      <div className="landing-join">
        <h1 className="landing-join-title">ثبت نام کنید</h1>
        <p className="landing-join-text">
          هر چه سریع تر ثبت نام کنید و به جمع ایران‌سندی ها بپیوندید.
        </p>
        <div className="landing-join-body">
          <img
            className="landing-join-body-picture"
            src={Join}
            alt="ثبت نام کنید"
          />
          <div className="landing-join-body-content">
            <h2 className="landing-join-body-content-header">
              ایران‌سند در یک نگاه
            </h2>
            <p className="landing-join-body-content-text">
              ایران‌سند، سکویی هوشمند و بومی است که با هدف بهبود تجربه کاربران
              در ایجاد، ویرایش و مدیریت اسناد به صورت آنلاین آغاز به فعالیت کرده
              است! با قابلیت‌های پیشرفته‌ای مانند ویرایش همزمان، ذخیره‌سازی
              ابری، پشتیبانی از فرمت‌های مختلف و ابزارهای هوشمند نوشتاری،
              ایران‌سند تجربه‌ای سریع، امن و کاربرپسند را در اختیار شما قرار
              می‌دهد. ایران سند مناسب تولید و اشتراک گذاری اسناد برای انواع
              کارهای شخصی، تحصیلی، شغلی و حرفه ای است. ایران‌سند همراه همیشگی
              شما در دنیای دیجیتال است!
            </p>
            <button
              className="landing-join-body-content-button"
              type="button"
              onClick={handleJoinClick}
            >
              شروع کنید 🚀
            </button>
          </div>
        </div>
      </div>
      <motion.div
        className="landing-footer"
        ref={ref5}
        style={{ scale: scale5 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="landing-footer-contact">
          <h1 className="landing-footer-title">ارتباط با ما</h1>
          <ul className="landing-footer-list">
            <li className="landing-footer-list-item">
              <MdEmail /> IranSanad@gmail.com
            </li>
            <li className="landing-footer-list-item">
              <MdPhoneEnabled /> ۰۲۱-۷۷۷۷۷۷۷۷
            </li>
            <li className="landing-footer-list-item">
              {" "}
              <MdLocationPin />
              تهران، خیابان رسالت، خیابان هنگام، خیابان دانشگاه علم و صنعت
              ایران، دانشگاه علم و صنعت ایران، دانشکده مهندسی کامپیوتر
            </li>
          </ul>
        </div>
        <div className="landing-footer-navigate">
          <h1 className="landing-footer-title">لینک‌ها مفید</h1>
          <ul className="landing-footer-list">
            <li className="landing-footer-list-item">
              <Link to="/signup">ثبت نام</Link>
            </li>
            <li className="landing-footer-list-item">
              <Link to="/login">ورود</Link>
            </li>
            <li className="landing-footer-list-item">
              <Link to="/dashboard">داشبورد</Link>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
