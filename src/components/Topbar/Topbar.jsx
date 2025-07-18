import React from "react";
import styles from "./Topbar.module.scss";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsIcon from "@mui/icons-material/Settings";


const Topbar = ({ pageTitle, theme, onThemeToggle }) => {
  return (
    <header className={styles.topbar}>
      <h2 className={styles.pageTitle}>{pageTitle}</h2>
      <div className={styles.rightSection}>
        <button onClick={onThemeToggle} className={styles.themeToggle}>
          {theme === "dark" ? <WbSunnyIcon /> : <DarkModeIcon />}
        </button>
        <div className={styles.profileSection}>
          <AccountCircleIcon className={styles.profileIcon} />
          <span className={styles.profileName}>Admin User</span>
          {/* Optionally, a dropdown for settings/logout */}
          <SettingsIcon className={styles.settingsIcon} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
