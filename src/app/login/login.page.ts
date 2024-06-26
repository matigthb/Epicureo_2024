import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { NotificationService } from '../services/notification.service';
import { DataService } from '../services/data.service';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

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
  rol: any;
  
  constructor(
    private notificationService: NotificationService,
    private plt : Platform,
    private fb: FormBuilder,
    private authService: AuthService,
    private data : DataService,
    private alertController: AlertController,
    private toast : ToastController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    
    if (permStatus.receive !== 'granted') { 
      console.log('User denied permissions!');
    }

    await PushNotifications.register();
  }
  
  async addListeners(uid : string, rol : string) {
    await PushNotifications.addListener('registration', async (token) => {
      await this.data.registerDevice(token.value, uid, rol);
    });

    await PushNotifications.addListener('registrationError', async (err) => { 
      let toast = this.toast.create({
        message: err.error,
        duration: 3000,
        position: 'top',
        icon: 'alert-outline',
        color: 'danger'
      });
      (await toast).present();

      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', async (notification) => {
      let toast = this.toast.create({
        message: "Push notification received",
        duration: 1000,
        position: 'top',
        icon: 'alert-outline',
        color: 'success'
      });
      (await toast).present();

      
    console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log(
      'Push notification action performed',
      notification.actionId,
      notification.inputValue
      );
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
        let uid = await this.authService.getUserUid() || "";
        this.checkUser().then(isUserUnique => {
          if(!isUserUnique)
          {
            this.data.mandarToast("Su cuenta aún no fue aprobada.", "danger");
            this.credentials.controls['email'].setValue('');
            this.credentials.controls['password'].setValue('');
            loading.dismiss();
            return;
          }
          else
          {
            this.data.getUserRole(uid).subscribe(async user => {
              this.authService.rol = user?.rol;
              console.log(Capacitor.isNativePlatform())
              if (Capacitor.isNativePlatform()){
                await this.addListeners(uid,this.authService.rol);
                await this.registerNotifications();
              }
            });
    
            this.credentials.controls['email'].setValue('');
            this.credentials.controls['password'].setValue('');
            loading.dismiss();
            this.router.navigateByUrl('/home');
          }
        });
      }
      else
      {
        this.data.mandarToast("No encontramos ninguna cuenta con esas credenciales.", "danger");
      }
    }
    else
    {
      loading.dismiss();
      this.data.mandarToast("Debe ingresar credenciales válidas para iniciar sesión.", "danger");
      this.credentials.controls['email'].setValue('');
      this.credentials.controls['password'].setValue('');
    }
  }

  checkUser(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.data.getUserByEmail(this.credentials.value.email).subscribe(users => {
        if (users.length > 0) {
          resolve(false); // User exists
        } else {
          resolve(true); // User does not exist
        }
      }, error => {
        reject(error); // Handle errors if needed
      });
    });
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
    this.credentials.controls['email'].setValue('dueno@dueno.com');
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

  async fastAnon() {
    let asdasd : boolean = true;
    this.showMenu = false;
    this.showMenu2 = false;
    const loading = await this.loadingController.create();
    await loading.present();
    this.credentials.controls['email'].setValue('');
    this.credentials.controls['password'].setValue('');
    setTimeout(() => {
      loading.dismiss();
      this.router.navigateByUrl('/home');
    }, 2000);
    
    this.authService.rol = "anon";
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
  
  reg(){
    this.router.navigateByUrl("/registro");
  }
}