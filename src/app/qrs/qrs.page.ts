import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-qrs',
  templateUrl: './qrs.page.html',
  styleUrls: ['./qrs.page.scss'],
})
export class QrsPage implements OnDestroy, OnInit {
  scannedResult: any;
  isScanning = false;
  listaDeEspera : boolean = false;
  uid : string = "";
  waitingListSubscription: Subscription | undefined;
  mesa : number = -1;
  
  constructor(private router: Router, private auth: AuthService, private notification: NotificationService, private toast: ToastController, private data: DataService) { 
    
  }

  async ngOnInit(): Promise<void> {
    this.uid = await this.auth.getUserUid() || "";
    this.subscribeToWaitingList(this.uid);
  }

  subscribeToWaitingList(uid: string) {
    this.waitingListSubscription = this.data.getListaDeEspera().subscribe(lista => {
      const userInList = lista.find((item: { id: string; assignedTable: string | null; fecha: string; }) => item.id === uid);

      if (userInList) {
        if (userInList.assignedTable) {
          this.mesa = userInList.assignedTable
          //this.data.mandarToast(`You have been assigned to table ${userInList.assignedTable}`, "success");
        } else {
          this.mesa = 0;
          //this.data.mandarToast('You are in the waiting list, waiting for table assignment', "info");
        }
      } else {
        this.startScan();
        this.isScanning = true;
      }
    });
  }

  async checkPermission(): Promise<boolean> {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        await BarcodeScanner.hideBackground();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        const toast = await this.toast.create({
          message: 'No se cuenta con los permisos.',
          duration: 3000,
          position: 'top',
          icon: 'alert-outline',
          color: 'danger',
        });
        await toast.present();
        return;
      }

      await BarcodeScanner.hideBackground();
      this.isScanning = true;

      do{

        const result = await BarcodeScanner.startScan();
        if (result?.hasContent) {
          if(result.content == "epicureo-2024-ingreso-local")
            {
              this.isScanning = false;
              await BarcodeScanner.showBackground();
              this.data.ingresarCliente(this.uid);
              this.notification.sendRoleNotification(["maitre"],"Se requiere asignación!", "Un cliente ingresó a la lista de espera por una mesa.");
            }
            else
            {
              this.data.mandarToast("El QR para ingresar es el que se encuentra en la puerta!", "warning");
            }
          }
        }while(this.isScanning);
      } catch (e) {
      console.error('Scan failed:', e);
      //this.stopScan();
    }
  }

  async escanearMesa(){
    try {
      await BarcodeScanner.hideBackground();
      this.isScanning = true;

      do{
        const result = await BarcodeScanner.startScan();
        if (result?.hasContent) {
          if(result.content == "epicureo-2024-mesa-" + this.mesa)
            {
              this.isScanning = false;
              await BarcodeScanner.showBackground();
              this.data.entrarMesa(`${this.mesa}`, this.uid);
            }
            else
            {
              this.data.mandarToast("Debés escanear el QR de la mesa que te asignaron!", "warning");
            }
          }
        }while(this.isScanning);
    } catch (e) {
      console.error('Scan failed:', e);
      //this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    this.isScanning = false;
  }

  goBack() {
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy(): void {
    this.stopScan();
    if (this.waitingListSubscription) {
      this.waitingListSubscription.unsubscribe();
    }
  }
}
