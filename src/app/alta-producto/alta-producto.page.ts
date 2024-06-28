import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-producto',
  templateUrl: './alta-producto.page.html',
  styleUrls: ['./alta-producto.page.scss'],
})
export class AltaProductoPage {

  producto = {
    categoria: '',
    nombre: '',
    descripcion: '',
    precio: null,
    tiempoEstimado: null,
    imagenes: ['', '', '']
  };

  constructor(private router : Router,){}

  agregarProducto() {
    console.log(this.producto);
  }

  async tomarFoto(index: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera // Aquí se especifica que la fuente es la cámara
      });

      // Asigna un valor vacío si image.dataUrl es undefined
      this.producto.imagenes[index] = image.dataUrl || '';

    } catch (error) {
      console.error('Error al tomar la foto', error);
    }
  }

  goBack(){
    this.router.navigateByUrl('/home');
  }

}
