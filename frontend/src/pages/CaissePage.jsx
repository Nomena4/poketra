import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import NewCaisseTransaction from '../components/NewCaisseTransaction';
import CaisseTable from '../components/CaisseTable';
import '../styles/Dashboard.css';

const CaissePage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-scroll">
          <div className="gpay-page-header">
            <h2>Caisse</h2>
            <p>Gérez vos transactions mobile money</p>
          </div>
          <div className="gpay-page-content-grid">
            <NewCaisseTransaction />
            <CaisseTable />
          </div>
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default CaissePage;
