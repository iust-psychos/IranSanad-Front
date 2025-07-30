import "@/styles/Landing.css";
import { motion } from "framer-motion";

const ServiceItem = ({ title, desc, alt, pic, ref, scale }) => {
  return (
    <motion.div
      ref={ref}
      style={{ scale: scale }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="landing-services-grid-item"
    >
      <img className="landing-services-grid-item-img" src={pic} alt={alt} />
      <h2 className="landing-services-grid-item-title">{title}</h2>
      <div className="landing-services-grid-item-body">
        <p>{desc}</p>
      </div>
    </motion.div>
  );
};

export default ServiceItem;
