import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  private espera: number = 0;
  private total = new BehaviorSubject<number>(0);

  constructor() {}

  getCart() {
    return this.cart;
  }

  getEspera() {
    return this.espera;
  }

  addToCart(producto: any) {
    this.cart.push(producto);
    if(producto.tiempoEstimado > this.espera)
    {
      this.espera = producto.tiempoEstimado;
    }
    this.updateTotal();
  }

  removeFromCart(producto: any) {
    const index = this.cart.indexOf(producto);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
    this.updateTotal();
  }

  getTotal() {
    return this.total.asObservable();
  }

  private updateTotal() {
    const newTotal = this.cart.reduce((sum, item) => sum + item.precio*item.cantidad, 0);
    this.total.next(newTotal);
  }
}