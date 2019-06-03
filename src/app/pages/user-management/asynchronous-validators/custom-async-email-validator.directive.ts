import { Directive } from '@angular/core';
import { AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { BnsServiceService } from '../bns-service.service';
import { map, debounce, debounceTime } from 'rxjs/operators';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Directive({
  selector: '[appCustomAsyncEmailValidator]'
  
})
export class CustomAsyncEmailValidatorDirective implements AsyncValidator {
  items:any;
  constructor(private bnsHotelService:BnsServiceService) { }
  validate(control: import("@angular/forms").AbstractControl): Promise<import("@angular/forms").ValidationErrors> | import("rxjs").Observable<import("@angular/forms").ValidationErrors> {
    this.items={"emailId":control.value};
      return this.bnsHotelService.verifyEmail(this.items).pipe(debounceTime(5000),
        map(users=>
          {
            this.items=users;
            return this.items.length > 0 ?{isEmailMultiple:true}:null;
          })
      )
  }
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error("Method not implemented.");
  }

  

}
