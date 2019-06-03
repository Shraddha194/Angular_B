import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";


import { CityModel } from "src/app/pages/hotel-management/models/city-model";

import { SubscriptionModel } from "src/app/pages/hotel-management/models/subscription-model";

import { HotelMaster } from "src/app/pages/hotel-management/models/hotel-master";
import { ActivatedRoute, Router } from "@angular/router";
import { HotelModel } from "src/app/pages/hotel-management/models/hotel-model";
import { HttpEventType } from "@angular/common/http";
import { HotelServiceService } from "../models/hotel-service.service";
import { AdminModel } from "../models/admin-model";
import { MatDatepickerInputEvent, MatDialog } from "@angular/material";
import { CountryModel } from "src/app/pages/hotel-management/models/country-model";
import { StateModel } from "src/app/pages/hotel-management/models/state-model";
import { InformativeDialogBoxComponent } from "src/app/informative-dialog-box/informative-dialog-box.component";
import { SubscriptionTypeModel } from "../models/subscription-type-model";

@Component({
  selector: "app-edit-hotel",
  templateUrl: "./edit-hotel.component.html",
  styleUrls: ["./edit-hotel.component.scss"]
})
export class EditHotelComponent implements OnInit {
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
  pay:string;
  logo_pathTemp;
  image_pathTemp;
  logoUrl: File = null;
  imageUrl: string = null;
  flagLogo: boolean = true;
  flagImage: boolean = true;
  sub_idTemp: number;
  selectImage:boolean=false;
  selectLogo:boolean=false;
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
  hotelIdTemp: number;
  hote: number;
  currentData: HotelMaster;
  originalData: HotelMaster;
  constructor(
    private _hotelData: HotelServiceService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private dialog:MatDialog
  ) {}

  ngOnInit() {
    this.hotelIdTemp = this._activatedRoute.snapshot.params["hotel_id"];

    this._hotelData
      .getHotelById(this.hotelIdTemp)
      .subscribe((data: HotelMaster[]) => {
        this.getAllDetails(data[0]);
        this.countryId = data[0].country_id;
        this.onChangeCountry();
        this.stateId = data[0].state_id;
        this.onChangeState();
        this.packageId = data[0].sub_type_id;
        this.onChangePackage();
        this.sub_idTemp= data[0].sub_id;
        this.logo_pathTemp = data[0].logo_path;
        this.image_pathTemp = data[0].image_path;
      });

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
      logo_path: new FormControl(),
      image_path: new FormControl(),
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
        Validators.max(10000000000),
        Validators.min(1000000000)
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
      sub_from: new FormControl(),
      sub_to: new FormControl(),
      Package_Name: new FormControl(null),
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

    this.hotelForm.valueChanges.subscribe((data: any) => {
      this.currentData = data;
    });
  } //ngonInit completed

  isDirty(): boolean {
    if (
      JSON.stringify(this.currentData) !== JSON.stringify(this.originalData)
    ) {
      return true;
    }
    return false;
  }

  onBack() {
    this._router.navigate(["/hotel-management"]);
  }

  getAllDetails(data: HotelMaster) {
  
    this.currentData = data;
    this.originalData = data;
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
      ownership_type: data.ownership_type,
      contact_fname: data.contact_fname,
      contact_lname: data.contact_lname,
      contact_number: data.contact_number,
      contact_email_: data.contact_email_,
      contact_designation_: data.contact_designation_,
      name: data.country_id,
      stateName: data.state_id,
      city_id: data.city_id,
      sub_id: data.sub_type_id,
      sub_from: data.sub_from,
      sub_to: data.sub_to,
      Package_Name:data.subscription
    });
  }

  onChangeCountry() {
    if (this.hotelForm.valueChanges) {
      this.hotelForm.valueChanges.subscribe((data: any) => {
        this.countryId = data.name;
      });
    }
    this._hotelData.getStateByCountry(this.countryId).subscribe(
      (data: StateModel[]) => {
        this.local_state_arr = data;
      },
      function(err) {},
      function() {}
    );
  }
  onChangeState() {
    this.hotelForm.valueChanges.subscribe((data: any) => {
      this.stateId = data.stateName;
    });
    this._hotelData.getCityByState(this.stateId).subscribe(
      (data: CityModel[]) => {
        this.local_city_arr = data;
      },
      function(err) {},
      function() {}
    );
  }
  
  onChangePackage() {
    this.packageId = this.hotelForm.get('sub_id').value;
    this._hotelData.getSubByPackages(this.packageId).subscribe(
      (data: SubscriptionModel[]) => {
        this.local_sub_arr = data;
        this.pay=this.local_sub_arr[0].payable_amt.toString();
       
       
        this.hotelForm.patchValue({
          Paybill_Charges:this.pay
        });
      },
      function (err) { },
      function () { }
    );
    
    
  }

  onChangeSub() {

    this.sub_idTemp = this.hotelForm.get('Package_Name').value;
   
    this.hotelForm.patchValue({
      Paybill_Charges: this.pay
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
            data: "Logo Size Is Big. Select Less Then 200KB Image",
            hasBackdrop:true
          });
         
        }
        else {
          this.selectedLogoFile = file.item(0);
         
          //Show image preview
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.logoUrl = event.target.result;
            this.selectLogo=true;
          }
          reader.readAsDataURL(this.selectedLogoFile);
        }
      }
      else {
        this.dialog.open(InformativeDialogBoxComponent, {
          width: '250px',
          height:'150px',
          data: "This file type is not possible",
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
            data: "Logo Size Is Big. Select Less Then 200KB Image",
            hasBackdrop:true
          });
      
        }
        else {
          this.selectedImageFile = file.item(0);
         
          //Show image preview
          var reader = new FileReader();
          reader.onload = (event: any) => {
            this.imageUrl = event.target.result;
            this.selectImage=true;
          }
          reader.readAsDataURL(this.selectedImageFile);
        }
      }
      else {
        this.dialog.open(InformativeDialogBoxComponent, {
          width: '250px',
          height:'150px',
          data: "This File Type Is Not Suppoted",
          hasBackdrop:true
        });
       
      }
    }
  }

  onEditHotel() {
    if (this.selectedLogoFile == null) {
      let hotelEdit = new HotelModel(
        this.hotelForm.get("hotel_id").value,
        this.hotelForm.get("hotel_name").value,
        this.hotelForm.get("auth_contact_no").value,
        this.hotelForm.get("sub_id").value,
        this.hotelForm.get("sub_from").value,
        this.hotelForm.get("sub_to").value,
        this.hotelForm.get("city_id").value,
        101,
        101,
        this.hotelForm.get("owner_name").value,
        this.hotelForm.get("email_").value,
        this.hotelForm.get("category_").value,
        this.hotelForm.get("group_name").value,
        this.hotelForm.get("copyright_by").value,
        this.hotelForm.get("ownership_type").value,
        this.hotelForm.get("address_").value,
        this.hotelForm.get("landmark_").value,
        this.hotelForm.get("pincode_").value,
        this.hotelForm.get("website_").value,
        this.logo_pathTemp,
        this.hotelForm.get("contact_fname").value,
        this.hotelForm.get("contact_lname").value,
        this.hotelForm.get("contact_designation_").value,
        this.hotelForm.get("contact_email_").value,
        this.hotelForm.get("contact_number").value,
        101
      );

      if (this.selectedImageFile != null) {
        const imgFd = new FormData();
        imgFd.append(
          "image_path",
          this.selectedImageFile,
          this.selectedImageFile.name
        );
        imgFd.append("created_by", "101");
        imgFd.append("created_at", Date.now().toString());
        imgFd.append("hotel_id", this.hotelForm.get("hotel_id").value);
        this._hotelData.updateImage(imgFd).subscribe(
          event => {
            if (event.type == HttpEventType.Response) {
              if (event.body.valueOf() > 0) {
               
              } else {
              }
            }
          },
          function(err) {},
          function() {}
        );
      }

      this._hotelData.updateHotelWithoutLogo(hotelEdit).subscribe(
        (data: any) => {
          if (data > 0) {
           
          } else {
          }
        },
        function(err) {},
        function() {}
      );

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
      this.adminTemp.hotel_id = this.hotelForm.get("hotel_id").value;

      this._hotelData.updateAdmin(this.adminTemp).subscribe(
        (data: any) => {
          if (data.affectedRows > 0) {
            const dialogref=this.dialog.open(InformativeDialogBoxComponent, {
              width: '250px',
              height:'150px',
              data: "Data updated successfully",
              hasBackdrop:true
            });
            dialogref.afterClosed().subscribe(result=>
              {
                if(result)
                {
                  this._router.navigate(['/hotel-management']);
                }
              });
          }
        },
        function(err) {},
        function() {}
      );
    } //if completed of no logo
    else {
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
      fd.append("hotel_id", this.hotelForm.get("hotel_id").value);

      if (this.selectedImageFile != null) {
        const imgFd = new FormData();
        imgFd.append(
          "image_path",
          this.selectedImageFile,
          this.selectedImageFile.name
        );
        imgFd.append("created_by", "101");
        imgFd.append("created_at", Date.now().toString());
        imgFd.append("hotel_id", this.hotelForm.get("hotel_id").value);

        this._hotelData.updateImage(imgFd).subscribe(
          event => {
            if (event.type == HttpEventType.Response) {
              if (event.body.valueOf() > 0) {
                
              } else {
              }
            }
          },
          function(err) {},
          function() {}
        );
      }

      this._hotelData.updateHotel(fd).subscribe(
        event => {
          if (event.type == HttpEventType.Response) {
            if (event.body.valueOf() > 0) {
             
            }
          }
        },
        function(err) {},
        function() {}
      );

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
      this.adminTemp.hotel_id = this.hotelForm.get("hotel_id").value;

      this._hotelData.updateAdmin(this.adminTemp).subscribe(
        (data: any) => {
          if (data.affectedRows > 0) {
           const dialogref= this.dialog.open(InformativeDialogBoxComponent, {
              width: '250px',
              height:'150px',
              data: "Data Updated Successfully",
              hasBackdrop:true
            });
            dialogref.afterClosed().subscribe(result=>
              {
                if(result)
                {
                  this._router.navigate(['/hotel-management']);
                }
              });
          }
        },
        function(err) {},
        function() {}
      );
    } //else part with logo
  } //call complete for edit do not touch
}
