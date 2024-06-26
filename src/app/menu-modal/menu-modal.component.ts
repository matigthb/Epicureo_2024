import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';


interface Producto {
  tipo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo: string;
  imagenes: string[];
}

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent {

  @Input() productos!: any[];
  


  slideOpts = {
    initialSlide: 1,

    speed: 400,
    loop: true,
    autoplay: {
      delay: 3000, // Deslizar cada 3 segundos
    },

  };

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }
}