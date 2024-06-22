import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-qrs',
  templateUrl: './qrs.page.html',
  styleUrls: ['./qrs.page.scss'],
})
export class QrsPage implements OnDestroy {

  scannedResult: any;

  constructor(private router : Router, private toast : ToastController) { }

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
        let toast = this.toast.create({
          message: "No se cuenta con los permisos.",
          duration: 3000,
          position: 'top',
          icon: 'alert-outline',
          color: 'danger'
        });
        (await toast).present();
        return;
      }

      await BarcodeScanner.hideBackground();
      const bodyElement = document.querySelector('ion-content');

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
    document.querySelector('ion-content')?.classList.remove('scanner-active');
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}