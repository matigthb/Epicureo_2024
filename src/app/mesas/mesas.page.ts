import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { Usuario } from '../clases/usuario';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
})
export class MesasPage implements OnInit {
  lista: any[] = [];
  mesas: any[] = [];
  cliente : any;
  @ViewChild("modal") modal: IonModal | undefined ;
  
  constructor(private router: Router, public auth : AuthService, private data : DataService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarMesas();
  }

  cargarMesas(){
    this.data.getMesas().subscribe(data => {
      this.mesas = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar mesas:', error);
    });
  }

  cargarUsuarios(): void {
    this.data.getListaEspera().subscribe(data => {
      this.lista = data;
      this.lista = this.lista.filter(item => item.assignedTable === "0");
      console.log(data);
    }, error => {
      console.error('Error al cargar usuarios:', error);
    });
  }

  openModal(cliente: any) {
    this.cliente = cliente;
    this.modal?.present();
  }

  aceptarCliente(cliente : any){
    this.data.aceptarCliente(cliente);
    this.data.mandarToast("Cliente aceptado.", "success");
  }

  rechazarCliente(clienteId : string)
  {
    this.data.rechazarCliente(clienteId);
    this.data.mandarToast("Cliente rechazado.", "danger");
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }

  asignarMesa(id : string)
  {
    this.data.entrarMesa(id, this.cliente.id);
    this.data.mandarToast("Mesa número " + id + " asignada a " + this.cliente.nombre + " " + this.cliente.apellido + ".", "success");
    this.modal?.dismiss();
  }
}
