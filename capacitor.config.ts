import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.facultad.epicureo',
  appName: 'Epicúreo',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    BarcodeScanner: {
      permissions: {
        camera: "CAMERA"
      }
    }
  }
};

export default config;
