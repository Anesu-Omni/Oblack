import React from "react";
import { NavLink, Link } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import logoHarare from "../../assets/logo-omnicontact-harare.svg";
import logoBulawayo from "../../assets/logo-omnicontact-bulawayo.svg";
import logoMasvingo from "../../assets/logo-omnicontact-masvingo.svg";
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import useAuth from "../../hooks/useAuth";
import OblackLogo from "../../assets/img/Oblack.png";

const Sidebar = ({ onSubsidiaryChange, currentSubsidiary }) => {
  const { userRole, setUserRole } = useAuth(); // Assume we can switch roles for demo

  return (
    <aside className={styles.sidebar}> {/* Applied glassmorphism effect via class */}
      <div className={styles.logoSection}>
         <img 
    src={OblackLogo}
    alt="Oblack Logo" 
    className={styles.logoImage} 
  />
      </div>
      <nav className={styles.navigation}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blacklist"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <SecurityIcon />
              <span>Blacklist</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              <PeopleIcon />
              <span>Employees</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {userRole === "super_admin" && (
        <div className={styles.subsidiarySwitcher}>
          <h3 className={styles.switcherTitle}>Subsidiaries</h3>
          <ul className={styles.subsidiaryList}>
            {[
              { id: "harare", name: "Omnicontact Harare", logo: logoHarare },
              {
                id: "bulawayo",
                name: "Omnicontact Bulawayo",
                logo: logoBulawayo,
              },
              {
                id: "masvingo",
                name: "Omnicontact Masvingo",
                logo: logoMasvingo,
              },
            ].map((sub) => (
              <li
                key={sub.id}
                className={`${styles.subsidiaryItem} ${
                  currentSubsidiary === sub.id ? styles.activeSubsidiary : ""
                }`}
                onClick={() => onSubsidiaryChange(sub.id)}
              >
                <img
                  src={sub.logo}
                  alt={`${sub.name} Logo`}
                  className={styles.subsidiaryLogo}
                />
                <span>{sub.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Role Switcher for Demo */}
      <div className={styles.roleSwitcher}>
        <h4>Switch Role (Demo)</h4>
        <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>
      </div>
    </aside>
  );
};

export default Sidebar;