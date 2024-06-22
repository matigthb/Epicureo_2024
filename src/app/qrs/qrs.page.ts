import { Component, OnDestroy } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-qrs',
  templateUrl: './qrs.page.html',
  styleUrls: ['./qrs.page.scss'],
})
export class QrsPage implements OnDestroy {

  scannedResult: any;

  constructor() { }

  async checkPermission(): Promise<boolean> {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        console.error('Permission not granted');
        return;
      }

      await BarcodeScanner.hideBackground();
      const bodyElement = document.querySelector('body');

      if (bodyElement) {
        bodyElement.classList.add('scanner-active');
      }

      const result = await BarcodeScanner.startScan();
      console.log(result);

      if (result?.hasContent) {
        this.scannedResult = result.content;
        await BarcodeScanner.showBackground();

        if (bodyElement) {
          bodyElement.classList.remove('scanner-active');
        }

        console.log(this.scannedResult);
      }
    } catch (e) {
      console.error('Scan failed:', e);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}