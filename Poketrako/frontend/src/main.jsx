import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { LangProvider } from './context/LangContext.jsx'
import './styles/design-system.css'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'
import { App as CapacitorApp } from '@capacitor/app'

// Initialisation des configurations natives Android/iOS
if (Capacitor.isNativePlatform()) {
  // Ajuster la barre de statut (Status Bar)
  StatusBar.setStyle({ style: Style.Light }).catch(err => {
    console.warn("Impossible de configurer le style de la Status Bar :", err);
  });
  
  StatusBar.setBackgroundColor({ color: '#f8fafc' }).catch(err => {
    console.warn("Impossible de colorer la Status Bar :", err);
  });

  // Intercepter le bouton Retour physique Android
  CapacitorApp.addListener('backButton', () => {
    const path = window.location.pathname;
    if (path === '/' || path === '/signup' || path === '/dashboard') {
      // Quitter l'application sur les écrans principaux
      CapacitorApp.exitApp();
    } else {
      // Retourner à la page précédente dans l'historique web
      window.history.back();
    }
  });
}

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1234567890-dummy.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LangProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </LangProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
