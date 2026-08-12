import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import IncomeTable from '../components/IncomeTable';
import NewIncome from '../components/NewIncome';
import '../styles/Dashboard.css';
import { useState } from 'react';
import { useLang } from '../context/LangContext';

const IncomesPage = () => {
  const [refresh, setRefresh] = useState(0);
  const { t } = useLang();
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-scroll">
          <div className="gpay-page-header">
            <h2>{t('myIncomes')}</h2>
            <p>{t('trackIncomes')}</p>
          </div>
          <div className="gpay-page-content-grid">
            <NewIncome onIncomeAdded={() => setRefresh(r => r + 1)} />
            <IncomeTable key={refresh} />
          </div>
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default IncomesPage;
