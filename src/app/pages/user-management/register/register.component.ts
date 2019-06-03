import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NG_ASYNC_VALIDATORS} from '@angular/forms';
import {  matchingPasswords } from '../../../theme/utils/app-validators';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { HttpEventType } from '@angular/common/http';
import { BnsServiceService } from '../bns-service.service';
import { CustomAsyncEmailValidatorDirective } from '../asynchronous-validators/custom-async-email-validator.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers:[{provide:NG_ASYNC_VALIDATORS,useExisting:RegisterComponent,multi:true}]
})
export class RegisterComponent {
  public form:FormGroup;
  public settings: Settings;
  bnsFormData:any;
  public imagePath;
  imgURL: any;
  mimeType:any;
  public message: string;
  public reader=new FileReader();
  selectedprofile: File = null;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router,
    public _userData:BnsServiceService){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'firstname': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'lastname': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      'emailId': [null,[Validators.required,Validators.email],[new CustomAsyncEmailValidatorDirective(this._userData)]],
      'contactno': [null, Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(10)])],
      'password': [null, Validators.compose([Validators.required,Validators.pattern('(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*')])],
      'confirmPassword': [null, Validators.compose([Validators.required,Validators.pattern('(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*')])],
      'uploadFile':[null,Validators.required]
    },{validator: matchingPasswords('password', 'confirmPassword')});
  }
  onprofileSelected(value)
  {
    this.selectedprofile = <File>value.target.files[0];
   
    this.mimeType = this.selectedprofile.type;
    if(this.mimeType.match(/image\/*/)===null)
    {
      this.message = "Only images are supported.";
      return;
    }
    else  if(this.selectedprofile.size>=500000)
    {
      this.message = "Image should not greater than 500KB";
      return;
    }
    else
    {
      this.message = null;
    }
    this.imagePath = this.selectedprofile;
    this.reader.readAsDataURL(this.selectedprofile); 
    this.reader.onload = (_event) => { 
      this.imgURL = this.reader.result; 
    }
  }
  public onSubmit(values:Object):void {
    const fd = new FormData();
    fd.append("firstname",this.form.value.firstname);
    fd.append("lastname",this.form.value.lastname);
    fd.append("emailId",this.form.value.emailId);
    fd.append("contactno",this.form.value.contactno);
    fd.append("password",this.form.value.password);

    fd.append("logo_path", this.selectedprofile, this.selectedprofile.name);
   this._userData.addUser(fd).subscribe(
     event=>{
      if (event.type == HttpEventType.Response) {
        if (event.body.valueOf()>0) {
         
      }
     }
    }
   );
   if (this.form.valid) {
      this.router.navigate(['/login']);
    }
    // this.bnsFormData = {"id":0, "firstname":this.form.value.firstname,"lastname":this.form.value.lastname,"emailId":this.form.value.emailId,"contactno":this.form.value.contactno,"password":this.form.value.password,"created_Date":new Date()};
    // this._userData.addUser(this.bnsFormData).subscribe(
    //   (data:any)=>{
    //   }
    // );
    // if (this.form.valid) {
    //   this.router.navigate(['/login']);
    // }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
 
}