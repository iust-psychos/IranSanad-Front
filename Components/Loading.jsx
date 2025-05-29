import { motion } from "framer-motion";
import "@/styles/Loading.css";
import { useTheme } from "@/src/ThemeContext";
import logo_dark from "/images/logo_dark.png";
import logo_light from "/images/logo_light.png";

export default function Loading() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <motion.div className="loading-container">
        <motion.div
          className="loading-circle"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [-50, -50, 0, -50],
            y: [-50, 0, 0, -50],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <motion.div
          className="loading-circle"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
            x: [-50, -50, 0, -50],
            y: [50, 0, 0, 50],
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <motion.div
          className="loading-circle"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.2, 0.3],
            x: [50, 0, 0, 50],
            y: [0, 0, 0, 0],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <motion.h1
          className="loading-text"
          animate={{ opacity: [0.5, 1, 0.5], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          خوش آمدید
        </motion.h1>
      </motion.div>
      <motion.div className="loading-banner">
        <img
          src={isDarkMode ? logo_dark : logo_light}
          alt="ایران سند"
          className="loading-logo"
        />
      </motion.div>
    </>
  );
}
