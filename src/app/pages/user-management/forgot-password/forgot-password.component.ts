import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Settings } from 'http2';

import { Router } from '@angular/router';
import { ForgotPasswordClass } from '../models/forgot-password-class';
import { BnsServiceService } from '../bns-service.service';
import { CustomEmailAsyncDirectiveDirective } from '../asynchronous-validators/custom-email-async-directive.directive';
import {  MatDialog } from '@angular/material';
import { AppSettings } from 'src/app/app.settings';
import { InformativeDialogBoxComponent } from 'src/app/informative-dialog-box/informative-dialog-box.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers:[{provide:NG_ASYNC_VALIDATORS,useExisting:ForgotPasswordComponent,multi:true}]
})
export class ForgotPasswordComponent {
  public form:FormGroup;
  public settings: Settings;
  items:any;
  bnsUser:ForgotPasswordClass;
  constructor(public appSettings:AppSettings,
    private dialog:MatDialog, public fb: FormBuilder, public router:Router,private hotelService:BnsServiceService){
    this.settings = this.appSettings.settings; 
    
    this.form = this.fb.group({
      'emailId': [null, [Validators.required,Validators.pattern('^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+)\.([a-z]{2,8})(\.[a-z{2,8}])?$')],[new CustomEmailAsyncDirectiveDirective(this.hotelService)]],
 
    });
  }


  public onSubmit():void {
    this.bnsUser={'emailId':this.form.value.emailId};
    this.hotelService.forgotPassword(this.bnsUser).subscribe((data:any)=>{
      if(data.affectedRows==1)
      {
        const dialogref=this.dialog.open(InformativeDialogBoxComponent, {
          width: '250px',
          height:'150px',
          data: "Password has sent to your mail id successfully!!",
          hasBackdrop:true
        });
        dialogref.afterClosed().subscribe(result=>{
          if(result)
          {
            this.router.navigate(['/login']);
          }
        })
        
       }
      else
      {
        this.router.navigate(['/error']);
      }
    })
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }

      
    //  return this.hotelService.verifyEmail(this.items).pipe(
    //   map(users=>{
    //     console.log(users);
    //     return users && users.length>0 ?{isEmailUnique:true}:null;
    //   })
    //  )
   

}
