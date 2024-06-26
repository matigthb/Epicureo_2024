import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../clases/usuario';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  texts: string[] = [
    'Epicúreo',
    'Sabores infinitos.'
  ];
  
  currentTextArray: string[] = [];
  currentTextIndex: number = 0;
  charIndex: number = 0;
  isDeleting: boolean = false;
  interval: any;
  holdTime: number = 0;

  clientesPendientes : Usuario[] = [];

  constructor(private router: Router, public auth : AuthService, private data : DataService) { }

  ngOnInit(): void {
    this.startTextLoop();
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.data.getUsuarios().subscribe((data: Usuario[]) => {
      this.clientesPendientes = data;
      console.log(data);
    }, error => {
      console.error('Error al cargar usuarios:', error);
    });
  }

  startTextLoop(): void {
    this.interval = setInterval(() => {
      this.updateText();
    }, 100); // Ajusta la velocidad de la animación
  }

  updateText(): void {
    const currentText = this.texts[this.currentTextIndex];
    const holdTimes = [4000, 2000]; // Tiempo en milisegundos que cada oración se mantiene completa
    if (this.isDeleting) {
      if (this.charIndex > 0) {
        this.charIndex--;
      } else {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
      }
    } else {
      if (this.charIndex < currentText.length) {
        this.charIndex++;
      } else {
        if (this.holdTime < holdTimes[this.currentTextIndex]) {
          this.holdTime += 100;
          return;
        }
        this.holdTime = 0;
        this.isDeleting = true; 
      }
    }
    this.currentTextArray = currentText.slice(0, this.charIndex).split('');
  }

  getOpacity(index: number): number {
    if (this.isDeleting) {
      return index >= this.charIndex ? 0 : 1;
    } else {
      return index < this.charIndex ? 1 : 0;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  goAltas(){
    this.router.navigateByUrl('/altas');
  }

  goPendientes(){
    this.router.navigateByUrl('/pendientes');
  }
  goQR(){
    this.router.navigateByUrl('/qrs');
  }

  goEncuestas(){
    this.router.navigateByUrl('/encuestas');
  }

  goJuegos(){
    console.log(this.auth.rol);
  }

  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
}
