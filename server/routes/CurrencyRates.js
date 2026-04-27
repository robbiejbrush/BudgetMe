const express = require('express');
const router = express.Router();
const axios = require('axios');

//Route to get exchange rates
router.get('/rates', async (req, res) => {
    try {
    const apiKey = process.env.FIXER_API_KEY;

    const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${apiKey}`);
    
    if (response.data.success) {
      const originalRates = response.data.rates;
      const cadRate = originalRates['CAD'];     
      
      //Create a new object with CAD as the base
      const convertedRates = {};
      Object.keys(originalRates).forEach(currency => {
        convertedRates[currency] = originalRates[currency] / cadRate;
      });

      return res.json(convertedRates);
    } else {
      console.log("Fixer reported an error:", response.data.error);
      return res.status(400).json(response.data.error);
    }
  } catch (error) {
    console.log("Axios/Network Error:", error.message);
    res.status(500).send("Network Error");
  }
});

module.exports = router;