import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import ExpenseTable from '../components/ExpenseTable';
import NewExpense from '../components/NewExpense';
import '../styles/Dashboard.css';
import { useState } from 'react';
import { useLang } from '../context/LangContext';

const ExpensesPage = () => {
  const token = localStorage.getItem('token');
  const [refresh, setRefresh] = useState(0);
  const { t } = useLang();

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-scroll">
          <div className="gpay-page-header">
            <h2>{t('myExpenses')}</h2>
            <p>{t('manageExpenses')}</p>
          </div>
          <div className="gpay-page-content-grid">
            <NewExpense token={token} onExpenseAdded={() => setRefresh(r => r + 1)} />
            <ExpenseTable key={refresh} />
          </div>
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default ExpensesPage;
