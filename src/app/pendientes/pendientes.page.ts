import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../clases/usuario';
import { DataService } from '../services/data.service';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage implements OnInit {

  usuarios: any[] = [];

  constructor(private router: Router, public auth : AuthService, private data : DataService, private notification : NotificationService) { }

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
    this.notification.sendMail(true, cliente.nombre, cliente.correo).subscribe(
      response => {
        // Handle success response
        this.data.mandarToast("Cliente aceptado.", "success");
      },
      error => {
        // Handle error response
        console.error('Error sending mail:', error);
        this.data.mandarToast("Failed to accept client. Please try again.", "danger");
      }
    );
  }

  rechazarCliente(cliente : any)
  {
    this.data.rechazarCliente(cliente.id);
    this.notification.sendMail(false, cliente.nombre, cliente.correo).subscribe(
      response => {
        // Handle success response
        this.data.mandarToast("Cliente rechazado.", "danger");
      },
      error => {
        // Handle error response
        console.error('Error sending mail:', error);
        this.data.mandarToast("Failed to accept client. Please try again.", "danger");
      }
    );
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }

}
