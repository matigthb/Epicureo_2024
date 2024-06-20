// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {}

  rol : string = "no logueado";

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      throw error;
    }
  }

  getUser() {
    return this.afAuth.authState;
  }
}
