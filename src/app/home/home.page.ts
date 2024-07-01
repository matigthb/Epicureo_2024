import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../clases/usuario';
import { DataService } from '../services/data.service';
import { Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  texts: string[] = [
    'Epicúreo',
    'Disfrutá.'
  ];
  
  currentTextArray: string[] = [];
  currentTextIndex: number = 0;
  charIndex: number = 0;
  isDeleting: boolean = false;
  interval: any;
  holdTime: number = 0;

  currentUser : any = null;

  clientesPendientes : Usuario[] = [];
  listaDeEspera : any[] = [];
  consultas: any[] = [];
  pedidosPendientes : any[] = [];
  tareasCocina : any[] = [];
  tareasBar : any[] = [];

  sentado : string = '0';

  subscription1 : any;
  subscription2 : any;
  subscription3 : any;
  subscription4 : any;
  subscription5 : any;
  subscription6 : any;
  subscription7 : any;
  subscription8 : any;

  constructor(private router: Router, public auth : AuthService, private loadingController: LoadingController, private data : DataService) { }

  async ngOnInit(): Promise<void> {
    const uid = await this.auth.getUserUid() || "";
    this.cargarUser(uid);
    this.startTextLoop();
    this.cargarUsuarios();
    this.cargarClientes();
    this.cargarConsultas();
    this.cargarPedidos();
    this.cargarTareasCocina();
    this.cargarTareasBar();
    this.checkearMesas(uid);
    const loading = await this.loadingController.create();
    await loading.present();
    setTimeout(async () => {
      loading.dismiss()
      this.auth.isLogging = false
    }, 1000);


    console.log(this.auth.rol)
  }

  cargarTareasCocina(): void {
    this.subscription7 = this.data.getTareasCocina().subscribe(data => {
      this.tareasCocina = data;
      console.log("COCCICNA", data);
    }, error => {
      console.error('Error al cargar tareas:', error);
    });
  }

  cargarTareasBar(): void {
    this.subscription8 = this.data.getTareasBar().subscribe(data => {
      this.tareasBar = data;
      console.log("BAR", data);
    }, error => {
      console.error('Error al cargar tareas:', error);
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
    this.subscription6.unsubscribe();
    this.subscription7.unsubscribe();
    this.subscription8.unsubscribe();
  }

  checkearMesas(uid : string){
    this.subscription1 = this.data.checkearMesas(uid).subscribe(id => {
      if (typeof id === 'string') {
        this.sentado = id;
      } else {
        this.sentado = '0'; // Or handle the case where no matching document is found
      }
    });
  }

  cargarUser(uid : string){
    this.subscription2 = this.data.getUserRole(uid).subscribe(data => {
      this.currentUser = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar usuario:', error);
    });
  }

  cargarClientes(){
    this.subscription3 = this.data.getListaEspera().subscribe(data => {
      this.listaDeEspera = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar lista de espera:', error);
    });
  }

  
  cargarConsultas(){
    this.subscription4 = this.data.getConsultas().subscribe(data => {
      this.consultas = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar consultas:', error);
    });
  }
  
  cargarUsuarios(): void {
    this.subscription5 = this.data.getUsuarios().subscribe((data: Usuario[]) => {
      this.clientesPendientes = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar usuarios:', error);
    });
  }
  
  cargarPedidos(){
    this.subscription6 = this.data.getPedidosPendientes().subscribe(data => {
      this.pedidosPendientes = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar pedidos: ', error);
    });
  }

  startTextLoop(): void {
    this.interval = setInterval(() => {
      this.updateText();
    }, 100); // Ajusta la velocidad de la animación
  }
  
  updateText(): void {
    const currentText = this.texts[this.currentTextIndex];
    const holdTimes = [4000, 2000]; // Tiempo en milisegundos que cada oración se mantiene completa
    if (this.isDeleting) {
      if (this.charIndex > 0) {
        this.charIndex--;
      } else {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      }
    } else {
      if (this.charIndex < currentText.length) {
        this.charIndex++;
      } else {
        if (this.holdTime < holdTimes[this.currentTextIndex]) {
          this.holdTime += 100;
          return;
        }
        this.holdTime = 0;
        this.isDeleting = true; 
      }
    }
    this.currentTextArray = currentText.slice(0, this.charIndex).split('');
  }

  getOpacity(index: number): number {
    if (this.isDeleting) {
      return index >= this.charIndex ? 0 : 1;
    } else {
      return index < this.charIndex ? 1 : 0;
    }
  }

  go(url : string){
    this.router.navigateByUrl(url);
  }

  goQR(param : string)
  {
    this.router.navigate(['/qrs'], { queryParams: { pedidoRealizado: param } });
  }

  logout(){
    clearInterval(this.interval);
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
    this.subscription6.unsubscribe();
    this.subscription7.unsubscribe();
    this.subscription8.unsubscribe();
    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
}
