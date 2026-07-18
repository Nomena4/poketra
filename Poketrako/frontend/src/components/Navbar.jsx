import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getProfile } from '../api';
import '../styles/Navbar.css';

const Navbar = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  
  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Impossible de récupérer le profil pour le navbar :", err);
      }
    };
    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          src="/poketrako-logo.png"
          alt="Poketrako"
          className="navbar-logo"
          onClick={() => navigate('/dashboard')}
        />
      </div>
      <div className="navbar-right">
        <span className="navbar-date">
          <FiCalendar className="navbar-date-icon" /> {today}
        </span>
        {profile ? (
          <div className="navbar-profile-avatar" onClick={() => navigate('/profile')} title={profile.fullName}>
            {getInitials(profile.fullName)}
          </div>
        ) : (
          <div className="navbar-profile-avatar-placeholder" onClick={() => navigate('/profile')}>
            <FiUser />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
