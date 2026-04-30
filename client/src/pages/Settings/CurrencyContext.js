import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

//Get the saved currency or default to CAD
const savedCurrency = localStorage.getItem('selected_currency') || 'CAD';

export const CurrencyProvider = ({ children, isAuthenticated }) => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(savedCurrency);

  //Save to localStorage whenever selectedCurrency changes
  useEffect(() => {
    localStorage.setItem('selected_currency', selectedCurrency);
  }, [selectedCurrency]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const CACHE_KEY = 'fixer_rates';
    const CACHE_TIME_KEY = 'fixer_timestamp';
    const ONE_DAY = 24 * 60 * 60 * 1000;

    const fetchRates = async () => {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const lastFetch = localStorage.getItem(CACHE_TIME_KEY);
      
      //Check if we have valid, fresh data in localStorage
      if (cachedData && lastFetch && (Date.now() - lastFetch < ONE_DAY)) {
        setRates(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      //If no valid cache, make the API call
      try {
        setLoading(true);

        const response = await axios.get('https://budget-me-rbrush-4ea934ec5562.herokuapp.com/rates');
        if (response.data) {
          const newRates = response.data;
          setRates(newRates);
          localStorage.setItem(CACHE_KEY, JSON.stringify(newRates));
          localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
        }
      } catch (error) {
        console.error("Fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [isAuthenticated]);

  //Derive the symbol automatically from the current currency code
  const getSymbol = (code) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol'
    })
      .formatToParts(0)
      .find(part => part.type === 'currency').value;
  };

  const currencySymbol = getSymbol(selectedCurrency);

  return (
    <CurrencyContext.Provider value={{ 
      rates, 
      selectedCurrency, 
      setSelectedCurrency,
      currencySymbol, 
      convert: (amount) => (rates[selectedCurrency] ? amount * rates[selectedCurrency] : amount), 
      loading 
      }}>
        {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencies = () => useContext(CurrencyContext);