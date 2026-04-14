//Formats the month/year heading
export const calculateDateHeading = (month, year) => {
  if (month === "all") return String(year);
  if (month === "") return "";
  const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
  return `${monthName} ${year}`;
};

//Logic for the Progress Bar
export const getProgressMetrics = (spent, budget) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  let barColor = "#4caf50";
  if (percentage >= 100) barColor = "#f44336";
  else if (percentage >= 80) barColor = "#ffeb3b";

  return {
    percentage,
    barColor,
    displayWidth: Math.min(percentage, 100)
  };
};

//Calculate typical spend and below typical spend
export const calculateTypicalMetrics = (rawTransactions, category, month, year, actualSpent) => {
  const history = rawTransactions.filter(t => {
    const isExpense = t.type === 'expense';
    const isMatch = category === "all" || String(t.categoryId) === String(category);
    return isExpense && isMatch;
  });

  let typical = 0;
  if (month === "all") {
    const spendByYear = history.reduce((acc, t) => {
      const y = new Date(t.date).getFullYear();
      acc[y] = (acc[y] || 0) + Math.abs(t.amount || 0);
      return acc;
    }, {});
    const years = Object.values(spendByYear);
    typical = years.length ? years.reduce((a, b) => a + b, 0) / years.length : 0;
  } else {
    const yearlySpend = history
      .filter(t => new Date(t.date).getFullYear() === parseInt(year))
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    typical = yearlySpend / 12;
  }

  const diff = actualSpent === 0 ? 0 : typical - actualSpent;
  return { typical, diff, isAbove: diff >= 0 };
};

//Sum up expense transactions
export const calculateTotalSpent = (transactions) => 
  transactions.reduce((sum, t) => {
    if (t.type === 'income') return sum;
    return sum + Math.abs(t.amount || 0);
  }, 0);

//Determine budget limit with yearly multiplier
export const calculateBudgetLimit = (budgets, categories, categoryId, month) => {
  if (!budgets.length || !categories.length) return 0;
  
  const multiplier = month === "all" ? 12 : 1;

  if (categoryId === "all") {
    return budgets
      .filter(b => categories.find(c => c.categoryId === b.categoryId)?.type === 'expense')
      .reduce((sum, b) => sum + (Number(b.monthlyLimit) || 0), 0) * multiplier;
  }
  
  const entry = budgets.find(b => String(b.categoryId) === String(categoryId));
  return entry ? Number(entry.monthlyLimit) * multiplier : 0;
};