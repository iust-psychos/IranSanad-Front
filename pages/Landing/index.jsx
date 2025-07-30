import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useVisibilityRatio } from "@/hooks/useVisibilityRatio";
import CountUp from "react-countup";
import { toPersianDigit } from "@/utils/PersianNumberConverter";
import "@/styles/Landing.css";
import {
  Service1,
  Service2,
  Service3,
  Service4,
  LandingHero,
  Join,
} from "../../Constants/ImageConstants";
import {
  MdEmail,
  MdPhoneEnabled,
  MdLocationPin,
  TbLanguage,
  FaLocationDot,
  HiDocumentDuplicate,
  FaUser,
} from "@/managers/LandingManager.js";
import Navbar from "../../Components/Navbar";
import ServiceItem from "./ServiceItem";

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

  return (
    <div className="landing">
      <Navbar />
      <div className="landing-hero">
        <div className="landing-hero-text">
          <h1 className="landing-hero-header">
            ایران‌سند؛
            <br className="landing-hero-header-br" /> ساده، هوشمند، قدرتمند
          </h1>
          <p className="landing-hero-body">
            با ایران‌سند، اسناد خود را به صورت برخط ایجاد، ویرایش و مدیریت کنید!{" "}
            <br /> ✨ همکاری در لحظه، ذخیره‌سازی ابری و ابزارهای پیشرفته ...
          </p>
          <button
            className="landing-hero-button"
            type="button"
            onClick={handleJoinClick}
          >
            شروع کنید 🚀
          </button>
        </div>
        <div
          className="landing-hero-image"
          style={{ width: isMobile ? "100%" : "50%" }}
        >
          <img src={LandingHero} alt="ایران سند\nساده، هوشمند و قدرتمند" />
        </div>
      </div>
      <div className="landing-services">
        <h1 className="landing-services-title">خدمات ایران‌سند</h1>
        <div className="landing-services-grid">
          <ServiceItem
            ref={ref1}
            scale={scale1}
            pic={Service4}
            title="ویرایش آنلاین اسناد"
            alt="ویرایش برخط اسناد"
            desc="ویرایش همزمان اسناد به صورت برخط با قابلیت ذخیره‌سازی خودکار و
                تاریخچه تغییرات"
          />
          <ServiceItem
            ref={ref2}
            scale={scale2}
            pic={Service1}
            title="همکاری تیمی"
            alt="همکاری تیمی"
            desc="امکان کار تیمی روی اسناد با تعیین سطح دسترسی مختلف برای هر عضو
                تیم"
          />
          <ServiceItem
            ref={ref3}
            scale={scale3}
            pic={Service2}
            title="قالب‌های آماده"
            alt="قالب‌های آماده"
            desc="مجموعه‌ای از قالب‌های حرفه‌ای برای انواع سندهای اداری، آموزشی و
                تجاری"
          />
          <ServiceItem
            ref={ref4}
            scale={scale4}
            pic={Service3}
            title="همگام‌سازی لحظه‌ای"
            alt="همگام‌سازی لحظه‌ای"
            desc="دسترسی به اسناد از هر دستگاه و هر مکان با همگام‌سازی خودکار
                تغییرات"
          />
        </div>
      </div>
      <div className="landing-stats">
        <div className="landing-stats-item">
          <h1 className="landing-stats-item-number">
            <CountUp
              end={10}
              duration={3}
              separator=","
              formattingFn={toPersianDigit}
            />
          </h1>
          <p className="landing-stats-item-desc">کاربر فعال</p>
          <FaUser className="landing-stats-item-icon" />
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
          <HiDocumentDuplicate className="landing-stats-item-icon" />
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
          <TbLanguage className="landing-stats-item-icon" />
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
          <p className="landing-stats-item-desc">کشور تحت پوشش</p>
          <FaLocationDot className="landing-stats-item-icon" />
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
              تهران، خیابان رسالت، خیابان هنگام، دانشگاه علم و صنعت ایران،
              دانشکده مهندسی کامپیوتر
            </li>
          </ul>
        </div>
        <div className="landing-footer-navigate">
          <h1 className="landing-footer-title">لینک‌های مفید</h1>
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
