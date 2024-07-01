import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../clases/usuario';
import { DataService } from '../services/data.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
})
export class ConsultasPage implements OnInit {

  
  consultas: any[] = [];

  constructor(private router: Router, public auth : AuthService, private data : DataService, private notification : NotificationService) { }

  ngOnInit(): void {
    this.cargarConsultas();
  }

  cargarConsultas(): void {
    this.data.getConsultas().subscribe((data: any) => {
      this.consultas = data;
      console.log("HOLA", data);
    }, error => {
      console.error('Error al cargar consultas:', error);
    });
  }

  openChat(mesa : string){
    this.router.navigate(['/chat'], { queryParams: { mesa: mesa } });
  }

  
  goBack(){
    this.router.navigateByUrl('/home');
  }
}
