import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../clases/usuario';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage implements OnInit {

  usuarios: any[] = [];

  constructor(private router: Router, public auth : AuthService, private data : DataService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.data.getUsuarios().subscribe((data: Usuario[]) => {
      this.usuarios = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar usuarios:', error);
    });
  }

  aceptarCliente(cliente : any){
    this.data.aceptarCliente(cliente);
  }

  rechazarCliente(clienteId : string)
  {
    this.data.rechazarCliente(clienteId);
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }

}
