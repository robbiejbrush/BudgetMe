import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';

function Settings() {
  return (
    <div>
      <PageHeader
        title= "Settings"
      />
      <h2 className={styles.categoriesHeader}>Add Categories</h2>
      <div className={styles.categoriesDiv}>
        <input 
          className={""}
          value={""}
          onChange={""}
        />
        <input 
          className={""}
          value={""}
          onChange={""}
        />
        <button className={""} onClick={""}>Add</button>
      </div>
    </div>
  )
}

export default Settings;