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

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  registroForm: FormGroup;

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
      foto: [''] // Ajusta cómo manejas la foto si es necesario
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
}
