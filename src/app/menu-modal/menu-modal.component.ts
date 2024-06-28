import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';

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
export class MenuModalComponent implements OnInit {

  @Input() productos!: Producto[];

  @ViewChild('swiper', { static: true }) swiperRef!: ElementRef;

  total: number = 0;

  constructor(
    private modalController: ModalController,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.total = this.cartService.getTotal();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  addToCart(producto: Producto) {
    this.cartService.addToCart(producto);
    this.total = this.cartService.getTotal();
  }

  removeFromCart(producto: Producto) {
    this.cartService.removeFromCart(producto);
    this.total = this.cartService.getTotal();
  }
  

  logActiveIndex() {
    console.log(this.swiperRef.nativeElement.swiper.activeIndex);
  }

}
