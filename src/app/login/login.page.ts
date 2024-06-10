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

  d1 : boolean = false;
  d2: boolean = false;
  d3 : boolean = false;

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


  fast1() {
    this.credentials.controls['email'].setValue('admin@admin.com');
    this.credentials.controls['password'].setValue('111111');
    this.d1 = true;
    this.d2 = false;
    this.d3 = false;
  }
  
  fast2() {
    this.credentials.controls['email'].setValue('invitado@invitado.com');
    this.credentials.controls['password'].setValue('222222');
    this.d1 = false;
    this.d2 = true;
    this.d3 = false;
  }
  
  fast3() {
    this.credentials.controls['email'].setValue('tester@tester.com');
    this.credentials.controls['password'].setValue('555555');
    this.d1 = false;
    this.d2 = false;
    this.d3 = true;
  }
  
}