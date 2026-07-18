import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import Profile from '../components/Profile';
import '../styles/Dashboard.css';

const ProfilePage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-scroll">
          <Profile />
        </div>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default ProfilePage;
