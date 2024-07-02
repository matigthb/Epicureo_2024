import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../clases/usuario';
import { DataService } from '../services/data.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss'],
})
export class TareasPage implements OnInit {

  pedidos: any[] = [];
  categoria : string[] = [];

  constructor(private router: Router, public auth : AuthService, private data : DataService, private notification : NotificationService) { }

  ngOnInit(): void {

    if(this.auth.rol == "bartender")
    {
      this.categoria = ["bebidas"];
    }else{
      this.categoria = ["comidas", "postres"];
    }
    this.cargarTareasCocina();
  }

  cargarTareasCocina(): void {
    this.data.getPedidosConfirmados().subscribe(data => {
      this.pedidos = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar pedidos:', error);
    });
  }

  aceptarProducto(pedido : any, item : any, index : number){
    pedido.pedido[index].realizado = true;
    this.data.actualizarPedido(pedido);

    this.data.mandarToast("Tarea preparada.", "success")

    this.notification.sendRoleNotification(["mozo"], "Tarea de la mesa N°" + item.pedidoId + " realizada", 
    "El sector de " + this.auth.rol + "s se encargó de preparar " + item.nombre + " (" + item.cantidad + ")" );
  }

  ninguno(pedido : any)
  {
    let rtrn : boolean = true;

    pedido.pedido.forEach((element: { categoria: string; realizado: boolean;}) => {
      if(this.categoria.includes(element.categoria) && element.realizado == false){
        rtrn = false;
      }
    });

    return rtrn;
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }
}
