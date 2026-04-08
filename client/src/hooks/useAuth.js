import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useUserId = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return userId;
};