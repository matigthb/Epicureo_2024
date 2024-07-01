import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  mesa : string = "0";
  
  pedidoRealizado: string = 'no';
  
  constructor(private router: Router, private route : ActivatedRoute, private auth: AuthService, private notification: NotificationService, private toast: ToastController, private data: DataService) { 
    
  }

  async ngOnInit(): Promise<void> {
    this.uid = await this.auth.getUserUid() || "";

    this.route.queryParams.subscribe(params => {
      this.pedidoRealizado = params['pedidoRealizado'];
    });

    console.log(this.pedidoRealizado);
    this.subscribeToWaitingList(this.uid);

    setTimeout(() =>{
      this.data.mandarToast(this.pedidoRealizado + this.mesa + this.isScanning, "success");
    },5000);
  }

  subscribeToWaitingList(uid: string) {
    this.waitingListSubscription = this.data.getListaDeEspera().subscribe(lista => {
      const userInList = lista.find((item: { id: string; assignedTable: string | null; fecha: string; }) => item.id === uid);

      if (userInList) {
        if (userInList.assignedTable) {
          this.mesa = userInList.assignedTable;
          if(this.pedidoRealizado === 'si')
          {
            this.escanearMesa();
            console.log("2")
          }
          this.data.mandarToast(`You have been assigned to table ${userInList.assignedTable}`  + this.isScanning, "success");
        } else {
          this.mesa = "0";
          this.stopScan();
          this.data.mandarToast('You are in the waiting list, waiting for table assignment', "info");
        }
      } else {
        this.startScan();
        console.log("1")
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
              
              this.notification.sendRoleNotification(["maitre"],"Se requiere asignación!", "Un cliente ingresó a la lista de espera por una mesa.").subscribe(
                (response) => {
                  //this.data.mandarToast('Notification sent successfully' + " " + JSON.stringify(response), "success");
                },
                (error) => {
                  //this.data.mandarToast('Notification ERROR' + " " + JSON.stringify(error),"error");
                }
              )
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

  goEncuestas(){
    this.router.navigate(['/encuestas'], { queryParams: { pedidoRealizado: this.pedidoRealizado } });
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
              
              if(this.pedidoRealizado === 'no')
              {
                this.data.entrarMesa(`${this.mesa}`, this.uid);
                this.router.navigate(['/productos'], { queryParams: { mesa: this.mesa } });
              }
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

  go(url: string)
  {
    this.router.navigateByUrl(url);
  }

  ngOnDestroy(): void {
    this.stopScan();
    if (this.waitingListSubscription) {
      this.waitingListSubscription.unsubscribe();
    }
  }
}
