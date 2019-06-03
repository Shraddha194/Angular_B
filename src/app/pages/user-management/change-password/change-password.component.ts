import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Settings } from 'http2';
import { AppSettings } from '../../../app.settings';
import { Router } from '@angular/router';
import { BnsUserAuth } from '../bns-user-auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BnsServiceService } from '../bns-service.service';
import {  matchingPasswords } from '../../../theme/utils/app-validators';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  ngOnInit(): void {
    
  }
  flag:number;
  bnsUser:BnsUserAuth;
  public form:FormGroup;
  bnsInvalidOldPassword:boolean=false;
  bnsPasswordAndConfirmPasswordMismatch:boolean=false;
  
 
  public settings: Settings;
  constructor(public appSettings:AppSettings, public bnsSnackbar: MatSnackBar,public fb: FormBuilder, public router:Router,
    public _data:BnsServiceService){
    this.settings = this.appSettings.settings;
    
    this.form = this.fb.group({
      'emailId': [localStorage.getItem('emailId'), Validators.compose([Validators.required])],
      'oldpassword': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(8),Validators.pattern('(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*')])],
      'confirmpassword':[null,Validators.compose([Validators.required,Validators.minLength(8),Validators.pattern('(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*')])]
    },{validators:matchingPasswords('password','confirmpassword')});
  }

  public onSubmit() {
    let emailId = this.form.controls['emailId'].value;
    let oldpassword = this.form.controls['oldpassword'].value;
    let confirmpassword=this.form.controls['confirmpassword'].value;
    let password=this.form.controls['password'].value;
      this.bnsUser={"emailId":emailId,"oldPassword":oldpassword, "password":this.form.value.confirmpassword}
      if(password === confirmpassword){
        this._data.changePassword(this.bnsUser).subscribe((data: any) => {
            if (data.affectedRows === 1){
              this.bnsSnackbar.open("Password changed successfully", "", {
                duration: 5000,
                // here specify the position
                verticalPosition: 'top'
              });
              this.router.navigate(['/']);
            }
          });
        }
      
        else{
          alert('Enter Valid old password');
        }
      
  }
      
  

     
  
  goHome(){
    this.router.navigate(['/']);
  }
 
  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

}
