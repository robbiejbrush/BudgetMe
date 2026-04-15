import { useUserId } from "../../hooks/useAuth";
import { useBudgets } from "./useBudgets";
import { useTransactions } from "../../hooks/useTransactions";
import { useCategories } from "../../hooks/useCategories";
import { useTransactionFilter } from "../../hooks/useTransactionFilter";

export const useBudgetsData = () => {
  const userId = useUserId();

  const { budgets, setBudgets, loading: bLoad } = useBudgets(userId);
  const { rawTransactions, loading: tLoad } = useTransactions(userId);
  const { rawCategories, loading: cLoad } = useCategories(userId);

  const filterState = useTransactionFilter(rawTransactions);

  return {
    data: { 
        budgets: budgets || [], 
        setBudgets,
        rawTransactions: rawTransactions || [], 
        rawCategories: rawCategories || [] 
    },
    filters: {
      selectedMonth: filterState.selectedMonth,
      setSelectedMonth: filterState.setSelectedMonth,
      selectedYear: filterState.selectedYear,
      setSelectedYear: filterState.setSelectedYear,
      selectedCategory: filterState.selectedCategory,
      setSelectedCategory: filterState.setSelectedCategory,
      filteredTransactions: filterState.filteredTransactions || [],
    },
    isLoading: bLoad || tLoad || cLoad
  };
};