import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";


import { CityModel } from "src/app/pages/hotel-management/models/city-model";

import { SubscriptionModel } from "src/app/pages/hotel-management/models/subscription-model";

import { ActivatedRoute, Router } from "@angular/router";
import { HotelServiceService } from "../models/hotel-service.service";
import { HotelMaster } from "src/app/pages/hotel-management/models/hotel-master";
import { StateModel } from "../models/state-model";
import { SubscriptionTypeModel } from "../models/subscription-type-model";
import { CountryModel } from "../models/country-model";

@Component({
  selector: "app-view-hotel",
  templateUrl: "./view-hotel.component.html",
  styleUrls: ["./view-hotel.component.scss"]
})
export class ViewHotelComponent implements OnInit {
  countryId: number = 1;
  stateId: number = 1;
  cityId: number = 1;
  packageId: number = 101;
  types: string[] = ["Privately Owned", "Leased", "Managed"];
  packages: string[] = ["White Lebel", "Black lebel"];
  hotelForm: FormGroup;
  local_country_arr: CountryModel[] = [];
  local_state_arr: StateModel[] = [];
  local_city_arr: CityModel[] = [];
  local_package_arr: SubscriptionTypeModel[] = [];
  local_sub_arr: SubscriptionModel[] = [];
  selectedLogoFile: File = null;
  selectedImageFile: File = null;
  logo_pathTemp;
  image_pathTemp;
  hotelIdTemp: number;

  constructor(
    private _hotelData: HotelServiceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    this.hotelIdTemp = this._activatedRoute.snapshot.params["hotel_id"];

    this._hotelData
      .getHotelById(this.hotelIdTemp)
      .subscribe((data: HotelMaster[]) => {
        this.getAllDetails(data[0]);
        // this.countryId = data[0].country_id;
        // this.onChangeCountry();
        // this.stateId = data[0].state_id;
        // this.onChangeState();
        this.packageId = data[0].sub_type_id;
        this.onChangePackage();
        this.logo_pathTemp = data[0].logo_path;
        this.image_pathTemp = data[0].image_path;
      });

    this.hotelForm = new FormGroup({
      hotel_id: new FormControl(),
      hotel_name: new FormControl(),
      address_: new FormControl(),
      landmark_: new FormControl(),
      owner_name: new FormControl(),
      pincode_: new FormControl(),
      auth_contact_no: new FormControl(),
      category_: new FormControl(),
      email_: new FormControl(),
      name: new FormControl(),
      stateName: new FormControl(),
      city_id: new FormControl(),
      group_name: new FormControl(),
      website_: new FormControl(),
      ownership_type: new FormControl(),
      logo_path: new FormControl(),
      image_path: new FormControl(),
      copyright_by: new FormControl(),
      contact_fname: new FormControl(),
      contact_lname: new FormControl(),
      contact_number: new FormControl(),
      contact_email_: new FormControl(),
      contact_designation_: new FormControl(),
      sub_id: new FormControl(),
      Package_Name: new FormControl(),
      Paybill_Charges: new FormControl()
    });

    this._hotelData.getAllCountries().subscribe(
      (data: CountryModel[]) => {
        this.local_country_arr = data;
      },
      function(err) {},
      function() {}
    );
    this._hotelData.getAllPackages().subscribe(
      (data: SubscriptionTypeModel[]) => {
        this.local_package_arr = data;
      },
      function(err) {},
      function() {}
    );
  } //ngonInit completed
  own: string = "";
  getAllDetails(data: HotelMaster) {
    this.own = this.types[data.ownership_type].valueOf();
    this.hotelForm.patchValue({
      hotel_id: data.hotel_id,
      hotel_name: data.hotel_name,
      address_: data.address_,
      landmark_: data.landmark_,
      owner_name: data.owner_name,
      pincode_: data.pincode_,
      auth_contact_no: data.auth_contact_no,
      email_: data.email_,
      group_name: data.group_name,
      website_: data.website_,
      category_: data.category_,
      copyright_by: data.copyright_by,
      ownership_type: this.own,
      contact_fname: data.contact_fname,
      contact_lname: data.contact_lname,
      contact_number: data.contact_number,
      contact_email_: data.contact_email_,
      contact_designation_: data.contact_designation_,
      name: data.country_name,
      stateName: data.state_name,
      city_id: data.city_name,
      sub_id: data.sub_type_id
    });
  }

  onChangePackage() {
    if (this.hotelForm.valueChanges) {
      this.hotelForm.valueChanges.subscribe((data: any) => {
        this.packageId = data.sub_id;
      });
    }
    this._hotelData.getSubByPackages(this.packageId).subscribe(
      (data: any[]) => {
        this.local_sub_arr = data;
        this.hotelForm.patchValue({
          Package_Name: data[0].subscription,
          Paybill_Charges: data[0].payable_amt
        });
      },
      function(err) {},
      function() {}
    );
  }

  onBack() {
    this._router.navigate(['/hotel-management']);
  }

  onDelete(item: HotelMaster) {
    if (confirm('Are you sure you want to delete?')) {
      this._hotelData.deleteAdminById(item.hotel_id).subscribe((data: any) => {
        if (data.affectedRows > 0) {
          this._hotelData
            .deleteImageById(item.hotel_id)
            .subscribe((data: any) => {
              if (data.affectedRows > 0) {
                this._hotelData
                  .deleteHotelByID(item.hotel_id)
                  .subscribe((data: any) => {
                    if (data.affectedRows > 0) {
                      this._router.navigate([""]);
                    }
                  });
              }
            });
        } else {
        }
      });
    }
  }
} //call complete
