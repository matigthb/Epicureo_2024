// src/app/app.module.ts

import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { FirestoreModule, provideFirestore, getFirestore } from '@angular/fire/firestore';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { ChatPage } from './chat/chat.page';
import { CartService } from './services/cart.service'; 


register();

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyAsOIRK4hINvT2YfMMCfTMcLVBHizF77rU",
      authDomain: "epicureo-b71d4.firebaseapp.com",
      projectId: "epicureo-b71d4",
      storageBucket: "epicureo-b71d4.appspot.com",
      messagingSenderId: "536628202723",
      appId: "1:536628202723:web:9dd6b02ed0767e860649d6"
    }),
    AngularFirestoreModule,// Add this for Firestore
    AngularFireAuthModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Agregar CUSTOM_ELEMENTS_SCHEMA aquí
  providers: [provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy  }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
