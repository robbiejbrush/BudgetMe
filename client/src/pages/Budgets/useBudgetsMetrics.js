import { useMemo } from "react";
import * as helpers from '../../utils/budgetsHelpers';
import { useCurrencies } from "../Settings/CurrencyContext";

export const useBudgetsMetrics = (data, filters) => {
    const { convert } = useCurrencies();

    const { budgets, rawTransactions, rawCategories } = data;
    const { selectedMonth, selectedYear, selectedCategory, filteredTransactions } = filters;

    //Category filtering
    const expenseCategories = useMemo(() => 
        rawCategories.filter(cat => cat.type === 'expense'), [rawCategories]
    );
    const activeCategory = useMemo(() => 
        rawCategories.find(c => c.categoryId === selectedCategory), [rawCategories, selectedCategory]
    );

    //Core math
    const totalSpent = useMemo(() => 
        helpers.calculateTotalSpent(filteredTransactions), [filteredTransactions]
    );
    const currentBudget = useMemo(() => 
        helpers.calculateBudgetLimit(budgets, rawCategories, selectedCategory, selectedMonth),
        [budgets, rawCategories, selectedCategory, selectedMonth]
    );

    //UI values
    const progress = useMemo(() => 
        helpers.getProgressMetrics(totalSpent, currentBudget), [totalSpent, currentBudget]
    );
    const dateHeading = useMemo(() => 
        helpers.calculateDateHeading(selectedMonth, selectedYear), [selectedMonth, selectedYear]
    );
    const typicalSpendMetrics = useMemo(() => 
        helpers.calculateTypicalMetrics(rawTransactions, selectedCategory, selectedMonth, selectedYear, totalSpent),
        [rawTransactions, selectedCategory, selectedMonth, selectedYear, totalSpent]
    );

    //Boolean flags for no data display
    const hasNoTransactions = filteredTransactions.length === 0;
    const hasNoBudget = selectedCategory !== "all" && currentBudget === 0;

    return {
        expenseCategories,
        activeCategory,
        totalSpent: convert(totalSpent),
        currentBudget: convert(currentBudget),
        dateHeading,
        typicalSpendMetrics: {
            typical: convert(typicalSpendMetrics.typical),
            diff: convert(typicalSpendMetrics.diff),
            isAbove: typicalSpendMetrics.isAbove
        },
        hasNoTransactions,
        hasNoBudget,
        ...progress
    };
}