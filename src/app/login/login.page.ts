import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, AnimationController, IonModal, LoadingController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { NotificationService } from '../services/notification.service';
import { DataService } from '../services/data.service';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  
  imageUrl = "../../assets/anonymous.png"
  @ViewChild("modal") modal: IonModal | undefined ;
  nombreAnon : string = "";
  apellidoAnon : string = "";

  
  constructor(
    private notificationService: NotificationService,
    private plt : Platform,
    private fb: FormBuilder,
    private authService: AuthService,
    private data : DataService,
    private alertController: AlertController,
    private toast : ToastController,
    private router: Router,
    private animationCtrl: AnimationController,
    private loadingController: LoadingController
  ) {}

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '1', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  
  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri, // Use Uri instead of Base64
      source: CameraSource.Camera
    });
  
    const fecha = new Date(); // replace with actual date
    const uidUser = await this.authService.getUserUid() || '';
  
    if (image.webPath) {
      console.log("TENGO");
      this.imageUrl = image.webPath;
      //this.uploadImage(image.webPath, fecha, uidUser);
    } else {
      console.log("NO TENGO");
    }
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
              this.authService.isLogging = false;
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

  anon(){
    this.modal?.present();
  }

  generateRandomEmail() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 8; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const randomEmail = `${randomString}@example.com`;
    return randomEmail;
  }

  async iniciarAnonimo(){
    if(this.imageUrl == "../../assets/anonymous.png")
    {
      this.data.mandarToast("Debe tomar una foto de perfil.", "danger");
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    const anon = {
      DNI: "anonimo",
      apellido: this.apellidoAnon,
      correo: this.generateRandomEmail(),
      foto: this.imageUrl,
      nombre: this.nombreAnon,
      rol: "anonimo"
    }

    await this.data.ingresarAnonimo(anon);

    const user = await this.authService.login(anon.correo, "anonimo").catch((error) =>{
      console.log(error);
      loading.dismiss();
    })
    if(user){
      let uid = await this.authService.getUserUid() || "";
          this.authService.rol = "anonimo";
          this.authService.isLogging = false;
          console.log(Capacitor.isNativePlatform())
          if (Capacitor.isNativePlatform()){
            await this.addListeners(uid,this.authService.rol);
            await this.registerNotifications();
          }
          this.modal?.dismiss();
          loading.dismiss();
          this.router.navigateByUrl('/home');
      }
    
  }

  goBack(){
    this.modal?.dismiss();
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
    this.showMenu = false;
    this.showMenu2 = false;
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authService.login("ja6pc4kg@example.com", "anonimo").catch((error) =>{
      console.log(error);
      loading.dismiss();
    })
    if(user){
      let uid = await this.authService.getUserUid() || "";
          this.authService.rol = "anonimo";
          this.authService.isLogging = false;
          console.log(Capacitor.isNativePlatform())
          if (Capacitor.isNativePlatform()){
            await this.addListeners(uid,this.authService.rol);
            await this.registerNotifications();
          }
          loading.dismiss();
          this.router.navigateByUrl('/home');
      }
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