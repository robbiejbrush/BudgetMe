import './App.css';
import {BrowserRouter as Router, Route, Routes, useLocation, Navigate} from 'react-router';
import { jwtDecode } from "jwt-decode";
import { useState } from 'react';
import Login from './pages/Login/Login.js'
import Overview from './pages/Overview/Overview.js';
import Transactions from './pages/Transactions/Transactions.js';
import Budgets from './pages/Budgets/Budgets.js';
import Settings from './pages/Settings.js';
import NavBar from './components/NavBar/NavBar.js';
import AddTransactions from './pages/AddEditTransactions/AddTransactions.js';
import EditTransactions from './pages/AddEditTransactions/EditTransactions.js';
import './styles/globals.css';

//Get access token from cookies method
const getAccessToken = () => document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

function Navigation() {
  const location = useLocation();

  //Get signed in users details from accessToken for displaying
  const token = getAccessToken();
  let userName = "Unspecified";
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userName = decoded.name;
    } catch (e) { 
      console.error("Invalid token");
    }
  }

  //Specify app bar header and whether to show app bar or not
  let pageName = "Unspecified";

  if (location.pathname === "/login") {
    return null;
  } else {
    pageName = "BudgetMe"
  }
  
  return (
    <NavBar pageName={ pageName } userName={ userName }/>
  );
}

function App() {
  const [token, setToken] = useState(getAccessToken());
  const isAuthenticated = !!token;
  
  return (
    <div className="App">
      <Router>
        <Navigation setToken={ setToken }/>
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Navigate to="/overview" replace /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login setToken={setToken} /> : <Navigate to="/overview" replace />} 
            />
            <Route 
              path="/overview" 
              element={isAuthenticated ? <Overview /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/transactions" 
              element={isAuthenticated ? <Transactions /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/budgets" 
              element={isAuthenticated ? <Budgets /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/settings" 
              element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/addTransactions" 
              element={isAuthenticated ? <AddTransactions /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/editTransaction/:transactionId" 
              element={isAuthenticated ? <EditTransactions /> : <Navigate to="/login" replace />} 
            />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
