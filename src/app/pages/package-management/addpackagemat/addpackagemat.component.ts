import { Component, OnInit } from '@angular/core';
import { BnsPackageService } from 'src/app/pages/package-management/bns-package.service';
import { Router } from '@angular/router';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { HotelService } from '../models/servicedetails';
import { HotelSubscriptionType } from '../models/hotel-subscription-type';
import { AddSubscription } from '../models/add-package';
import { SubscriptionServiceAudit } from '../models/subscription-service-audit';
import { SubscriptionService } from '../models/subscription-service';
import { InformativeDialogBoxComponent } from 'src/app/informative-dialog-box/informative-dialog-box.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-addpackagemat',
  templateUrl: './addpackagemat.component.html',
  styleUrls: ['./addpackagemat.component.scss']
})
export class AddpackagematComponent implements OnInit {
  constructor(private hotelservice: BnsPackageService, private router: Router,private dialog:MatDialog) { }
  get service_id() {
    return this.addPackageForm.get("service_id");
  }
  get service() { return this.addPackageForm.get("all_service") as FormArray; }

  addPackageForm: FormGroup;
  hotelservicesarr: HotelService[];
  hotelServiceArray: HotelService[];
  subtypearr: HotelSubscriptionType[];
  selectedservice: number[] = [];
  
  newpackage: AddSubscription;
  newpackageaudit: SubscriptionServiceAudit;
  newpackageservice: SubscriptionService;
  sound: string;
  count = 0;
  dt = new Date();

  ngOnInit() {
    this.addPackageForm = new FormGroup({
      sub_type: new FormControl("", [Validators.required]),
      subscription: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]*$")
      ]),
      //  service_id: new FormControl("", [Validators.required]),
      all_service: new FormArray([]),
      payable_amt: new FormControl("", [Validators.required])
    });

    this.hotelservice.getAllHotelServices().subscribe(
      (data: any) => {
        this.hotelservicesarr = data;
        this.hotelServiceArray = data;
        for (const allservices of this.hotelServiceArray) {
          const control = new FormControl();
          (this.addPackageForm.get("all_service") as FormArray).push(control);
        }
      },
      function (err) {
        
      },
      function () {
        
      }
    );
    this.hotelservice.getAllPackageType().subscribe(
      (data: any) => {
        this.subtypearr = data;
      },
      function (err) {
        console.log(err);
      },
      function () {
        console.log("call complete");
      }
    );
  }
  servicecheckbox(service_id: number) {
    if (this.selectedservice.find(x => x === service_id)) {
      this.selectedservice.splice(this.selectedservice.indexOf(service_id), 1);
    } else {
      this.selectedservice.push(service_id);
    }
  }
  onPackageAdd() {
    // console.log(this.id);
    this.newpackage = new AddSubscription(
      this.addPackageForm.value.sub_type,
      this.addPackageForm.value.subscription,
      1,
      this.addPackageForm.value.payable_amt,
      parseInt(localStorage.getItem("id")),
      this.dt
    );
    this.hotelservice.addPackage(this.newpackage).subscribe((data: any) => {
      if (data.affectedRows === 1) {

        for (const service of this.selectedservice) {
          this.newpackageaudit = new SubscriptionServiceAudit(
            data.insertId,
            service,
            1,
            1,
            this.dt
          );
          this.hotelservice
            .addPackageAudit(this.newpackageaudit)
            .subscribe((data1: any) => {
              if (data1.affectedRows === 1) {
                this.count += 1;
                for (const service2 of this.selectedservice) {
                  this.newpackageservice = new SubscriptionService(
                    data.insertId,
                    service2,
                    1,
                    1,
                    this.dt
                  );
                  this.hotelservice
                    .addPackageServices(this.newpackageservice)
                    .subscribe((data2: any) => {
                      if (data2.affectedRows === 1) {
                      }

                    });
                }
              }
            });
        }
        const  dialogref=this.dialog.open(InformativeDialogBoxComponent, {
          width: '250px',
          height:'150px',
          data: "Successfully added record",
          hasBackdrop:true
        });
      dialogref.afterClosed().subscribe(result=>
        {
          if(result)
          {
            this.router.navigate(["/package-management"]);
          }
        })

      } else {
        this.dialog.open(InformativeDialogBoxComponent, {
          width: '250px',
          height:'150px',
          data: "something went wrong",
          hasBackdrop:true
        });
      
      }
    });
    

  }

  backToPackage() {
    this.router.navigate(["/package-management"]);
  }
}
