import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiArrowUpRight, FiArrowDownLeft, FiFolder, FiUser, FiLogOut, FiMenu, FiCreditCard, FiClock, FiPackage } from 'react-icons/fi';
import { useLang } from '../context/LangContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { t } = useLang();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className={`sidebar ${open ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        {open && (
          <img
            src="/poketrako-logo.png"
            alt="Poketrako"
            className="sidebar-logo"
            onClick={() => navigate('/dashboard')}
          />
        )}
        <button className="toggle-btn" onClick={() => setOpen(!open)} title="Menu">
          <FiMenu />
        </button>
      </div>
      <nav>
        <NavLink to="/dashboard" end className="fade-in-up stagger-1">
          <span className="sidebar-icon"><FiHome /></span>
          <span className="sidebar-label">{t('dashboard')}</span>
        </NavLink>
        <NavLink to="/expenses" className="fade-in-up stagger-2">
          <span className="sidebar-icon"><FiArrowUpRight /></span>
          <span className="sidebar-label">{t('expenses')}</span>
        </NavLink>
        <NavLink to="/incomes" className="fade-in-up stagger-3">
          <span className="sidebar-icon"><FiArrowDownLeft /></span>
          <span className="sidebar-label">{t('incomes')}</span>
        </NavLink>
        <NavLink to="/caisse" className="fade-in-up stagger-4">
          <span className="sidebar-icon"><FiCreditCard /></span>
          <span className="sidebar-label">{t('caisse')}</span>
        </NavLink>
        <NavLink to="/categories" className="fade-in-up stagger-5">
          <span className="sidebar-icon"><FiFolder /></span>
          <span className="sidebar-label">{t('categories')}</span>
        </NavLink>
        <NavLink to="/profile" className="fade-in-up stagger-5">
          <span className="sidebar-icon"><FiUser /></span>
          <span className="sidebar-label">{t('profile')}</span>
        </NavLink>
        <button className="logout-btn fade-in-up" style={{ animationDelay: '0.6s' }} onClick={handleLogout}>
          <span className="sidebar-icon"><FiLogOut /></span>
          <span className="sidebar-label">{t('logout')}</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
