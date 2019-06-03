import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { emailValidator } from "../../../theme/utils/app-validators";
import { AppSettings } from "../../../app.settings";
import { Settings } from "../../../app.settings.model";
import { CookieService } from "ngx-cookie-service";
import { BnsServiceService } from "../bns-service.service";
import { MatSlideToggleChange } from "@angular/material";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./style.css"]
})
export class LoginComponent {
  emailId: string;
  fname: string;
  lname: string;
  public form: FormGroup;
  public settings: Settings;
  cookieExists: boolean;
  bnsInvalidAuthentication: boolean = false;
  constructor(
    public appSettings: AppSettings,
    public fb: FormBuilder,
    public router: Router,
    public bnsservice: BnsServiceService,
    private bnscookieservice: CookieService
  ) {
    
    this.settings = this.appSettings.settings;
    
    this.cookieExists = this.bnscookieservice.check("emailId");
    //form builderobject
    localStorage.clear();
  
    if (this.cookieExists == false) {
      this.form = this.fb.group({
        emailId: [
          null,
          Validators.compose([Validators.required, emailValidator])
        ],
        password: [
          null,
          Validators.compose([Validators.required, Validators.minLength(6)])
        ],
        rememberMe: false
      });
    } else {
      this.form = this.fb.group({
        emailId: [
          this.bnscookieservice.get("emailId"),
          Validators.compose([Validators.required, emailValidator])
        ],
        password: [
          this.bnscookieservice.get("password"),
          Validators.compose([Validators.required, Validators.minLength(6)])
        ],
        rememberMe: true
      });
    }
  }
public trigger(event: MatSlideToggleChange)
{
  
  if(this.form.value.rememberMe===false)
  {
    this.bnscookieservice.delete('emailId');
  }
}
  public onSubmit(): void {
    let bnsLoginFormValue = this.form.value;
    if (this.form.valid) {
      this.bnsservice.login(bnsLoginFormValue).subscribe((data: any[]) => {
        if (data.length == 1) {
          this.bnsInvalidAuthentication = false;
          this.emailId = data[0].emailId;

          localStorage.setItem("emailId", this.emailId);
          this.bnsservice.getUserByEmail(bnsLoginFormValue).subscribe(data => {
          
            this.fname = data[0].firstname;
            this.lname = data[0].lastname;
            
            localStorage.setItem("bnsFirstName", this.fname);
            localStorage.setItem("bnsLastName", this.lname);
            localStorage.setItem("logo_path", data[0].logo_path);
            localStorage.setItem("id",data[0].id);
            localStorage.setItem("contact",data[0].contactno);
        
            if (this.form.value.rememberMe == true) {
              this.bnscookieservice.set("emailId", this.emailId);
              this.bnscookieservice.set("password", this.form.value.password);
            } else {
              this.bnscookieservice.delete("emailId");
              this.bnscookieservice.delete("password");
            }
            this.router.navigateByUrl(this.bnsservice.redirectURL);
          });

        } else {
          this.bnsInvalidAuthentication = true;
        }
      });
    }
    if (this.bnsInvalidAuthentication == false) {
      if (this.bnsservice.redirectURL != null) {
        this.router.navigate([this.bnsservice.redirectURL]);
      } else {
        this.router.navigate(["/"]);
      }
    }
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;
  }
}
