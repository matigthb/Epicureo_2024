import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Usuario } from '../clases/usuario';
<<<<<<< HEAD
=======
import { CustomValidators } from '../validators/custom-validators';
>>>>>>> cacc406d9b6dcdcb7e0ce33d717d64bc7ba86c2b

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
<<<<<<< HEAD
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
=======
    private dataService: DataService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, CustomValidators.noNumbers, CustomValidators.minLength(3)]],
      apellido: ['', [Validators.required, CustomValidators.noNumbers, CustomValidators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern("[0-9]{8}")]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required],
      foto: ['', Validators.required]
    });
  }

>>>>>>> cacc406d9b6dcdcb7e0ce33d717d64bc7ba86c2b
  ngOnInit() {}

  async registrarCliente() {
    if (this.registroForm.valid) {
      const cliente: Usuario = {
        nombre: this.registroForm.value.nombre,
        apellido: this.registroForm.value.apellido,
        DNI: this.registroForm.value.dni,
        correo: this.registroForm.value.correo,
<<<<<<< HEAD
        foto: this.registroForm.value.foto // Ajusta cómo manejas la foto si es necesario
=======
        foto: this.registroForm.value.foto
>>>>>>> cacc406d9b6dcdcb7e0ce33d717d64bc7ba86c2b
      };

      const password = this.registroForm.value.contrasena;

      try {
        const resultado = await this.dataService.registrarCliente(cliente, password);
        console.log(resultado);
<<<<<<< HEAD
        // Aquí puedes manejar el éxito del registro, como redirigir a otra página o mostrar un mensaje
      } catch (error) {
        console.error('Error en el componente de registro:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje al usuario
      }
    } else {
      // El formulario es inválido, puedes mostrar mensajes de validación si es necesario
=======
      } catch (error) {
        console.error('Error en el componente de registro:', error);
      }
    } else {
      // Manejar el caso donde el formulario no es válido
>>>>>>> cacc406d9b6dcdcb7e0ce33d717d64bc7ba86c2b
    }
  }
}
