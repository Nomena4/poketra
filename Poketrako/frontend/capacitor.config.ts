import type { CapacitorConfig } from '@capacitor/cli';
import path from 'path';

const config: CapacitorConfig = {
  appId: 'com.exemple.app',
  appName: 'Poketrako',
  webDir: 'dist',
  android: {
    path: '../android'
  },
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#f8fafc'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  }
};

export default config;
