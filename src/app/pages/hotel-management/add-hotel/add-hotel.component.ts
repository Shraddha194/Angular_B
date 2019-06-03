import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HttpEventType } from "@angular/common/http";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { SubscriptionTypeModel } from "../models/subscription-type-model";
import { SubscriptionModel } from "../models/subscription-model";
import { AdminModel } from "../models/admin-model";
import { HotelServiceService } from "../models/hotel-service.service";
import { Router } from "@angular/router";

import { InformativeDialogBoxComponent } from "src/app/informative-dialog-box/informative-dialog-box.component";
import { MatDialog } from "@angular/material";
import { CountryModel } from "../models/country-model";
import { CityModel } from "../models/city-model";
import { StateModel } from "../models/state-model";

@Component({
  selector: "app-add-hotel",
  templateUrl: "./add-hotel.component.html",
  styleUrls: ["./add-hotel.component.scss"]
})
export class AddHotelComponent implements OnInit {
  currentRate = 6;
  datediff: number;
  minDate = new Date();
  maxDate = new Date(2050, 0, 1);
  minDate2 = new Date();
  types: string[] = ["Privately Owned", "Leased", "Managed"];
  hotelForm: FormGroup;
  countryId: number;
  stateId: number;
  cityId: number;
  packageId: number;
  sub_idTemp: number;
  local_country_arr: CountryModel[] = [];
  local_state_arr: StateModel[] = [];
  local_city_arr: CityModel[] = [];
  local_package_arr: SubscriptionTypeModel[] = [];
  local_sub_arr: SubscriptionModel[] = [];
  selectedLogoFile: File = null;
  selectedImageFile: File = null;
  logoUrl: File = null;
  imageUrl: string = null;
  flagLogo: boolean = true;
  flagImage: boolean = true;
  adminTemp: AdminModel = new AdminModel(
    0,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    0,
    ""
  );

  constructor(
    private _hotelData: HotelServiceService,
    private _router: Router,
    private dialog:MatDialog
  ) { }

  ngOnInit() {

    this.hotelForm = new FormGroup({
      hotel_id: new FormControl(null),
      hotel_name: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]{3,25}$")
      ]),
      address_: new FormControl(null, [Validators.required]),
      landmark_: new FormControl(null, [Validators.required]),
      owner_name: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]{4,25}$")
      ]),
      pincode_: new FormControl(null, [
        Validators.required,
        Validators.min(100000),
        Validators.max(1000000),
        Validators.pattern("^[0-9]+$")
      ]),
      auth_contact_no: new FormControl(null, [
        Validators.required,
        Validators.min(1000000000),
        Validators.max(10000000000),
        Validators.pattern("^[0-9]+$")
      ]),
      category_: new FormControl(null),
      email_: new FormControl(null, [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]),
      name: new FormControl(),
      stateName: new FormControl(),
      city_id: new FormControl(),
      group_name: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]+$")
      ]),
      website_: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(ftp|http|https)://[^ "]+$')
      ]),
      ownership_type: new FormControl(null),
      logo_path: new FormControl(null),
      image_path: new FormControl(null),
      copyright_by: new FormControl(null, [Validators.required]),
      contact_fname: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]{3,25}$")
      ]),
      contact_lname: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]{3,25}$")
      ]),
      contact_number: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[0-9]+$"),
        Validators.min(1000000000),
        Validators.max(10000000000),
        Validators.pattern("^[0-9]+$")
      ]),
      contact_email_: new FormControl(null, [
        Validators.required,
        Validators.pattern("[^ @]*@[^ @]*")
      ]),
      contact_designation_: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]{3,25}$")
      ]),
      sub_id: new FormControl(),
      sub_from: new FormControl(null),
      sub_to: new FormControl(null),
      status_id: new FormControl(null),
      clint_status: new FormControl(null),
      Package_Name: new FormControl(null),
      Paybill_Charges: new FormControl(null),
      days: new FormControl(null)
    });

    this._hotelData.getAllCountries().subscribe(
      (data: CountryModel[]) => {
        this.local_country_arr = data;
      },
      function (err) { },
      function () { }
    );
    this._hotelData.getAllPackages().subscribe(
      (data: SubscriptionTypeModel[]) => {
        this.local_package_arr = data;
      },
      function (err) { },
      function () { }
    );
  } //ngonInit completed

  onBack() {
    this._router.navigate(["/hotel-management"]);
  }

  onChangeCountry() {
    this.countryId = this.hotelForm.get('name').value;
    this._hotelData.getStateByCountry(this.countryId).subscribe(
      (data: StateModel[]) => {
        this.local_state_arr = data;
      },
      function (err) { },
      function () { }
    );
    this.local_city_arr = null;
  }
  onChangeState() {
    this.stateId = this.hotelForm.get('stateName').value;
    this._hotelData.getCityByState(this.stateId).subscribe(
      (data: CityModel[]) => {
        this.local_city_arr = data;
      },
      function (err) { },
      function () { }
    );
  }


  onChangePackage() {
    this.packageId = this.hotelForm.get('sub_id').value;
    this._hotelData.getSubByPackages(this.packageId).subscribe(
      (data: SubscriptionModel[]) => {
        this.local_sub_arr = data;
      },
      function (err) { },
      function () { }
    );
    
    this.hotelForm.patchValue({
      Paybill_Charges: 0
    });
  }

  onChangeSub() {
    this.sub_idTemp = this.hotelForm.get('Package_Name').value;
    this.hotelForm.patchValue({
      Paybill_Charges: this.local_sub_arr[this.sub_idTemp].payable_amt
    });

  }
  onLogoFileSelected(file: FileList) {
    if (this.flagLogo == true) {
      this.flagLogo = false;
    }
    else {
      this.flagLogo = false;
    }
    if (file.item(0)) {
      if (file.item(0).type === 'image/jpeg' || file.item(0).type === 'image/png' || file.item(0).type === 'image/jpg') {
        if (file.item(0).size > 200000) {
          this.dialog.open(InformativeDialogBoxComponent, {
            width: '250px',
            height:'150px',
            data: "Logo size should be less than 200KB",
            hasBackdrop:true
          });
        }
        else {
          this.selectedLogoFile = file.item(0);
         
          //Show image preview
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.logoUrl = event.target.result;
          }
          reader.readAsDataURL(this.selectedLogoFile);
        }
      }
      else {
        this.dialog.open(InformativeDialogBoxComponent, {
          width: '250px',
          height:'150px',
          data: "File type is not supported",
          hasBackdrop:true
        });
      }
    }
  }
  onImageFileSelected(file: FileList) {
    if (this.flagImage == true) {
      this.flagImage = false;
    }
    else {
      this.flagImage = false;
    }
    if (file.item(0)) {
      if (file.item(0).type === 'image/jpeg' || file.item(0).type === 'image/png' || file.item(0).type === 'image/jpg') {
        if (file.item(0).size > 500000) {
          this.dialog.open(InformativeDialogBoxComponent, {
            width: '250px',
            height:'150px',
            data: "Image Size Is Big. Select Less Then 200KB Image",
            hasBackdrop:true
          });
        }
        else {
          this.selectedImageFile = file.item(0);
          
          //Show image preview
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.imageUrl = event.target.result;
          }
          reader.readAsDataURL(this.selectedImageFile);
        }
      }
      else {
       if (file.item(0).size > 500000) {
          this.dialog.open(InformativeDialogBoxComponent, {
            width: '250px',
            height:'150px',
            data: "This File Type Is Not Suppoted",
            hasBackdrop:true
          });
        }
      }
    }
  }

  imgff;
  onAddHotel() {
    const fd = new FormData();
    fd.append("hotel_name", this.hotelForm.get("hotel_name").value);
    fd.append("address_", this.hotelForm.get("address_").value);
    fd.append("landmark_", this.hotelForm.get("landmark_").value);
    fd.append("owner_name", this.hotelForm.get("owner_name").value);
    fd.append("pincode_", this.hotelForm.get("pincode_").value);
    fd.append("auth_contact_no", this.hotelForm.get("auth_contact_no").value);
    fd.append("city_id", this.hotelForm.get("city_id").value);
    fd.append("email_", this.hotelForm.get("email_").value);
    fd.append("category_", this.hotelForm.get("category_").value);
    fd.append("group_name", this.hotelForm.get("group_name").value);
    fd.append("copyright_by", this.hotelForm.get("copyright_by").value);
    fd.append("ownership_type", this.hotelForm.get("ownership_type").value);
    fd.append("sub_id", this.hotelForm.get("sub_id").value);
    fd.append("sub_from", this.hotelForm.get("sub_from").value);
    fd.append("sub_to", this.hotelForm.get("sub_to").value);
    fd.append("website_", this.hotelForm.get("website_").value);
    fd.append("logo_path", this.selectedLogoFile, this.selectedLogoFile.name);
    fd.append("contact_fname", this.hotelForm.get("contact_fname").value);
    fd.append("contact_lname", this.hotelForm.get("contact_lname").value);
    fd.append(
      "contact_designation_",
      this.hotelForm.get("contact_designation_").value
    );
    fd.append("contact_email_", this.hotelForm.get("contact_email_").value);
    fd.append("contact_number", this.hotelForm.get("contact_number").value);
    fd.append("status_id", "101");
    fd.append("client_status", "101");
    fd.append("created_by", "101");

    const imgFd = new FormData();
    imgFd.append(
      "image_path",
      this.selectedImageFile,
      this.selectedImageFile.name
    );
    imgFd.append("created_by", "101");
    imgFd.append("created_at", Date.now().toString());

    this.adminTemp.fname = this.hotelForm.get("contact_fname").value;
    this.adminTemp.mname = this.hotelForm.get("contact_fname").value;
    this.adminTemp.lname = this.hotelForm.get("contact_lname").value;
    this.adminTemp.contact_no = this.hotelForm.get("contact_number").value;
    this.adminTemp.email_id = this.hotelForm.get("contact_email_").value;
    this.adminTemp.address1_ = this.hotelForm.get("address_").value;
    this.adminTemp.address2_ = this.hotelForm.get("address_").value;
    this.adminTemp.landmark_ = this.hotelForm.get("landmark_").value;
    this.adminTemp.pincode_ = this.hotelForm.get("pincode_").value;
    this.adminTemp.city_id = this.hotelForm.get("city_id").value;
    this.adminTemp.created_at = Date.now().toString();
    this._hotelData.addHotel(fd).subscribe(
      event => {
    
        if (event.type == HttpEventType.Response) {
          this.imgff = event.body.valueOf();
          if (this.imgff > 0) {
            imgFd.append("hotel_id", this.imgff);
            this._hotelData.addImage(imgFd).subscribe(
              event => {
                if (event.type == HttpEventType.Response) {
                  if (event.body.valueOf() > 0) {
                    this.adminTemp.hotel_id = this.imgff;
                    this._hotelData.addAdmin(this.adminTemp).subscribe(
                      (data: any) => {
                       
                        if (data > 0) {
                         const dialogref=  this.dialog.open(InformativeDialogBoxComponent, {
                            width: '250px',
                            height:'150px',
                            data: "Data Successfully inserted",
                            hasBackdrop:true
                          });
                          dialogref.afterClosed().subscribe(result=>{
                            if(result)
                            {
                              this._router.navigate(["/hotel-management"]);
                            }
                          })
                          {

                          }
                        
                        }
                      },
                      function (err) { },
                      function () { }
                    );
                  }
                }
              },
              function (err) { },
              function () { }
            );
          } else {
            const dialogref=  this.dialog.open(InformativeDialogBoxComponent, {
              width: '250px',
              height:'150px',
              data: "Data Successfully inserted",
              hasBackdrop:true
            });
          }
        } else {
        }
      },
      function (err) { },
      function () { }
    );
  }

  onChangeDateFrom() {
    this.minDate2.setMonth(this.hotelForm.controls.sub_from.value.getMonth());
    this.minDate2.setDate(this.hotelForm.controls.sub_from.value.getDate() + 1);
    this.hotelForm.patchValue({
      days: "",
      sub_to: ""
    });
  }

  onChangeDateTo() {
 
    this.datediff =
      Math.abs(
        this.hotelForm.controls.sub_from.value.valueOf() -
        this.hotelForm.controls.sub_to.value.valueOf()
      ) /
      (1000  *3600  *24);
    this.hotelForm.patchValue({
      days: this.datediff
    });
  }
} //last complete
