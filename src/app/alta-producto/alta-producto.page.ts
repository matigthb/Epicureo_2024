import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

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

  imageUrl : string = "";

  registroForm : FormGroup;

  constructor(private router : Router, private fb : FormBuilder, private authService : AuthService, private data : DataService){
    this.registroForm = this.fb.group({
      categoria: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern("[0-9]+$")]],
      tiempoEstimado: ['', [Validators.required, Validators.pattern("[0-9]+$")]],
    });
  }

  agregarProducto() {
    if(this.registroForm.valid)
    {
      this.producto.categoria = this.registroForm.value.categoria;
      this.producto.nombre = this.registroForm.value.nombre;
      this.producto.descripcion = this.registroForm.value.descripcion;
      this.producto.precio = this.registroForm.value.precio;
      this.producto.tiempoEstimado = this.registroForm.value.tiempoEstimado;
      this.data.agregarProducto(this.producto);
      this.data.mandarToast("Producto agregado correctamente.", "success");
    }
    else
    {
      this.data.mandarToast("Error, complete todos los campos correctamente, incluyendo las 3 fotos.", "danger");
    }
    console.log(this.producto);
  }

  async tomarFoto(index : number) {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri, // Use Uri instead of Base64
      source: CameraSource.Camera
    });

    if (image.webPath) {
      console.log("TENGO");
      this.imageUrl = image.webPath;
      this.producto.imagenes[index] = image.webPath;
      //this.uploadImage(image.webPath, fecha, uidUser);
    } else {
      console.log("NO TENGO");
    }
  }

  async seleccionarFoto() {
    const photos = await Camera.pickImages({
      quality: 90,
      limit: 3
    });

    let contador: number = 0;

    console.log(photos);
    photos.photos.forEach(photo => {
      if(photo.webPath)
      {
        this.producto.imagenes[contador] = photo.webPath;
        contador++;
      }
    });
  }
  
  goBack(){
    this.router.navigateByUrl('/home');
  }

}
