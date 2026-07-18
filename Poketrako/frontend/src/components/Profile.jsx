import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCpu, FiTarget, FiSettings, FiLogOut, FiGlobe, FiCamera, FiUpload } from 'react-icons/fi';
import { getProfile, updateBudget, isOfflineMode, setOfflineMode, updateAvatar, getAvatarUrl } from '../api';
import { useLang } from '../context/LangContext';
import '../styles/Profile.css';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [budgetVal, setBudgetVal] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { lang, setLanguage, t } = useLang();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);
      setBudgetVal(data.budget || '0');
      if (data.avatar) setAvatarPreview(getAvatarUrl(data.avatar));
    } catch (err) {
      console.error('Erreur profil:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    setIsOffline(isOfflineMode());
  }, []);

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateBudget(parseFloat(budgetVal) || 0);
      console.log('✅ Budget mis à jour avec succès !');
      fetchUserProfile();
    } catch (err) {
      console.error('Erreur de mise à jour du budget:', err);
      console.log('❌ Impossible de mettre à jour le budget');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleOffline = (e) => {
    const val = e.target.checked;
    setOfflineMode(val);
    setIsOffline(val);
    console.log('🔄 Mode de connexion changé. L\'application va se recharger.');
    window.location.reload();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Preview instantly
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
    // Upload
    setAvatarUploading(true);
    setAvatarSuccess(false);
    try {
      await updateAvatar(file);
      setAvatarSuccess(true);
      setTimeout(() => setAvatarSuccess(false), 2500);
    } catch (err) {
      console.error('Avatar upload error:', err);
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) return <div className="profile-loading">{t('profileLoading')}</div>;
  if (!profile) return <div className="profile-error">{t('profileError')}</div>;

  const offlineColor  = isOffline ? '#ef4444' : '#10b981';
  const thumbOffset   = isOffline ? '22px' : '4px';

  return (
    <div className="profile-page">

      {/* ── Hero ── */}
      <div className="profile-hero">
        <div
          className="profile-avatar-wrapper"
          onClick={() => fileInputRef.current?.click()}
          title="Changer la photo"
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-circle">
              {getInitials(profile.fullName)}
            </div>
          )}
          <div className="profile-avatar-overlay">
            {avatarUploading ? (
              <span className="profile-avatar-spinner" />
            ) : (
              <FiCamera className="profile-avatar-overlay-icon" />
            )}
          </div>
          {avatarSuccess && <div className="profile-avatar-success">✓</div>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
        <div className="profile-name">{profile.fullName || 'Membre Poketrako'}</div>
        <div className="profile-email">{profile.email}</div>
        <div className="profile-avatar-hint">
          <FiUpload style={{ fontSize: '0.75rem' }} /> Cliquer pour changer la photo
        </div>
      </div>

      {/* ── Informations ── */}
      <div className="profile-card">
        <div className="profile-card-title">
          <FiUser className="profile-card-icon" /> {t('accountInfo')}
        </div>

        <div className="profile-info-row">
          <span className="profile-info-label">{t('fullName')}</span>
          <span className="profile-info-value">{profile.fullName || t('fullName')}</span>
        </div>

        <div className="profile-info-row">
          <span className="profile-info-label">{t('email')}</span>
          <span className="profile-info-value">{profile.email}</span>
        </div>

        <div className="profile-info-row">
          <span className="profile-info-label">{t('uniqueId')}</span>
          <span className="profile-info-value">#{profile.id}</span>
        </div>
      </div>

      {/* ── Budget ── */}
      <div className="profile-card">
        <div className="profile-card-title">
          <FiTarget className="profile-card-icon" /> {t('monthlyBudget')}
        </div>

        <form onSubmit={handleUpdateBudget}>
          <div className="profile-budget-row">
            <input
              className="profile-budget-input"
              type="number"
              placeholder={t('budgetPlaceholder')}
              value={budgetVal}
              onChange={e => setBudgetVal(e.target.value)}
              required
              min="0"
            />
            <button
              className="profile-budget-btn"
              type="submit"
              disabled={updating}
            >
              {updating ? '...' : t('save')}
            </button>
          </div>
        </form>
      </div>

      {/* ── Mode hors-ligne ── */}
      <div className="profile-card">
        <div className="profile-card-title">
          <FiSettings className="profile-card-icon" /> {t('appMode')}
        </div>

        <div className="profile-offline-row">
          <div className="profile-offline-text">
            <div className="profile-offline-label">
              {t('offlineMode')}
              <span
                className="profile-status-dot"
                style={{ background: offlineColor }}
              />
            </div>
            <div className="profile-offline-desc">
              {isOffline ? t('offlineActive') : t('offlineInactive')}
            </div>
          </div>

          <label className="profile-toggle">
            <input
              type="checkbox"
              checked={isOffline}
              onChange={handleToggleOffline}
            />
            <span
              className="profile-toggle-track"
              style={{ backgroundColor: offlineColor }}
            >
              <span
                className="profile-toggle-thumb"
                style={{ transform: `translateX(${thumbOffset})` }}
              />
            </span>
          </label>
        </div>

        <p className="profile-offline-hint">
          {t('offlineHint')}
        </p>
      </div>

      {/* ── Langue ── */}
      <div className="profile-card">
        <div className="profile-card-title">
          <FiGlobe className="profile-card-icon" /> {t('language')}
        </div>
        <div className="profile-lang-row">
          <button
            className={`profile-lang-btn ${lang === 'fr' ? 'active' : ''}`}
            onClick={() => setLanguage('fr')}
            type="button"
          >
            🇫🇷 {t('french')}
          </button>
          <button
            className={`profile-lang-btn ${lang === 'mg' ? 'active' : ''}`}
            onClick={() => setLanguage('mg')}
            type="button"
          >
            🇲🇬 {t('malagasy')}
          </button>
        </div>
      </div>

      {/* ── Actions / Déconnexion ── */}
      <div className="profile-card profile-logout-card">
        <button
          className="profile-logout-btn"
          onClick={handleLogout}
          type="button"
        >
          <FiLogOut className="profile-logout-icon" /> {t('disconnect')}
        </button>
      </div>

    </div>
  );
};

export default Profile;
