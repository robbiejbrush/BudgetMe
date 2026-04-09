import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import '../SidebarMenu/SidebarMenu.css';

const Sidebar = () => {
  return (
    <Menu>
      <a className="menu-item" href="/overview">Overview</a>
      <a className="menu-item" href="/transactions">Transactions</a>
      <a className="menu-item" href="/budgets">Budgets</a>
      <a className="menu-item" href="/settings">Settings</a>
    </Menu>
  );
};

export default Sidebar;