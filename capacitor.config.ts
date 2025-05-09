
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "app.lovable.b17f4f16faf540d1b09e6ae4fa41b7cc",
  appName: "MyCiné",
  webDir: "dist",
  server: {
    url: "https://b17f4f16-faf5-40d1-b09e-6ae4fa41b7cc.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0A1929",
      showSpinner: true,
      spinnerColor: "#E50914",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
