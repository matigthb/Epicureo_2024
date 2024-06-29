import { Injectable } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { Firestore, addDoc, collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { Mensaje } from '../clases/mensaje';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  mensajesCollection: AngularFirestoreCollection<Mensaje>;
  mensajes: Mensaje[] = [];
  usuarioActual: any; // Objeto para almacenar el usuario actual

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService // Inyecta AuthService
  ) {
    this.mensajesCollection = this.afs.collection<Mensaje>('mensajes');
    this.authService.getUserUid().then(uid => {
      if (uid) {
        this.obtenerUsuario(uid).then(usuario => {
          if (usuario) {
            this.usuarioActual = usuario;
          }
        });
      }
    });
  }

  obtenerUsuario(uid: string): Promise<any> {
    return this.afs.doc(`usuarios/${uid}`).get().toPromise()
      .then(snapshot => {
        if (snapshot && snapshot.exists) { // Verificar que snapshot y snapshot.exists no sean undefined
          return snapshot.data(); // Devuelve los datos del usuario si el snapshot existe
        } else {
          console.error('Usuario no encontrado en Firestore');
          return null;
        }
      })
      .catch(error => {
        console.error('Error al obtener el usuario desde Firestore:', error);
        return null;
      });
  }

  listenToChatChanges(mesa : string) {
    this.mensajes = []; // Limpia el array de mensajes
    this.mensajesCollection = this.afs.collection<Mensaje>("mensajes");
    this.mensajesCollection.valueChanges().subscribe(data => {
      this.mensajes = data.sort((a, b) => Number(b.fecha) - Number(a.fecha));
    });

    this.mensajes.filter(mensajes => mensajes.mesa === mesa);
  }

  async enviarMensaje(aulaSeleccionada: string, mensajeData: any) {
    try {
      const mensaje: Mensaje = { 
        fecha: mensajeData.fecha, 
        nombre: mensajeData.nombre,
        apellido: mensajeData.apellido,
        mensaje: mensajeData.mensaje, 
        usuario: mensajeData.usuario,
        perfil: mensajeData.perfil,
        rol: mensajeData.rol, // Asigna un valor para 'rol', según sea necesario
        mesa: mensajeData.mesa
      };

      await this.mensajesCollection.add(mensaje);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
}
