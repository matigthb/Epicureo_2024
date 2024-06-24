import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Usuario } from '../clases/usuario';
import { Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';
import { AuthService } from '../services/auth.service';
import { Capacitor } from '@capacitor/core';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Plugins } from '@capacitor/core';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  registroForm: FormGroup;
  usandoQR: boolean = false;

  constructor(
    
    private fb: FormBuilder,
    private notificationService : NotificationService,
    private authService : AuthService,
    private router : Router,
    private dataService: DataService // Inyecta el servicio DataService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
      foto: ['', Validators.required]
    });
  }
  ngOnInit() {
    
  }
  
  async registrarCliente() {
    if (this.registroForm.valid) {
      const cliente: Usuario = {
        nombre: this.registroForm.value.nombre,
        apellido: this.registroForm.value.apellido,
        DNI: this.registroForm.value.dni,
        correo: this.registroForm.value.correo,
        foto: this.registroForm.value.foto // Ajusta cómo manejas la foto si es necesario
      };

      const password = this.registroForm.value.contrasena;

      try {
        const resultado = await this.dataService.registrarCliente(cliente, password);
        console.log(Capacitor.isNativePlatform())
        //if (Capacitor.isNativePlatform()){
          this.sendRoleNotification(); // ENVIA NOTIFICACION PUSH A DUEÑO Y SUPERVISOR
          ///this.sendMail();
        //}


        console.log(resultado);
        // Aquí puedes manejar el éxito del registro, como redirigir a otra página o mostrar un mensaje
      } catch (error) {
        console.error('Error en el componente de registro:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje al usuario
      }
    } else {
      // El formulario es inválido, puedes mostrar mensajes de validación si es necesario
    }
  }

  /*sendMail(){
    this.notificationService.sendMail(true, this.registroForm.value.nombre, this.registroForm.value.correo).subscribe(
      (response) => {
        this.dataService.mandarToast('Mail sent successfully' + " " + JSON.stringify(response));
      },
      (error) => {
        this.dataService.mandarToast('Mail ERROR' + " " + JSON.stringify(error));
      }
    );
  }*/

  /**sendRoleNotification(rol : string) {
    const title = 'Bienvenido!';
    const body = 'Notificacion prueba de bienvenida.';
    
    this.dataService.getDevice(uid).subscribe(async device => {
      if (device?.token) {
        this.notificationService.sendRoleNotification(device.token, title, body);
      } else {
        this.dataService.mandarToast("No se encontró el token");
      }
    });
  }*/
  sendRoleNotification() {
    const title = 'Tenemos un nuevo cliente!';
    const body = 'Hay un nuevo cliente pendiente de aprobación.';
    
    this.notificationService.sendRoleNotification(["dueño", "supervisor"], title, body);
  }

  goBack(){
    this.router.navigateByUrl('/login');
  }

  async tomarFoto() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 20,
    });

    if (image && image.dataUrl) {
      this.registroForm.value.foto = image.dataUrl;
    }
  }

  async seleccionarFoto() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos, // Utiliza CameraSource.Photos para seleccionar una foto de la galería
    });

    if (image && image.dataUrl) {
      this.registroForm.value.foto = image.dataUrl;
    }
  }
async solicitarPermisosDeCamara() {
  const { Permissions } = Plugins;

  try {
    const permisos = await Permissions['requestPermissions']({ permissions: ['camera'] });

    
    if (permisos.camera && permisos.camera.state === 'granted') {
      // Ahora tienes permisos de cámara, puedes usar el escáner de códigos QR.
      this.escanearDNI();
    } else {
      console.error('No se concedieron los permisos de cámara.');
      // Puedes mostrar un mensaje al usuario informándole que necesita dar permisos de cámara.
    }
  } catch (error) {
    console.error('Error al solicitar permisos de cámara:', error);
  }
}

async escanearDNI() {
  await BarcodeScanner.checkPermission({ force: true });

  this.usandoQR = true;
  await BarcodeScanner.hideBackground();
  document.querySelector('body')?.classList.add('scanner-active');

  const datos = await BarcodeScanner.startScan();

  if (datos?.hasContent) {
    await BarcodeScanner.showBackground();
    document.querySelector('body')?.classList.remove('scanner-active');
    this.usandoQR = false;
    let datosSeparados = datos.content.split('@');
    
    this.registroForm.patchValue({
      apellido: datosSeparados[1],
      nombre: datosSeparados[2],
      dni: datosSeparados[4]
    });
  }
}

  procesarContenidoQR(contenidoQR: string) {
    // Divide el contenido del código QR en líneas
    const lineas = contenidoQR.split('\n');
  
    // Objeto para almacenar los datos del DNI
    const datosDNI = {
      nombres: '',
      apellidos: '',
      dni: ''
    };
  
    // Recorre las líneas y extrae los datos
    for (const linea of lineas) {
      if (linea.startsWith('Nombres:')) {
        datosDNI.nombres = linea.replace('Nombres:', '').trim();
      } else if (linea.startsWith('Apellidos:')) {
        datosDNI.apellidos = linea.replace('Apellidos:', '').trim();
      } else if (linea.startsWith('DNI:')) {
        datosDNI.dni = linea.replace('DNI:', '').trim();
      }
    }
  
    return datosDNI;
  }
}
