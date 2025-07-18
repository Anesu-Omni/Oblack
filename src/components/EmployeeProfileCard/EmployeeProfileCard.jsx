import React from "react";
import GlassCard from "../GlassCard/GlassCard";
import styles from "./EmployeeProfileCard.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import ApartmentIcon from "@mui/icons-material/Apartment";
import EventIcon from "@mui/icons-material/Event";


const EmployeeProfileCard = ({ employee, onBlacklist }) => {
  return (
    <GlassCard className={styles.employeeProfileCard}>
      <div className={styles.header}>
        <PersonIcon className={styles.profileIcon} />
        <h3 className={styles.employeeName}>{employee.name}</h3>
      </div>
      <div className={styles.details}>
        <p>
          <WorkIcon className={styles.icon} /> <strong>ID:</strong>{" "}
          {employee.employeeId}
        </p>
        <p>
          <ApartmentIcon className={styles.icon} /> <strong>Department:</strong>{" "}
          {employee.department}
        </p>
        <p>
          <EventIcon className={styles.icon} /> <strong>Subsidiary:</strong>{" "}
          {employee.subsidiary}
        </p>
        {employee.status && (
          <p>
            <strong>Status:</strong>{" "}
            <span className={styles.status}>{employee.status}</span>
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <button
          className={styles.blacklistButton}
          onClick={() => onBlacklist(employee.id)}
        >
          Blacklist Employee
        </button>
      </div>
    </GlassCard>
  );
};

export default EmployeeProfileCard;
