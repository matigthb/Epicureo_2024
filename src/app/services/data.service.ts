import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Usuario } from '../clases/usuario';
import { Observable, combineLatest, forkJoin, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private auth : AuthService,
    private storage: AngularFireStorage,
    private toast: ToastController
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

  getProductos(): Observable<any[]> {
    return this.firestore.collection<any>('productos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  
  getMesas(): Observable<any[]> {
    return this.firestore.collection<any>('mesas', ref => ref.where('sentado', '==', 'nadie')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getPedidosPendientes(): Observable<any[]> {
    return this.firestore.collection<any>('pedidosPendientes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getPedidosConfirmados(): Observable<any[]> {
    return this.firestore.collection<any>('pedidos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  /*private getTareasByPedidoId(collectionName: string, pedidoId: string): Observable<any[]> {
    return this.firestore.collection<any>(collectionName, ref => ref.where('pedidoId', '==', pedidoId)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getTareasCocina(): Observable<any[]> {
    return this.firestore.collection<any>('tareasCocina', ref => ref.where('realizado', '==', false)).snapshotChanges().pipe(
      map(actions => {
        // Mapping each document to include id and data
        const mappedData = actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
  
        // Grouping by the "pedido" field
        const groupedData = this.groupByPedido(mappedData);
        
        return groupedData;
      })
    );
  }

  getTareasBar(): Observable<any[]> {
    return this.firestore.collection<any>('tareasBar', ref => ref.where('realizado', '==', false)).snapshotChanges().pipe(
      map(actions => {
        // Mapping each document to include id and data
        const mappedData = actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
  
        // Grouping by the "pedido" field
        const groupedData = this.groupByPedido(mappedData);
        
        return groupedData;
      })
    );
  }
  
  groupByPedido(data: any[]): any[] {
    const grouped: any = {};
    
    // Grouping logic
    data.forEach(item => {
      const pedido = item.pedidoId;
      if (!grouped[pedido]) {
        grouped[pedido] = [];
      }
      grouped[pedido].push(item);
    });
  
    // Convert grouped object into an array of arrays
    return Object.keys(grouped).map(pedido => ({
      pedido,
      items: grouped[pedido]
    }));
  }*/

  checkearMesas(uid: string): Observable<string | number> {
    return this.firestore.collection<any>('mesas', ref => ref.where('sentado', '==', uid)).snapshotChanges().pipe(
      map(actions => {
        if (actions.length > 0) {
          const data = actions[0].payload.doc.data();
          const id = actions[0].payload.doc.id;
          return id; // Return the ID of the first matching document
        } else {
          return 0; // Return 0 if no matching document is found
        }
      }),
      catchError(() => of(0)) // Return 0 in case of an error
    );
  }

  getConsultas(): Observable<any[]> {
    return this.firestore.collection<any>('mesas', ref => ref.where('consulta', '==', 'abierta')).snapshotChanges().pipe(
      switchMap(actions => {
        const mesas = actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });

        const mensajesObservables = mesas.map(mesa => 
          this.firestore.collection<any>('mensajes', ref => ref.where('mesa', '==', mesa.id).where('rol', '==', 'anonimo').orderBy('fecha', 'desc').limit(1))
            .snapshotChanges().pipe(
              map(actions => actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                return { id, ...data };
              }))
            )
        );

        return combineLatest([from([mesas]), ...mensajesObservables]);
      }),
      map(([mesas, ...mensajes]) => {
        return mesas.map((mesa, index) => {
          return {
            ...mesa,
            ultimoMensaje: mensajes[index][0] || null
          };
        });
      })
    );
  }


  getListaEspera(): Observable<any[]> {
    return this.firestore.collection('lista-de-espera').snapshotChanges().pipe(
      switchMap(actions => {
        const listaDeEspera = actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
  
        // Crear una matriz de observables para obtener datos de usuario para cada entrada
        const userObservables = listaDeEspera.map(entry =>
          this.firestore.collection('usuarios').doc(entry.id).valueChanges().pipe(
            map(userData => {
              if (userData && typeof userData === 'object') {
                return {
                  ...entry,
                  ...userData
                };
              } else {
                return entry;
              }
            })
          )
        );
  
        // Combinar todos los observables en uno
        return combineLatest(userObservables);
      })
    );
  }

  async ingresarAnonimo(cliente : any){
    try {
      if (cliente.correo) {
        // Registrar el usuario en Firebase Authentication
        const credential = await this.afAuth.createUserWithEmailAndPassword(cliente.correo, "anonimo");

        if (credential && credential.user) {
          // Agregar los datos del cliente a Firestore
          const foto = await this.uploadImage(cliente.foto || "", "usuarios");

          await this.firestore.collection('usuarios').doc(credential.user.uid).set({
            nombre: cliente.nombre || '',
            apellido: cliente.apellido || '',
            DNI: cliente.DNI || '',
            correo: cliente.correo,
            foto: foto || '',
            rol: "anonimo"
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

  async registrarCliente(cliente: Usuario, password: string) {
    try {
      if (cliente.correo) {
        // Registrar el usuario en Firebase Authentication
        const credential = await this.afAuth.createUserWithEmailAndPassword(cliente.correo, password);

        if (credential && credential.user) {
          // Agregar los datos del cliente a Firestore
          const foto = await this.uploadImage(cliente.foto || "", "usuarios");

          await this.firestore.collection('clientesPendientes').doc(credential.user.uid).set({
            nombre: cliente.nombre || '',
            apellido: cliente.apellido || '',
            DNI: cliente.DNI || '',
            correo: cliente.correo,
            foto: foto || '',
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

  async aceptarPedido(pedido: any) {
    try {
      // Agregar los datos del cliente a Firestore
      await this.firestore.collection("pedidosPendientes").doc(pedido.id).delete();

      const updatedPedido = pedido.pedido.map((element: any) => ({
        ...element,
        realizado: false
      }));

      await this.firestore.collection('pedidos').doc(pedido.id).set({
        pedido: updatedPedido || '',
        user: pedido.user || '',
        realizado: false,
        entregado: false,
        recibido: false,
      });

      /*pedido.pedido.forEach(async (element: any) => {
        if(element.categoria == "bebidas"){
          await this.firestore.collection('tareasBar').doc().set({
            pedidoId: pedido.id || '',
            tarea: element || '',
            realizado: false,
          });
        }else{
          await this.firestore.collection('tareasCocina').doc().set({
            pedidoId: pedido.id || '',
            tarea: element || '',
            realizado: false,
          });
        }
      });*/
    } catch (error) {
      console.error('Error al registrar el pedido:', error);
      throw error;
    }
  }

  actualizarPedido(pedido : any)
  {
    let final : boolean = true;

    pedido.pedido.forEach((element: { realizado: boolean; }) => {
      if(element.realizado == false){
        final = false;
      }
    });

    return this.firestore.collection('pedidos').doc(pedido.id).update({
      pedido: pedido.pedido,
      realizado: final,
    });
  }

  verificarProducto(idMesa: string, producto: any, tabla: string): Observable<boolean> {
    return this.firestore.collection(tabla, ref => 
      ref.where('tarea.id', '==', producto.id)
         .where('pedidoId', '==', idMesa)
    ).snapshotChanges().pipe(
      map(actions => {
        if (actions.length === 0) {
          return false;
        }

        // Suponiendo que solo debería haber un documento que coincida con los criterios
        const data = actions[0].payload.doc.data() as any;
        return data.realizado === true;
      })
    );
  }
  
  async entregarPedido(pedidoId: string) {
    return this.firestore.collection('pedidos').doc(pedidoId).update({
      entregado: true
    });
  }

  async recibirPedido(pedidoId: string) {
    return this.firestore.collection('pedidos').doc(pedidoId).update({
      recibido: true
    });
  }


  async aceptarCliente(cliente: any) {
    try {
      // Agregar los datos del cliente a Firestore
      await this.rechazarCliente(cliente.id);
      await this.firestore.collection('usuarios').doc(cliente.id).set({
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

  async registerDevice(token : string, uid: string, rol : string) {
    try {
      // Agregar los datos del device a Firestore
      await this.firestore.collection('devices').doc(uid).set({
        token: token,
        rol: rol
      });
    } catch (error) {
      console.error('Error al registrar el device:', error);
      throw error;
    }
  }

  async confirmarPedido(carrito : any[], mesanro: string, uid : string) {
    try {
      // Agregar los datos del device a Firestore
      await this.firestore.collection('pedidosPendientes').doc(mesanro).set({
        user: uid,
        pedido: carrito
      });
    } catch (error) {
      console.error('Error al registrar el device:', error);
      throw error;
    }
  }

  async uploadImage(imagePath: string, tabla : string): Promise<string> {
    try {
      const fileRef = this.storage.ref(tabla).child(`${new Date().getTime()}`);
      const imageFile = await this.readFile(imagePath);
      const uploadTask = fileRef.putString(imageFile, 'data_url');

      return new Promise((resolve, reject) => {
        uploadTask.snapshotChanges().subscribe(snapshot => {
          if(snapshot)
            {
              if (snapshot.state === 'success') {
                fileRef.getDownloadURL().subscribe(downloadURL => {
                  resolve(downloadURL);
                });
              }
            }
        }, error => {
          reject(error);
        });
      });
    } catch (error) {
      throw error;
    }
  }

  getUserByEmail(email: string): Observable<any[]> {
    return this.firestore.collection('clientesPendientes', ref => ref.where('correo', '==', email)).valueChanges();
  }

  getUserByEmail2(email: string): Observable<any[]> {
    return this.firestore.collection('usuarios', ref => ref.where('correo', '==', email)).valueChanges();
  }
  
  private async readFile(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  getUserRole(docId: string): Observable<any> {
    return this.firestore.collection('usuarios').doc(docId).valueChanges();
  }

  getListaDeEspera(): Observable<any> {
    return this.firestore.collection('lista-de-espera').valueChanges();
  }

  getDevice(docId: string): Observable<any> {
    return this.firestore.collection('devices').doc(docId).valueChanges();
  }

  async mandarToast(mensaje : string, color : string){
    let toast = this.toast.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      icon: 'alert-outline',
      color: color
    });
    (await toast).present();
  }

  async ingresarCliente(id : string){
    const fecha = new Date();

    console.log(fecha);
    console.log(id);

    await this.firestore.collection('lista-de-espera').doc(id).set({
      id: id,
      assignedTable: "0", // Use null if there's no table assigned yet
      fecha: fecha.toISOString(), // Ensure fecha is stored as a string
    });
  }

  async entrarMesa(mesanro : string, id : string){
    this.firestore.collection("lista-de-espera").doc(id).update({
      assignedTable: mesanro
    });

    return this.firestore.collection('mesas').doc(mesanro).update({
      sentado: id,
      pedido: "stand-by",
    });
  }

  async updateConsulta(mesanro : string, estado : string){
    return this.firestore.collection('mesas').doc(mesanro).update({
      consulta: estado
    });
  }

  async finalizarPedido(pedidoId : string){
    return this.firestore.collection('pedidos').doc(pedidoId).update({
      realizado: true
    });
  }

  async finalizarProducto(id : any, tabla : string){
    return this.firestore.collection(tabla).doc(id).update({
      realizado: true
    });
  }

  checkRealizadoField(pedidoId: string): Observable<boolean> {
    // Query tareasBar collection for documents with matching pedidoId and realizado is false
    const query1 = this.firestore.collection<any>('tareasBar', ref => 
      ref.where('realizado', '==', false).where('pedidoId', '==', pedidoId)).get();
    
    // Query tareasCocina collection for documents with matching pedidoId and realizado is false
    const query2 = this.firestore.collection<any>('tareasCocina', ref => 
      ref.where('realizado', '==', false).where('pedidoId', '==', pedidoId)).get();

    // Combine both queries using forkJoin
    return forkJoin([query1, query2]).pipe(
      map(([result1, result2]) => {
        // Check if any documents with realizado === false exist in either collection
        return result1.docs.length === 0 && result2.docs.length === 0;
      })
    );
  }

  // Otros métodos del servicio según tus necesidades

  async registrarEmpleado(empleado: Usuario, password: string) {
    try {
      if (empleado.correo) {
        // Registrar el usuario en Firebase Authentication
        const credential = await this.afAuth.createUserWithEmailAndPassword(empleado.correo, password);
  
        if (credential && credential.user) {
          // Agregar los datos del empleado a Firestore
          const foto = await this.uploadImage(empleado.foto || "", "usuarios");
  
          await this.firestore.collection('usuarios').doc(credential.user.uid).set({
            nombre: empleado.nombre || '',
            apellido: empleado.apellido || '',
            DNI: empleado.DNI || '',
            CUIL: empleado.CUIL || '',
            correo: empleado.correo,
            foto: foto || '',
            rol: empleado.rol || ''
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
      console.error('Error al registrar el empleado:', error);
      throw error;
    }
  }

  async guardarRespuestas(respuestas: any) {
    return this.firestore.collection('encuestas').add(respuestas);
  }

  getRespuestas(): Observable<any> {
    return this.firestore.collection('encuestas').valueChanges();
  }

  
  async crearMesa(mesa : any) {
    try {
      if (mesa) {
        const foto = await this.uploadImage(mesa.foto || "", "mesas");
        const qr = await this.uploadImage(mesa.qr || "", "mesas");

        await this.firestore.collection('mesas').doc(mesa.numero).set({
          sentado: "nadie",
          pedido: "closed",
          comensales: mesa.comensales || '',
          tipo: mesa.tipo || '',
          foto: foto,
          qr: qr,
          consulta: "cerrada"
        });
        
      } else {
        throw new Error('No se pudo crear el usuario');
      }
  
    } catch (error) {
      console.error('Error al registrar el empleado:', error);
      throw error;
    }
  }

  async agregarProducto(producto : any) {
    try {
      if (producto) {
        const foto1 = await this.uploadImage(producto.imagenes[0] || "", "productos");
        const foto2 = await this.uploadImage(producto.imagenes[1] || "", "productos");
        const foto3 = await this.uploadImage(producto.imagenes[2]|| "", "productos");

        await this.firestore.collection('productos').doc().set({
          categoria: producto.categoria,
          nombre: producto.nombre || '',
          descripcion: producto.descripcion || '',
          precio: producto.precio,
          tiempoEstimado: producto.tiempoEstimado,
          foto1: foto1,
          foto2: foto2,
          foto3: foto3,
        });
        
      } else {
        throw new Error('No se pudo crear el producto');
      }
  
    } catch (error) {
      console.error('Error al registrar el producto:', error);
      throw error;
    }
  }

  consultarEstadoPedido(numeroMesa: string): Observable<{ estado: string }> {
    // Consultar primero en pedidosPendientes
    return this.firestore.collection('pedidosPendientes').doc(numeroMesa).get()
      .pipe(
        switchMap(docSnapshot => {
          if (docSnapshot.exists) {
            return of({ estado: 'Pendiente' });
          } else {
            // Si no está en pedidosPendientes, consultar en pedidos
            return this.firestore.collection('pedidos').doc(numeroMesa).get()
              .pipe(
                map(docSnapshot => {
                  if (docSnapshot.exists) {
                    const pedido = docSnapshot.data() as any; // Otra opción es usar un tipo específico si lo conoces
                    const realizado = pedido.realizado;
                    const estado = realizado ? 'Listo para entregar' : 'Preparando';
                    return { estado };
                  } else {
                    return { estado: 'No encontrado' };
                  }
                })
              );
          }
        })
      );
  }
}
