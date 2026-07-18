import React, { useState } from 'react';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { signup, login, getProfile, loginWithGoogle } from '../api';

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(email, password, fullName);
      console.log("Utilisateur inscrit avec succès !");

      await login(email, password);
      const user = await getProfile();
      console.log("Connecté automatiquement après inscription :", user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      const user = await getProfile();
      console.log("Inscrit/Connecté avec Google :", user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Échec de connexion avec Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-body">
      <div className="signup-container">
        <div className="signup-logo-header">
          <img src="/poketrako-logo.png" alt="Poketrako" className="signup-logo" />
        </div>
        <h2>Create account</h2>
        <div className="signup-subtitle">to start managing your finances with ease</div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input 
              type="text" 
              className="glass-input"
              placeholder="Full Name" 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input 
              type="email" 
              className="glass-input"
              placeholder="Email address" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input 
              type="password" 
              className="glass-input"
              placeholder="Choose password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="signup-error">{error}</p>}
          <button type="submit" className="glass-button" disabled={loading}>
            {loading ? "Creating..." : "Sign up"}
          </button>

          <div className="google-auth-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("La connexion avec Google a échoué.")}
              shape="pill"
              theme="filled_black"
              text="signup_with"
            />
          </div>

          <p className="login-link">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
