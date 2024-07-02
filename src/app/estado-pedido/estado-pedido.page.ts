import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-estado-pedido',
  templateUrl: './estado-pedido.page.html',
  styleUrls: ['./estado-pedido.page.scss'],
})
export class EstadoPedidoPage implements OnInit {

  gifSrc: string = "";
  estadoPedido: string = "";

  constructor(private router: Router, private data: DataService) { }

  ngOnInit() {
    const numeroMesa = '9'; // Número de mesa para consultar el pedido (puedes cambiar esto)
    this.data.consultarEstadoPedido(numeroMesa).subscribe(
      result => {
        this.estadoPedido = result.estado; // Asignar result.estado en lugar de result directamente
        this.actualizarGifEstado();
      },
      error => {
        console.error('Error al consultar estado del pedido:', error);
      }
    );
  }

  private actualizarGifEstado() {
    switch (this.estadoPedido) {
      case 'Pendiente':
        this.gifSrc = 'assets/confirmar.gif';
        break;
      case 'Preparando':
        this.gifSrc = 'assets/preparando.gif';
        break;
      case 'Listo para entregar':
        this.gifSrc = 'assets/Listo para entregar.gif';
        break;
    }
  }


  goBack() {
    this.router.navigateByUrl('/home');
  }
}
