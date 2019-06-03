import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormArray, FormControl } from '@angular/forms';
import { HotelSubscriptionType } from '../models/hotel-subscription-type';
import { HotelService } from '../models/servicedetails';

import { Router, ActivatedRoute } from '@angular/router';
import { ViewPackage } from '../models/view-package';
import { BnsPackageService } from 'src/app/pages/package-management/bns-package.service';
import { PackageList } from '../models/packagelist';

@Component({
  selector: 'app-viewpackagemat',
  templateUrl: './viewpackagemat.component.html',
  styleUrls: ['./viewpackagemat.component.scss']
})
export class ViewpackagematComponent implements OnInit {

  controls: AbstractControl;
  sub_id: number;
  flag = false;
  packageType: HotelSubscriptionType[] = [];
  hotelViewForm: FormGroup;
  hotelServiceArray: HotelService[] = [];
  packageArray: PackageList;
  checkedService: number[] = [];
  get getService() { return this.hotelViewForm.get("all_service") as FormArray; }

  constructor(private hotelService: BnsPackageService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.hotelViewForm = new FormGroup({
      sub_type: new FormControl(),
      subscription: new FormControl(),
      payable_amt: new FormControl(),
      all_service: new FormArray([])
    });
    this.hotelViewForm.disable();
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
                (this.hotelViewForm.get("all_service") as FormArray).push(control);
              } else {
                const control = new FormControl();
                (this.hotelViewForm.get("all_service") as FormArray).push(control);
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
  SetServiceDetailsInForm(data) {
    this.checkedService = data;
  }
  setPackageDetails(data: ViewPackage) {
    this.hotelViewForm.patchValue({
      sub_type: data.sub_type_id,
      subscription: data.subscription,
      payable_amt: data.payable_amt
    });
  }



  backToPackage() {
    this.router.navigate(["/package-management"]);

  }

}
