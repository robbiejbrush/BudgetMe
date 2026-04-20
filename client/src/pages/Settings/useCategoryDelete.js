import { useState, useCallback } from 'react';
import axios from 'axios';

const useCategoryDelete = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const deleteCategory = useCallback(async (categoryId, options = {}) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await axios.delete(`http://localhost:3001/categories/${categoryId}`, {
        headers: options.headers || {},
        data: options.body || null 
      });

      setSuccess(true);
      return response.data;
    } catch (err) {
      throw err; 
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCategory, loading, success };
};

export default useCategoryDelete;