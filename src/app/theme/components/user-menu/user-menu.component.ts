import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';
import { BnsServiceService } from 'src/app/pages/user-management/bns-service.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  fname:string;
  lname:string;
  public userImage=localStorage.getItem('logo_path');
  constructor(private router:Router,private service:BnsServiceService) { }

  ngOnInit() {
    this.fname=localStorage.getItem("bnsFirstName");
    this.lname=localStorage.getItem("bnsLastName");  
    
  }
  changePass()
  {
    this.router.navigate(['/changePassword']);
  }
  Profile()
  {
    this.router.navigate(['/profile']);
  }
  onLogout()
  {
    
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
