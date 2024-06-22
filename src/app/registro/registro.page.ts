import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Usuario } from '../clases/usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
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
  ngOnInit() {}

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
}
