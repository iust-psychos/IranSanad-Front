import { motion } from "framer-motion";
import "../Styles/Loading.css";
import LogoIcon from "../src/icons/logo.svg";

export default function Loading() {
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
        <img src={LogoIcon} alt="ایران سند" />
      </motion.div>
    </>
  );
}
