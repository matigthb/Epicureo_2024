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

  tareas: any[] = [];
  tabla : string = "";

  constructor(private router: Router, public auth : AuthService, private data : DataService, private notification : NotificationService) { }

  ngOnInit(): void {
    if(this.auth.rol == "bartender")
    {
      this.cargarTareasBar();
      this.tabla = "tareasBar"
    }else{
      this.cargarTareasCocina();
      this.tabla = "tareasCocina"
    }
  }

  cargarTareasCocina(): void {
    this.data.getTareasCocina().subscribe(data => {
      this.tareas = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar pedidos:', error);
    });
  }
  
  cargarTareasBar(): void {
    this.data.getTareasBar().subscribe(data => {
      this.tareas = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar pedidos:', error);
    });
  }

  aceptarProducto(tarea : any){
    this.data.finalizarProducto(tarea.id, this.tabla);

    this.data.checkRealizadoField(tarea.pedidoId).subscribe(result => {
      if (result) {
        this.data.finalizarPedido(tarea.pedidoId);
      }
    });
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }
}
