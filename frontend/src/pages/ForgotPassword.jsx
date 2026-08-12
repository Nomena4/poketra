import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import '../styles/ForgotPassword.css';
import { forgotPassword } from '../api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await forgotPassword(email);
      setStatus('success');
      setMessage(res.message || 'Si cet email est enregistré, un lien de réinitialisation a été envoyé.');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="fp-body">
      <div className="fp-container glass-panel">
        <div className="fp-logo-wrap">
          <img src="/poketrako-logo.png" alt="Poketrako" className="fp-logo" />
        </div>

        <h2 className="fp-title">Mot de passe oublié</h2>
        <p className="fp-subtitle">
          Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        {status === 'success' ? (
          <div className="fp-success-box">
            <div className="fp-success-icon">✉️</div>
            <p>{message}</p>
            <p className="fp-hint">Vérifiez votre boîte de réception et vos spams.</p>
            <Link to="/" className="fp-back-link">
              <FiArrowLeft /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fp-form">
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                className="glass-input"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
              />
            </div>

            {status === 'error' && <p className="fp-error">{message}</p>}

            <button
              type="submit"
              className="glass-button fp-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Envoi en cours…' : 'Envoyer le lien de réinitialisation'}
            </button>

            <Link to="/" className="fp-back-link">
              <FiArrowLeft /> Retour à la connexion
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
