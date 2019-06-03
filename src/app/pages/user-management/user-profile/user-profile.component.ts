import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
userImage:string=localStorage.getItem('logo_path');
name:string=localStorage.getItem('bnsFirstName')+" "+localStorage.getItem('bnsLastName');
email:string=localStorage.getItem('emailId');
contact:string=localStorage.getItem('contact');
id:number=parseInt(localStorage.getItem('id'));
  constructor(public router:Router) { }

  ngOnInit() {
  }
  editProfiles()
  {
    this.router.navigate(['/editProfile']);
  }
}
