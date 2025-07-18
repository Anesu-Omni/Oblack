import React from 'react';
import styles from './ConfirmationModal.module.scss';
import GlassCard from '../GlassCard/GlassCard';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <GlassCard className={styles.modalContent}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
          <button className={styles.confirmButton} onClick={onConfirm}>Confirm</button>
        </div>
      </GlassCard>
    </div>
  );
};

export default ConfirmationModal;