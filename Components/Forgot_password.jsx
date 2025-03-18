import "react";
import styles from "../Styles/Login.module.css";
import React, { useState } from "react";
import { Toggle } from "@base-ui-components/react/toggle";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import Tip_slide from "./Tip_slide";
import { login_slides } from "../Scripts/mock_data";

function Forgot_password() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={styles.Bakcground}>
      <div className={styles.Box}>
        <div className={styles.InnerBox}>
          <div className={styles.detailsContainer}>
            <span className={styles.Title}>ایران سند</span>
            <div className={styles.ImageContainer}>
              <img
                src="../src/Images/b8fce91ad812f4581b7eebab2147575e.png"
                className={styles.image}
              />
            </div>
            <Tip_slide text_list={login_slides} className={styles.InformationContainer} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgot_password;
