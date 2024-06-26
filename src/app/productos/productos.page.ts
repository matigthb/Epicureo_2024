import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';

interface Producto {
  tipo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tiempo: string;
  imagenes: string[];
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
}) 
export class ProductosPage {
  productos: Producto[] = [
    { tipo: 'comidas', nombre: 'Pizza', descripcion: 'Pizza de pepperoni', precio: 7000, tiempo: '30 Minutos' , imagenes: ['../assets/productos/pizza1.jpg','../assets/productos/pizza2.jpg', '../assets/productos/pizza3.jpg'] },
    { tipo: 'comidas', nombre: 'Hamburguesa', descripcion: 'Hamburguesa con queso', precio: 6000, tiempo: '15 Minutos' , imagenes: ['../assets/productos/hamburguesa1.jpg','../assets/productos/hamburguesa2.jpg','../assets/productos/hamburguesa3.jpg'] },
    { tipo: 'comidas', nombre: 'Tostados', descripcion: 'Tostados de jamon y queso', precio: 4500, tiempo: '10 Minutos' , imagenes: ['../src/assets/productos/tostados1.jpg','../src/assets/productos/tostados2.jpg','../src/assets/productos/tostados3.jpg'] },
    { tipo: 'bebidas', nombre: 'Coca Cola', descripcion: 'Gaseosa Coca Cola', precio: 1500, tiempo: '1 Minuto' , imagenes: ['../src/assets/productos/cocacola1.jpg','../src/assets/productos/cocacola2.jpg','../src/assets/productos/cocacola3.jpg'] },
    { tipo: 'bebidas', nombre: 'Vino', descripcion: 'Vino tinto', precio: 4000, tiempo: '3 Minutos' , imagenes: ['../src/assets/productos/vino1.jpg','../src/assets/productos/vino2.jpg','../src/assets/productos/vino2.jpg'] },
    { tipo: 'bebidas', nombre: 'Café', descripcion: 'Café americano', precio: 1300, tiempo: '5 Minutos' , imagenes: ['../src/assets/productos/cafe1.jpeg','../src/assets/productos/cafe2.jpg','../src/assets/productos/cafe3.JPG'] },
    { tipo: 'postres', nombre: 'Helado', descripcion: 'Helado de vainilla', precio: 1100, tiempo: '10 Minutos' , imagenes: ['../src/assets/productos/helado1.jpg','../src/assets/productos/helado2.jpg','../src/assets/productos/helado3.jpg'] },
    { tipo: 'postres', nombre: 'Torta', descripcion: 'Porcion de torta de chocolate', precio: 4500, tiempo: '10 Minutos' , imagenes: ['../src/assets/productos/torta1.jpg','../src/assets/productos/torta2.jpg','../src/assets/productos/torta3.jpg'] },
    { tipo: 'postres', nombre: 'Frutas', descripcion: 'Frutas frescas', precio: 1500, tiempo: '5 Minutos' , imagenes: ['../src/assets/productos/frutas1.jpg','../src/assets/productos/frutas2.jpg','../src/assets/productos/frutas3.jpg'] },
  ];

  categorias = ['comidas', 'bebidas', 'postres'];

  constructor(private router: Router,private modalController: ModalController) {}

  async openMenu(categoria: string) {
    const productosFiltrados = this.productos.filter(producto => producto.tipo === categoria);

    const modal = await this.modalController.create({
      component: MenuModalComponent,
      componentProps: { productos: productosFiltrados }
    });
    return await modal.present();
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }

}



