import '../Overview/Overview.css'
import ExpensesPieChart from '../../components/Overview/ExpensesPieChart';
import MonthlyBarChart from '../../components/Overview/MonthlyBarChart';
import FilterBar from '../../components/FilterBar/FilterBar';
import SummaryStats from '../../components/Overview/SummaryStats';
import CategoriesBreakdown from '../../components/Overview/CategoriesBreakdown';
import { useOverviewData } from '../../hooks/useOverviewData';
import { useUserId } from '../../hooks/useAuth';

function Overview() {
  const userId = useUserId();
  
  const {
    displayCategories,
    totalIncome,
    totalExpenses,
    net,
    monthlyExpenses,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    categoriesLoading,
    transactionsLoading
  } = useOverviewData(userId);

  if (categoriesLoading || transactionsLoading) return <div className= "LoadingText"><h2>Loading Data...</h2></div>;

  return (
    <div>
      <div className= "HeaderDiv">
        <FilterBar
          selectedMonth={selectedMonth} 
          setSelectedMonth={setSelectedMonth} 
          selectedYear={selectedYear} 
          setSelectedYear={setSelectedYear}
        />
        <h1 className= "OverviewHeading">Overview</h1>
        <div className= "EmptyDiv"/>
      </div>
      {displayCategories.length === 0 ? (
        <div className="NoDataMessage">
          <h2>There are no transactions for this time.</h2>
        </div>
      ) : (
        <div>
        <SummaryStats totalIncome={ totalIncome } totalExpenses={ totalExpenses } net={ net }/>
        <div className= "GraphsDiv">
          <ExpensesPieChart data= { displayCategories }/>
          <MonthlyBarChart data= { monthlyExpenses }/>
        </div>
        <CategoriesBreakdown categories={ displayCategories }/>
      </div>
      )
      }
    </div>
  )
}

export default Overview;