import React from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import styles from '../Settings/Settings.module.css';
import { useUserId } from '../../hooks/useAuth';
import { CategoryManager } from '../../components/Settings/CategoryManager/CategoryManager';

function Settings() {
  //Get current userId
  const userId = useUserId();

  return (
    <div>
      <PageHeader title= "Settings"/>
      <CategoryManager userId={userId}/>
    </div>
  )
}

export default Settings;