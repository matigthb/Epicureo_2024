import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { Mensaje } from '../clases/mensaje';
import { DataService } from '../services/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  aulaSeleccionada = "mensajes"; // Default to 'mensajes'
  usuarioActual: any = {};
  listaMensajes: Array<Mensaje> = [];
  mensaje: Mensaje = new Mensaje();
  mostrarGif: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    private authService: AuthService,
    private dataService: DataService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.route.url.subscribe(async () => {
      let aula = localStorage.getItem('aula');
      if (aula) {
        this.aulaSeleccionada = aula;
      }

      this.chatService.listenToChatChanges(this.aulaSeleccionada);
      this.mostrarGif = true;
      setTimeout(() => {
        this.mostrarGif = false;
      }, 1000);

      this.authService.getUserUid().then(uid => {
        if (uid) {
          this.mensaje.usuario = uid;
          this.dataService.getUserRole(uid).subscribe((user: any) => {
            if (user && user.rol) {
              this.usuarioActual = user;
              this.usuarioActual.uid = uid; // Asignamos el UID al usuario actual
              this.mensaje.rol = user.rol;
              this.checkMesaAsignada(uid); // Verificar si el usuario tiene una mesa asignada
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

  checkMesaAsignada(uid: string) {
    this.firestore.collection('mesas', ref => ref.where('sentado', '==', uid)).valueChanges().subscribe((mesas: any[]) => {
      if (mesas && mesas.length > 0) {
        this.mensaje.rol = `Mesa ${mesas[0].numero || 'sin número'}`; // Asumimos que 'numero' es el campo que almacena el número de mesa
      }
    });
  }

  async EnviarMensaje() {
    this.mensaje.fecha = new Date().getTime().toString();
    await this.chatService.enviarMensaje(this.aulaSeleccionada, this.mensaje);
    this.mensaje.mensaje = '';
  }

  async onKey(event: any) {
    let contador = event.target.value.length;
    if (contador >= 21) {
      this.alertMensaje('ERROR', 'El mensaje no puede tener más de 21 caracteres', 'error');
      this.mensaje.mensaje = '';
    }
  }

  alertMensaje(titulo: any, mensaje: any, icon: any) {
    // Puedes usar SweetAlert u otra biblioteca para mostrar alertas si lo deseas
  }
}
