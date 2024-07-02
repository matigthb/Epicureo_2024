import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { Mensaje } from '../clases/mensaje';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  mesa : string = "";
  aulaSeleccionada = "mensajes"; // Default to 'mensajes'
  usuarioActual: any = {};
  listaMensajes: Array<Mensaje> = [];
  mensaje: Mensaje = new Mensaje();
  mostrarGif: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    public chatService: ChatService,
    private authService: AuthService,
    private dataService: DataService,
    private notificationService : NotificationService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mesa = params['mesa'];
    });
    
    this.mensaje.mesa = this.mesa;

    this.route.url.subscribe(async () => {
      this.chatService.listenToChatChanges(this.mesa);

      this.authService.getUserUid().then(uid => {
        if (uid) {
          this.mensaje.usuario = uid;
          this.dataService.getUserRole(uid).subscribe((user: any) => {
            if (user && user.rol) {
              this.usuarioActual = user;
              this.usuarioActual.uid = uid; // Asignamos el UID al usuario actual
              this.mensaje.rol = user.rol;
              this.mensaje.nombre = user.nombre;
              this.mensaje.apellido = user.apellido;
            } else {
              console.error('No se encontró el rol del usuario');
            }
          });
        } else {
          console.error('No se encontró un usuario actual');
        }
      }).catch(error => {
        console.error('Error al obtener el usuario actual:', error);
      });
    });
  }

  async EnviarMensaje() {
    this.mensaje.fecha = new Date().getTime().toString();
    await this.chatService.enviarMensaje("mensajes", this.mensaje);
    await this.dataService.updateConsulta(this.mesa, "abierta");
    this.notificationService.sendRoleNotification(["mozo"], "Nueva consulta", "La mesa " + this.mesa + " tiene una nueva consulta, ayudalos!").subscribe(
      (response) => {
        //this.dataService.mandarToast('Noti sent successfully' + " " + JSON.stringify(response), "success");
      },
      (error) => {
        //this.dataService.mandarToast('Noti ERROR' + " " + JSON.stringify(error),"error");
      }
    );
    this.mensaje.mensaje = '';
  }

  async onKey(event: any) {
    let contador = event.target.value.length;
    if (contador >= 21) {
      this.alertMensaje('ERROR', 'El mensaje no puede tener más de 21 caracteres', 'error');
      this.mensaje.mensaje = '';
    }
  }

  goBack(){
    this.router.navigate(['/productos'], { queryParams: { mesa: this.mesa } });
  }

  alertMensaje(titulo: any, mensaje: any, icon: any) {
    // Puedes usar SweetAlert u otra biblioteca para mostrar alertas si lo deseas
  }
}
