import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-altas',
  templateUrl: './altas.page.html',
  styleUrls: ['./altas.page.scss'],
})
export class AltasPage implements OnInit {

  constructor(private router: Router, public auth : AuthService, private data : DataService) { }
  
  ngOnInit() {
  }

  go(url : string){
    this.router.navigateByUrl(url);
  }

  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
}
