import React from 'react';
import styles from '../NavBar/NavBar.module.css'
import Sidebar from '../SidebarMenu/SidebarMenu';

function NavBar({ pageName, userName }) {
  return (
        <div className={styles.navBarDiv}>
          <div className={styles.sideBarDiv}>
            <Sidebar />
          </div>
          <div>
            <h1 className={styles.headingH1}> { pageName } </h1>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <h1 className={styles.userH1}> { userName } </h1>
          </div>
        </div>
  )
}

export default NavBar;