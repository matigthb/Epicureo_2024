import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CustomValidators } from '../validators/custom-validators';
import { Usuario } from '../clases/usuario';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-alta-mesa',
  templateUrl: './alta-mesa.page.html',
  styleUrls: ['./alta-mesa.page.scss'],
})
export class AltaMesaPage implements OnInit {
  qrCodeData: string = '';
  registroForm: FormGroup;
  usandoQR: boolean = false;
  imageUrl : string = "";
  UID : string = "";


  generateQRCode(nro : string) {
    const text = 'epicureo-2024-mesa-'+ nro;
    QRCode.toDataURL(text)
    .then(url => {
      this.qrCodeData = url;
    })
    .catch(err => {
      console.error('Error generating QR code:', err);
    });
  }

  constructor(
    
    private fb: FormBuilder,
    //private notificationService : NotificationService,
    private authService : AuthService,
    private router : Router,
    private dataService: DataService // Inyecta el servicio DataService
  ) {
    this.registroForm = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern("[0-9]+$")]],
      comensales: ['', [Validators.required, Validators.pattern("[0-9]+$")]],
      tipo: ['', Validators.required],
      foto: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    this.registroForm.get('numero')?.valueChanges.subscribe(value => {
      this.generateQRCode(value);
    });
  }
  
  async registrarMesa() {
    if (this.registroForm.valid) {
      const mesa = {
        numero: this.registroForm.value.numero,
        comensales: this.registroForm.value.comensales,
        tipo: this.registroForm.value.tipo,
        foto: this.imageUrl,
        qr: this.qrCodeData
      };

      try {
        await this.dataService.crearMesa(mesa);
  
        this.router.navigateByUrl("/altas");
        this.dataService.mandarToast(`Mesa ${this.registroForm.value.numero} creada correctamente`, "success");
        // Aquí puedes manejar el éxito del registro, como redirigir a otra página o mostrar un mensaje
      } catch (error) {
        console.error('Error en el componente de registro:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje al usuario
      }
    } else {
      console.log(this.registroForm.valid);
      console.log(this.registroForm.value.comensales);
      console.log(this.registroForm.value.tipo);
      console.log(this.registroForm.value.foto);
      this.dataService.mandarToast("Rellená todos los campos correctamente.", "danger");
    }
  }

  /*sendRoleNotification() {
    const title = 'Tenemos un nuevo cliente!';
    const body = 'Hay un nuevo cliente pendiente de aprobación.';
    
    this.notificationService.sendRoleNotification(["dueño", "supervisor"], title, body).subscribe(
      (response) => {
        this.dataService.mandarToast('Noti sent successfully' + " " + JSON.stringify(response), "success");
      },
      (error) => {
        this.dataService.mandarToast('Noti ERROR' + " " + JSON.stringify(error),"error");
      }
    );;
  }*/

  goBack(){
    this.router.navigateByUrl('/altas');
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri, // Use Uri instead of Base64
      source: CameraSource.Camera
    });
  
    const fecha = new Date(); // replace with actual date
    const uidUser = await this.authService.getUserUid() || '';
  
    if (image.webPath) {
      console.log("TENGO");
      this.imageUrl = image.webPath;
      this.registroForm.get('foto')?.setValue(image.webPath);
      //this.uploadImage(image.webPath, fecha, uidUser);
    } else {
      console.log("NO TENGO");
    }
  }

  async seleccionarFoto() {
    const photos = await Camera.pickImages({
      quality: 90,
      limit: 1, // specify the limit for the number of photos you want to fetch
    });

    const fecha = new Date(); // replace with actual date
    const uidUser = await this.authService.getUserUid() || '';

    console.log(photos);
    photos.photos.forEach(photo => {
      if(photo.webPath)
      {
        this.imageUrl = photo.webPath;
        this.registroForm.get('foto')?.setValue(photo.webPath);
      }
    });
  }

}
