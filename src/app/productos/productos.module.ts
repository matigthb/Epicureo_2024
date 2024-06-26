import { NgModule,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductosPageRoutingModule } from './productos-routing.module';
import { ProductosPage } from './productos.page';
import { MenuModalComponent } from '../menu-modal/menu-modal.component';
import { CapitalizePipe } from '../capitalize.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosPageRoutingModule,
    

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProductosPage, MenuModalComponent, CapitalizePipe],
})
export class ProductosPageModule {}