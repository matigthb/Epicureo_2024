import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../clases/usuario';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private auth : AuthService
  ) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.firestore.collection<Usuario>('clientesPendientes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Usuario;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  async registrarCliente(cliente: Usuario, password: string) {
    try {
      if (cliente.correo) {
        // Registrar el usuario en Firebase Authentication
        const credential = await this.afAuth.createUserWithEmailAndPassword(cliente.correo, password);

        if (credential && credential.user) {
          // Agregar los datos del cliente a Firestore
          await this.firestore.collection('usuarios').doc(credential.user.uid).set({
            nombre: cliente.nombre || '',
            apellido: cliente.apellido || '',
            DNI: cliente.DNI || '',
            correo: cliente.correo,
            foto: cliente.foto || '',
            rol: "cliente"
          });

          // Retornar el ID del usuario creado
          return credential.user.uid;
        } else {
          throw new Error('No se pudo crear el usuario');
        }
      } else {
        throw new Error('Correo electrónico no definido');
      }

    } catch (error) {
      console.error('Error al registrar el cliente:', error);
      throw error;
    }
  }

  async aceptarCliente(cliente: any) {
    try {
      // Agregar los datos del cliente a Firestore
      await this.rechazarCliente(cliente.id);
      await this.firestore.collection('Usuarios').doc(cliente.id).set({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        DNI: cliente.DNI || '',
        correo: cliente.correo,
        foto: cliente.foto || '',
        rol: "cliente"
      });
    } catch (error) {
      console.error('Error al registrar el cliente:', error);
      throw error;
    }
  }

  async rechazarCliente(docId: string) {
    return this.firestore.collection("clientesPendientes").doc(docId).delete();
  }

  // Otros métodos del servicio según tus necesidades
}
