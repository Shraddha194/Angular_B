import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/app-validators';

import { BnsServiceService } from 'src/app/pages/user-management/bns-service.service';
import { EmailDetails } from 'src/app/pages/user-management/models/email-details';


@Component({
  selector: 'app-top-info-content',
  templateUrl: './top-info-content.component.html',
  styleUrls: ['./top-info-content.component.scss']
})
export class TopInfoContentComponent implements OnInit {
  @Input('showInfoContent') showInfoContent:boolean = false;
  @Output() onCloseInfoContent: EventEmitter<any> = new EventEmitter();
  contactForm: FormGroup;
  emailData:EmailDetails;
  public userImage=localStorage.getItem('logo_path');
  
  constructor(public formBuilder: FormBuilder,public bnsservice:BnsServiceService) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, emailValidator])],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  public onContactFormSubmit(values:Object):void {
    this.emailData={"from":"rajatshah7795@yahoo.com","to":this.contactForm.value.email,"subject":this.contactForm.value.subject,"text":this.contactForm.value.message};
    this.bnsservice.sendEmail(this.emailData).subscribe((data)=>{
      console.log(data);
    })
  }

  public closeInfoContent(event){
    this.onCloseInfoContent.emit(event);
  }

}
