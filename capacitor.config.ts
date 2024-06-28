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
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
    },
  }
};

export default config;
