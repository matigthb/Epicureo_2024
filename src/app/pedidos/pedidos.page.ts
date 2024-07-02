import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../clases/usuario';
import { DataService } from '../services/data.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  pedidosPendientes: any[] = [];
  pedidosConfirmados: any[] = [];
  mostrarPedido : boolean = false;
  pedidoActivo : any;
  banderaPedido : boolean = true;

  constructor(private router: Router, public auth : AuthService, private data : DataService, private notification : NotificationService) { }

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarConfirmados();
  }

  cargarPedidos(): void {
    this.data.getPedidosPendientes().subscribe(data => {
      this.pedidosPendientes = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar pedidos:', error);
    });
  }

  cargarConfirmados(): void {
    this.data.getPedidosConfirmados().subscribe(data => {
      this.pedidosConfirmados = data;
      console.log("CONFIRMADOS");
    }, error => {
      console.error('Error al cargar pedidos:', error);
    });
  }

  print(){
    console.log(this.pedidosConfirmados);
  }

  aceptarPedido(pedido : any){
    this.data.aceptarPedido(pedido);

    this.data.getDevice(pedido.user).subscribe(async device => {
      if (device?.token) {
        this.notification.sendNotification(device.token, "Tu pedido fue confirmado!", "Tu pedido está en camino, no tardará mucho!");
      } else {
        this.data.mandarToast("No se encontró el token", "danger");
      }
    });
  }

  entregarPedido(pedidoId : string){
    this.data.entregarPedido(pedidoId);

  }

  abrirPedido(pedido : any){
    if(this.pedidoActivo != pedido )
    {
      this.pedidoActivo = pedido; 

      if(this.banderaPedido)
      {
        this.mostrarPedido = !this.mostrarPedido;
      }
    }
    else
    {
      this.mostrarPedido = !this.mostrarPedido;
    }
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }
}
