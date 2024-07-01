import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-modal',
  templateUrl: './menu-modal.component.html',
  styleUrls: ['./menu-modal.component.scss'],
})
export class MenuModalComponent implements OnInit {

  @Input() productos!: any[];
  @Input() mesa!: string;

  @ViewChild('swiper', { static: true }) swiperRef!: ElementRef;

  total: number = 1;

  carrito : any;
  mostrarCarrito : boolean = false;
  espera : number = 0;

  constructor(
    private modalController: ModalController,
    private cartService: CartService,
    private data : DataService,
    private auth : AuthService,
    private router : Router
  ) {}

  ngOnInit() {
    this.cartService.getTotal().subscribe(total => this.total = total);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  addToCart(producto: any) {
    producto.added = true;
    this.cartService.addToCart(producto);
  }

  removeFromCart(producto: any) {
    producto.added = false;
    this.cartService.removeFromCart(producto);
  }
  

  logActiveIndex() {
    console.log(this.swiperRef.nativeElement.swiper.activeIndex);
  }
  
  increaseQuantity(producto: any) {
    if (producto.cantidad < 100) {
      producto.cantidad++;
    }
  }

  decreaseQuantity(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }

  verPedido(){
    this.carrito = this.cartService.getCart();
    this.espera = this.cartService.getEspera();
    this.mostrarCarrito = true;
  }

  async confirmarPedido(){
    const uid = await this.auth.getUserUid() || "";

    this.data.confirmarPedido(this.carrito, this.mesa, uid);
    this.data.mandarToast("Tu pedido fue solicitado, podés ver el estado escaneando el QR de tu mesa en la opción debajo.", "success")
    this.router.navigateByUrl("/home");
  }

  deleteProduct(producto: any) {
    this.cartService.removeFromCart(producto)
    this.carrito = this.cartService.getCart();

    if(this.carrito.length < 1){
      this.mostrarCarrito = false;
    }
  }

}
