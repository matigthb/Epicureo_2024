import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials!: FormGroup;
  showPassword = false;
  showMenu: boolean = false;
  showMenu2: boolean = false;
  bandera1: boolean = false;
  bandera2: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    if(this.credentials?.valid){
      console.log("VALID");
      const user = await this.authService.login(this.credentials.value.email, this.credentials.value.password).catch((error) =>{
        console.log(error);
        loading.dismiss();
      })

      if(user){
        this.credentials.controls['email'].setValue('');
        this.credentials.controls['password'].setValue('');
        loading.dismiss();
        this.router.navigateByUrl('/home');
      }
      else
      {
        console.log("provide correct values");
      }
    }
    else
    {
      loading.dismiss();
      console.log("provide correct values");
      this.credentials.controls['email'].setValue('');
      this.credentials.controls['password'].setValue('');
    }
  }

  // Getter for easy access to form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }


  fastDueno() {
    this.showMenu = false;
    this.showMenu2 = false;
    this.credentials.controls['email'].setValue('dueño@dueño.com');
    this.credentials.controls['password'].setValue('111111');
  }
  
  fastSup() {
    this.showMenu = false;
    this.showMenu2 = false;
    this.credentials.controls['email'].setValue('super@super.com');
    this.credentials.controls['password'].setValue('222222');
  }
  
  fastMaitre() {
    this.showMenu = false;
    this.showMenu2 = false;
    this.credentials.controls['email'].setValue('maitre@maitre.com');
    this.credentials.controls['password'].setValue('555555');
  }

  fastMozo() {
    this.showMenu = false;
    this.showMenu2 = false;
    this.credentials.controls['email'].setValue('mozo@mozo.com');
    this.credentials.controls['password'].setValue('555555');
  }

  fastCocinero() {
    this.showMenu = false;
    this.showMenu2 = false;
    this.credentials.controls['email'].setValue('cocinero@cocinero.com');
    this.credentials.controls['password'].setValue('555555');
  }

  fastBartender() {
    this.showMenu = false;
    this.showMenu2 = false;
    this.credentials.controls['email'].setValue('bartender@bartender.com');
    this.credentials.controls['password'].setValue('555555');
  }

  fastRegistrado() {
    this.showMenu = false;
    this.showMenu2 = false;
    this.credentials.controls['email'].setValue('registrado@registrado.com');
    this.credentials.controls['password'].setValue('555555');
  }

  fastAnon() {
    this.showMenu = false;
    this.showMenu2 = false;
    this.credentials.controls['email'].setValue('anonimo@anonimo.com');
    this.credentials.controls['password'].setValue('555555');
  }

  

  menu(){
    this.showMenu = !this.showMenu;
    this.showMenu2 = false;
    this.bandera1= true;
  }

  menu2(){
    this.showMenu = false;
    this.showMenu2 = !this.showMenu2;
    this.bandera2= true;
  }
  
}