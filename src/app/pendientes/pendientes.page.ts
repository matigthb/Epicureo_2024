import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pendientes',
  templateUrl: './pendientes.page.html',
  styleUrls: ['./pendientes.page.scss'],
})
export class PendientesPage implements OnInit {

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

  constructor(private router: Router, public auth : AuthService) { }

  ngOnInit(): void {
    this.startTextLoop();
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

  goBack(){
    this.router.navigateByUrl('/home');
  }

}
