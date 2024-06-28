import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-altas',
  templateUrl: './altas.page.html',
  styleUrls: ['./altas.page.scss'],
})
export class AltasPage implements OnInit {

  constructor(private router: Router, public auth : AuthService, private data : DataService) { }

  ngOnInit() {
  }

  goAltaEmpleado(){
    this.router.navigateByUrl('/alta-empleado');
  }
  goAltaDuenoSuper(){
    this.router.navigateByUrl('/alta-dueno-super');
  }

  goAltaProducto(){
    this.router.navigateByUrl('/alta-producto');
  }

  goAltaMesa(){
    this.router.navigateByUrl('/alta-mesa');
  }

  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
}
