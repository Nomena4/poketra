import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import '../styles/ForgotPassword.css';
import { resetPassword } from '../api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | invalid
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('token');
    if (!t) {
      setStatus('invalid');
      setMessage('Lien de réinitialisation invalide ou manquant.');
    } else {
      setToken(t);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const res = await resetPassword(token, password);
      setStatus('success');
      setMessage(res.message || 'Mot de passe réinitialisé avec succès !');
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Une erreur est survenue. Le lien a peut-être expiré.');
    }
  };

  if (status === 'invalid') {
    return (
      <div className="fp-body">
        <div className="fp-container glass-panel">
          <img src="/poketrako-logo.png" alt="Poketrako" className="fp-logo" />
          <h2 className="fp-title">Lien invalide</h2>
          <p className="fp-error">{message}</p>
          <Link to="/forgot-password" className="fp-back-link">Demander un nouveau lien</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-body">
      <div className="fp-container glass-panel">
        <div className="fp-logo-wrap">
          <img src="/poketrako-logo.png" alt="Poketrako" className="fp-logo" />
        </div>

        <h2 className="fp-title">Nouveau mot de passe</h2>
        <p className="fp-subtitle">Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>

        {status === 'success' ? (
          <div className="fp-success-box">
            <div className="fp-success-icon">✅</div>
            <p>{message}</p>
            <p className="fp-hint">Vous serez redirigé vers la connexion dans 3 secondes…</p>
            <Link to="/" className="fp-back-link">Se connecter maintenant</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fp-form">
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="glass-input"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={status === 'loading'}
              />
              <button
                type="button"
                className="fp-eye-btn"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                className="glass-input"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </div>

            {status === 'error' && <p className="fp-error">{message}</p>}

            <div className="fp-strength">
              <div className={`fp-strength-bar ${password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : password.length > 0 ? 'weak' : ''}`}></div>
              <span className="fp-strength-label">
                {password.length >= 8 ? 'Fort' : password.length >= 6 ? 'Moyen' : password.length > 0 ? 'Faible' : ''}
              </span>
            </div>

            <button
              type="submit"
              className="glass-button fp-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Réinitialisation…' : 'Réinitialiser le mot de passe'}
            </button>

            <Link to="/" className="fp-back-link">Retour à la connexion</Link>
          </form>
        )}
      </div>
    </div>
  );
}
