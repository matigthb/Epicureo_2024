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

  constructor(private router: Router, public auth : AuthService, private data : DataService, private notification : NotificationService) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.data.getPedidosPendientes().subscribe(data => {
      this.pedidosPendientes = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar pedidos:', error);
    });
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

  goBack(){
    this.router.navigateByUrl('/home');
  }
}
