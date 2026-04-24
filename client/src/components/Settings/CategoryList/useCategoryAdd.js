import axios from 'axios';
import { useState } from 'react';

export const useCategoryAdd = (userId, setRawCategories) => {
  const [loading, setLoading] = useState(false);

  const addCategory = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/categories/create', {
        name: values.nameInput,
        type: values.typeSelect,
        userId: userId,
      });

      setRawCategories((prev) => {
        const newList = [...prev, response.data];
        return newList.sort((a, b) => a.name.localeCompare(b.name));
      });

      resetForm();
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Error adding category.");
    } finally {
      setLoading(false);
    }
  };

  return { addCategory, loading };
};