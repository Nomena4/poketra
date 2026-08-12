import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import Categories from '../components/Categories';
import '../styles/Dashboard.css';

const CategoriesPage = () => {
  const token = localStorage.getItem('token');
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-scroll">
          <Categories token={token} />
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default CategoriesPage;
