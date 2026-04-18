import React from "react";
import styles from '../PageHeader/PageHeader.module.css';

export const PageHeader = ({ title, children, actions }) => {
  return (
    <div className={styles.headerDiv}>
      <div className={styles.headerLeft}>{children}</div>
      
      <h1 className={styles.headerCenter}>{title}</h1>

      <div className={styles.headerRight}>
        {actions || <div className="EmptyDiv" />}
      </div>
    </div>
  );
};