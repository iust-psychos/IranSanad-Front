import styles from "../Styles/Header.module.css";
import CircleIcon from '@mui/icons-material/Circle';
const Header = () => {
  return <header>
    <div className={styles.profileSummary}>
        <img src="../src/Images/logo.png"/>
        <div className={styles.headerTitle}>
            ایران
            <br/>
            سند
        </div>
    </div>
    <div className={styles.projectReport}>
        <p className={styles.projectReportTitle}>گزارش پروژه هوش</p>
        <span>آخرین ویرایش در 1404/01/13</span>
        <CircleIcon
            sx={{
                color:"#808080",
                fontSize:"12px",
                margin:"0 10px"
            }}  
        />
        <span className={styles.editor}>E.hemmaty</span>
    </div>
    <img src="../src/Images/mockProfile.png" className={styles.userPorfilePic}/>
  </header>;
};

export default Header;
