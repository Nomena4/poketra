import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import '../styles/intro.css';
import { login, getProfile, loginWithGoogle } from '../api';

export default function Intro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      const user = await getProfile();
      console.log("Connecté en tant que :", user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur inconnue");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      await loginWithGoogle(credentialResponse.credential);
      const user = await getProfile();
      console.log("Connecté avec Google en tant que :", user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.message || "Échec de connexion avec Google");
    }
  };

  return (
    <div className='bigbody'>
      <div className="bodyIntro"> 
        <div className="nav">
          <img src="/poketrako-logo.png" alt="Poketrako" className="intro-logo" />
        </div>
        <div className="text">
          <h1>Welcome to Poketrako</h1>
          <p>Poketrako is a web-based financial management platform</p>
          <p>designed to help you monitor your spending and take control of your personal finances with clarity and ease.</p>
        </div>
      </div>

      <div className="Logincontainer">
        <h1 className='login'>Sign in</h1>
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="error">{error}</p>}
          <Link to="/forgot-password" className='forgot-password'>Forgot email or password?</Link>
          <button type="submit" className="glass-button">Sign in</button>
          
          <div className="google-auth-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError("La connexion avec Google a échoué.");
              }}
              shape="pill"
              theme="filled_black"
              text="signin_with"
            />
          </div>

          <p>
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
