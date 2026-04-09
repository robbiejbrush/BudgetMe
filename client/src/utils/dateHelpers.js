export const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const monthNamesFull = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export const getYearOptions = (back = 5) => {
  const currentYear = new Date().getUTCFullYear();
  const years = [];
  for (let i = 0; i <= back; i++) {
    years.push(currentYear - i);
  }
  return years;
};

export const formatCurrency = (amount) => {
  const value = Number(amount);
  if (isNaN(value)) return "0.00";
  
  return value.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
};