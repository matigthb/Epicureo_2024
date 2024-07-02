import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';
import { DataService } from '../services/data.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
}) 
export class ProductosPage implements OnInit{
  mesa: string = "";
  total : number = 0;
  productos: any[] = [];
  loading : any;
  categorias = ['comidas', 'bebidas', 'postres'];

  carrito : any;
  mostrarCarrito : boolean = false;
  espera : number = 0; 

  constructor(private route: ActivatedRoute, private auth : AuthService, private loadingController: LoadingController, private router: Router,private modalController: ModalController, private data : DataService, private cart : CartService) {}

  async openMenu(categoria: string) {
    const productosFiltrados = this.productos.filter(producto => producto.categoria === categoria);
    const modal = await this.modalController.create({
      component: MenuModalComponent,
      componentProps: { productos: productosFiltrados, mesa: this.mesa }
    });
    return await modal.present();
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }

  async ngOnInit() {
    

    
    this.route.queryParams.subscribe(params => {
      this.mesa = params['mesa'];
      this.data.mandarToast("mesa: " + this.mesa, "success");
    });

    this.cargarProductos();

    this.cart.getTotal().subscribe(total => this.total = total);
  }

  cargarProductos(){
    this.data.getProductos().subscribe(data => {
      this.productos = data;
      this.productos = this.productos.map(producto => ({
        ...producto,
        cantidad: 1,
        added: false
      }));

      this.loading.dismiss();
      console.log(data);
    }, error => {
      console.error('Error al cargar productos:', error);
    });
  }

  verPedido(){
    this.carrito = this.cart.getCart();
    this.espera = this.cart.getEspera();
    this.mostrarCarrito = true;
  }

  async confirmarPedido(){
    const uid = await this.auth.getUserUid() || "";

    this.data.confirmarPedido(this.carrito, this.mesa, uid);
    this.data.mandarToast("Tu pedido fue solicitado, podés ver el estado escaneando el QR de tu mesa en la opción debajo.", "success")
    this.router.navigateByUrl("/home");
  }

  deleteProduct(producto: any) {
    this.cart.removeFromCart(producto)
    this.carrito = this.cart.getCart();

    if(this.carrito.length < 1){
      this.mostrarCarrito = false;
    }
  }

  goChat(){
    this.router.navigate(['/chat'], { queryParams: { mesa: this.mesa } });
  }

  getBackgroundImage(categoria: string): string {
    return `url('../../assets/${categoria}.jpg')`;
  }

}



