import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiArrowUpRight, FiArrowDownLeft, FiFolder, FiUser, FiBriefcase, FiClock, FiPackage } from 'react-icons/fi';
import { useLang } from '../context/LangContext';
import '../styles/BottomNavbar.css';

const BottomNavbar = () => {
  const { t } = useLang();
  return (
    <div className="bottom-navbar">
      <NavLink to="/dashboard" end className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <div className="bottom-nav-icon"><FiHome /></div>
        <span className="bottom-nav-label">{t('home')}</span>
      </NavLink>
      <NavLink to="/expenses" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <div className="bottom-nav-icon"><FiArrowUpRight /></div>
        <span className="bottom-nav-label">{t('expenses')}</span>
      </NavLink>
      <NavLink to="/incomes" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <div className="bottom-nav-icon"><FiArrowDownLeft /></div>
        <span className="bottom-nav-label">{t('incomes')}</span>
      </NavLink>
      <NavLink to="/enterprise" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <div className="bottom-nav-icon"><FiBriefcase /></div>
        <span className="bottom-nav-label">{t('enterprise')}</span>
      </NavLink>

      <NavLink to="/categories" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <div className="bottom-nav-icon"><FiFolder /></div>
        <span className="bottom-nav-label">{t('categories')}</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <div className="bottom-nav-icon"><FiUser /></div>
        <span className="bottom-nav-label">{t('profile')}</span>
      </NavLink>
    </div>
  );
};

export default BottomNavbar;
