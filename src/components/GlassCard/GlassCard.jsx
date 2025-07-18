import React from 'react';
import styles from './GlassCard.module.scss';

const GlassCard = ({ children, className, ...props }) => {
  return (
    <div className={`${styles.glassCard} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

export default GlassCard;