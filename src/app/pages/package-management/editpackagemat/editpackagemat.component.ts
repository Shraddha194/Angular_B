import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormControl } from '@angular/forms';
import { HotelSubscriptionType } from '../models/hotel-subscription-type';
import { HotelService } from '../models/servicedetails';
import { SubscriptionService } from '../models/subscription-service';
import { ViewPackage } from '../models/view-package';
import { Router, ActivatedRoute } from '@angular/router';
import { BnsPackageService } from 'src/app/pages/package-management/bns-package.service';
import { InformativeDialogBoxComponent } from 'src/app/informative-dialog-box/informative-dialog-box.component';
import { MatDialog } from '@angular/material';
import { PackageList } from '../models/packagelist';

@Component({
  selector: 'app-editpackagemat',
  templateUrl: './editpackagemat.component.html',
  styleUrls: ['./editpackagemat.component.scss']
})
export class EditpackagematComponent implements OnInit {
  sub_id: number;
  controls: AbstractControl;
  flag = false;
  packageType: HotelSubscriptionType[] = [];
  EditpackageForm: FormGroup;
  hotelServiceArray: HotelService[] = [];
  checkedService: number[] = [];

  packageArray: PackageList[];
  newpackageservices: SubscriptionService;
  newpackage: ViewPackage;

  get service() { return this.EditpackageForm.get("all_service") as FormArray; }
  dt = new Date();

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private hotelService: BnsPackageService,
              private dialog:MatDialog) { }

  ngOnInit() {
    this.EditpackageForm = new FormGroup({
      sub_type: new FormControl(),
      subscription: new FormControl(),
      payable_amt: new FormControl(),
      all_service: new FormArray([])
    });
    this.sub_id = this.activatedRoute.snapshot.params.sub_id;
    this.hotelService.getServicesByPackageId(this.sub_id).subscribe(
      (data: HotelService[]) => {
        for (const i of data) {
          this.checkedService.push(i.service_id);
        }
        this.SetServiceDetailsInForm(this.checkedService);
        this.hotelService.getAllHotelServices().subscribe(
          (data1: HotelService[]) => {
            this.hotelServiceArray = data1;
            for (const allservices of this.hotelServiceArray) {
              for (const checkedservices of this.checkedService) {
                this.flag = false;
                if (allservices.service_id === checkedservices) {
                  this.flag = true;
                  break;
                } else {
                  this.flag = false;
                }
              }
              if (this.flag) {
                const control = new FormControl(true);
                (this.EditpackageForm.get("all_service") as FormArray).push(control);
              } else {
                const control = new FormControl();
                (this.EditpackageForm.get("all_service") as FormArray).push(control);
              }
            }
          });
      }
    );
    this.hotelService.getAllPackageType().subscribe(
      (data: any) => this.packageType = data);
    this.hotelService.getPackageById(this.sub_id).subscribe(
      (data: PackageList) => this.setPackageDetails(data[0]));
  }
  onedit() {
    this.newpackage = new ViewPackage(
      this.EditpackageForm.value.sub_type,
      this.EditpackageForm.value.subscription,
      this.EditpackageForm.value.payable_amt
    );
    this.hotelService
      .updatePackage(this.sub_id, this.newpackage)
      .subscribe((data1: any) => {

        this.hotelService
          .deletePackageServices(this.sub_id, this.newpackage)
          .subscribe((data2: any) => {
            for (const service of this.checkedService) {
              this.newpackageservices = new SubscriptionService(
                this.sub_id,
                service,
                1,
                1,
                this.dt
              );
              this.hotelService
                .addPackageServices(this.newpackageservices)
                .subscribe((data3: any) => {

                }
                );
            }
          });
          const dialogref=this.dialog.open(InformativeDialogBoxComponent, {
            width: '250px',
            height:'150px',
            data: "Successfully Edited Data",
            hasBackdrop:true
          });
          dialogref.afterClosed().subscribe(result=>
            {
              if(result)
              {
                this.router.navigate(["/package-management"]);
              }
            });
        
      });
  }

  SetServiceDetailsInForm(data) {
    this.checkedService = data;
  }
  setPackageDetails(data: ViewPackage) {
    this.EditpackageForm.patchValue({
      sub_type: data.sub_type_id,
      subscription: data.subscription,
      payable_amt: data.payable_amt
    });
  }
  servicecheckbox(service_id: number) {
    if (this.checkedService.find(x => x === service_id)) {
      this.checkedService.splice(this.checkedService.indexOf(service_id), 1);
    } else {
      this.checkedService.push(service_id);
    }
  }

  backToPackage() {
    this.router.navigate(["/package-management"]);
  }


}
