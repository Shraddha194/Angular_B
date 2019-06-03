import { Directive } from '@angular/core';
import { AsyncValidator } from '@angular/forms';
import { BnsServiceService } from '../bns-service.service';
import { map, debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appCustomEmailAsyncDirective]'
})
export class CustomEmailAsyncDirectiveDirective implements AsyncValidator {
  items:any;
  constructor(private hotelService:BnsServiceService ){}
  validate(control: import("@angular/forms").AbstractControl): Promise<import("@angular/forms").ValidationErrors> | import("rxjs").Observable<import("@angular/forms").ValidationErrors> {

      this.items={"emailId":control.value};
      return this.hotelService.verifyEmail(this.items).pipe( debounceTime(5000),
        map(users=>
          {
            this.items=users;
            
            return this.items.length > 0 ?null:{isEmailUnique:true};
          })
      )
  }
  
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error("Method not implemented.");
  }


}
