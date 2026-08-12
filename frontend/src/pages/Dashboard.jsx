import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import '../styles/Dashboard.css';
import SummaryCards from '../components/SummaryCards';
import CashFlowChart from '../components/CashFlowChart';
import ExpenseTable from '../components/ExpenseTable';
import IncomeTable from '../components/IncomeTable';

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-scroll fade-in-up stagger-1">
          <h2 className="dashboard-header text-gradient">Mon tableau de bord</h2>
          <div className="fade-in-up stagger-2">
            <SummaryCards />
          </div>
          <div className="fade-in-up stagger-3">
            <CashFlowChart />
          </div>
          <div className="tables-section fade-in-up stagger-4">
            <ExpenseTable />
            <IncomeTable />
          </div>
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
}
export default Dashboard;