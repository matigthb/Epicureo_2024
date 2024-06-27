import { Injectable } from '@angular/core';
import { Producto } from '../productos/productos.page';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: Producto[] = [];
  private total = 0;

  constructor() {}

  addToCart(producto: Producto) {
    this.items.push(producto);
    this.total += producto.precio;
  }

  removeFromCart(producto: Producto) {
    const index = this.items.findIndex(item => item.nombre === producto.nombre);
    if (index !== -1) {
      this.total -= this.items[index].precio;
      this.items.splice(index, 1);
    }
  }

  getItems(): Producto[] {
    return this.items;
  }

  getTotal(): number {
    return this.total;
  }

  clearCart() {
    this.items = [];
    this.total = 0;
  }
}