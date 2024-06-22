import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Usuario } from '../clases/usuario';
import { CustomValidators } from '../validators/custom-validators';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
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

  ngOnInit() {}

  async registrarCliente() {
    if (this.registroForm.valid) {
      const cliente: Usuario = {
        nombre: this.registroForm.value.nombre,
        apellido: this.registroForm.value.apellido,
        DNI: this.registroForm.value.dni,
        correo: this.registroForm.value.correo,
        foto: this.registroForm.value.foto
      };

      const password = this.registroForm.value.contrasena;

      try {
        const resultado = await this.dataService.registrarCliente(cliente, password);
        console.log(resultado);
      } catch (error) {
        console.error('Error en el componente de registro:', error);
      }
    } else {
      // Manejar el caso donde el formulario no es válido
    }
  }
}
