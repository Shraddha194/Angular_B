import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Settings } from 'http2';
import { AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';
import { BnsServiceService } from '../bns-service.service';
import { CustomAsyncEmailValidatorDirective } from '../asynchronous-validators/custom-async-email-validator.directive';
import { Editprofile } from '../models/editprofile';
import { HttpEventType } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { InformativeDialogBoxComponent } from 'src/app/informative-dialog-box/informative-dialog-box.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  public form:FormGroup;
  public settings: Settings;
  bnsFormData:any;
  public imagePath;
  imgURL: any;
  mimeType:any;
  public message: string;
  public reader=new FileReader();
  selectedprofile: File = null;
  select:boolean=false;
  profile_pathTemp:string;
  profileData:Editprofile;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router,
    public _userData:BnsServiceService,public dialog:MatDialog) { }

  ngOnInit() {
    this.form = this.fb.group({
      'firstname': [localStorage.getItem('bnsFirstName'), Validators.compose([Validators.required, Validators.minLength(3)])],
      'lastname': [localStorage.getItem('bnsLastName'), Validators.compose([Validators.required, Validators.minLength(3)])],
      'emailId': [localStorage.getItem('emailId'),[Validators.required,Validators.email]],
      'contactno': [localStorage.getItem('contact'), Validators.compose([Validators.required, Validators.minLength(10),Validators.maxLength(10)])],
      'uploadFile':[null]
    });
    this.profile_pathTemp=localStorage.getItem('logo_path');
  }
  onprofileSelected(value)
  {
    this.select=true;
    this.selectedprofile = <File>value.target.files[0];
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
  goHome()
  {
    this.router.navigate(['/']);
  }
  onSubmit()
  {
    if(this.selectedprofile===null)
    {
        this.profileData=new Editprofile(
          this.form.value.firstname,
          this.form.value.lastname,
          this.form.value.emailId,
          this.form.value.contactno
        );
        this._userData.updateProfile(this.profileData).subscribe((data:any)=>
          {
            if (data.affectedRows === 1){
              const  dialogref=this.dialog.open(InformativeDialogBoxComponent, {
                width: '250px',
                height:'150px',
                data: "Data Updated Successfully",
                hasBackdrop:true,
              });
              dialogref.afterClosed().subscribe(result=>
                {
                  if(result)
                  {
                    this.router.navigate(['/hotel-management']);
                  }
                })
              localStorage.setItem('bnsFirstName',this.form.value.firstname);
              localStorage.setItem('bnsLastName',this.form.value.lastname);
              localStorage.setItem('emailId',this.form.value.emailId);
              localStorage.setItem('contact',this.form.value.contactno);
             
          
              }
          })
    }
    else
    {
      const fd = new FormData();
      fd.append("firstname",this.form.value.firstname);
      fd.append("lastname",this.form.value.lastname);
      fd.append("emailId",this.form.value.emailId);
      fd.append("contactno",this.form.value.contactno);
      fd.append("logo_path", this.selectedprofile, this.selectedprofile.name);
      this._userData.updateProfileWithPhoto(fd).subscribe(
        event => {
          if (event.type == HttpEventType.Response) {
            if (event.body.valueOf() > 0) {
              const  dialogref=this.dialog.open(InformativeDialogBoxComponent, {
                width: '250px',
                height:'150px',
                data: "Data Updated Successfully",
                hasBackdrop:true,
              });
              dialogref.afterClosed().subscribe(result=>
                {
                  if(result)
                  {
                    this.router.navigate(['/hotel-management']);
                  }
                })
              localStorage.setItem('bnsFirstName',this.form.value.firstname);
              localStorage.setItem('bnsLastName',this.form.value.lastname);
              localStorage.setItem('emailId',this.form.value.emailId);
              localStorage.setItem('contact',this.form.value.contactno);
              localStorage.setItem('logo_path',this.form.value.logo_path);
            } else {
              console.log("error");
            }
          }
        },
        function(err) {},
        function() {}
      );
      
    }
  }

}
