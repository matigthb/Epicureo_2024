import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private serverUrl = 'https://bb30-181-116-176-62.ngrok-free.app'; // Replace with your server URL

  constructor(private http: HttpClient, private toast : ToastController) { }

  sendNotification(token: string, title: string, body: string): Observable<any> {
    const url = `${this.serverUrl}/notify`;
    const payload = { token, title, body };
    return this.http.post(url, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  sendRoleNotification(roles: string[], title: string, body: string): Observable<any> {
    const url = `${this.serverUrl}/notify-role`;
    const payload = { title, body, roles };
    return this.http.post(url, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  sendMail(aceptacion: boolean, nombreUsuario: string, mail: string): Observable<any> {
    const url = `${this.serverUrl}/send-mail`;
    const payload = { aceptacion, nombreUsuario, mail };
    return this.http.post(url, payload, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    // Log the error to the console
    console.error('An error occurred:', error);
    // Show a toast message for the error
    this.toast.create({
      message: 'An error occurred while sending the request. Please try again.',
      duration: 3000,
      color: 'danger'
    }).then(toast => toast.present());
    // Return an observable with an error message
    return throwError('Something went wrong; please try again later.');
  }
}
