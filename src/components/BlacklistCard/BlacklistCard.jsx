import React from "react";
import GlassCard from "../GlassCard/GlassCard";
import styles from "./BlacklistCard.module.scss";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const BlacklistCard = ({ entry, onRevoke, onEdit, userRole }) => {
  const getStatusIcon = (reason) => {
    switch (reason.toLowerCase()) {
      case "fraud":
        return <CancelIcon className={styles.iconFraud} />;
      case "misconduct":
        return <WarningIcon className={styles.iconMisconduct} />;
      default:
        return <WarningIcon className={styles.iconDefault} />;
    }
  };

  const statusClass =
    entry.status === "Active" ? styles.statusActive : styles.statusRevoked;
  const glowClass =
    entry.reason.toLowerCase() === "fraud" ||
    entry.reason.toLowerCase() === "gross misconduct"
      ? styles.glowPulse
      : "";

  return (
    <GlassCard className={`${styles.blacklistCard} ${glowClass}`}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>{getStatusIcon(entry.reason)}</div>
        <div className={styles.titleGroup}>
          <h3 className={styles.employeeName}>{entry.employeeName}</h3>
          <span className={styles.employeeId}>ID: {entry.employeeId}</span>
        </div>
      </div>
      <div className={styles.details}>
        <p>
          <strong>Reason:</strong>{" "}
          <span className={styles.reasonText}>{entry.reason}</span>
        </p>
        <p>
          <strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Subsidiary:</strong> {entry.subsidiary}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={statusClass}>{entry.status}</span>
        </p>
      </div>
      {(userRole === "admin" || userRole === "super_admin") && (
        <div className={styles.actions}>
          {entry.status === "Active" && (
            <button
              className={styles.revokeButton}
              onClick={() => onRevoke(entry.id)}
            >
              Revoke
            </button>
          )}
          {userRole === "super_admin" && (
            <button
              className={styles.editButton}
              onClick={() => onEdit(entry.id)}
            >
              Edit
            </button>
          )}
        </div>
      )}
    </GlassCard>
  );
};

export default BlacklistCard;
