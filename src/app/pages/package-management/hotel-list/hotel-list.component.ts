import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';

import { BnsPackageService } from 'src/app/pages/package-management/bns-package.service';
import { PackageType } from '../models/package-type';
import { PackageName } from '../models/package-name';
import { Hotellist } from '../models/hotellist';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.scss']
})
export class HotelListComponent implements OnInit {
  dropdown: FormGroup;
  packageTypeShow = false;
  packageNameShow = false;
  packageType: PackageType[] = [];
  packageName: PackageName[] = [];
  dataSource = new MatTableDataSource<Hotellist>();
  displayedColumns: string[] = ["Hotel_Id", "Hotel_Name", "Contact_No", "Subscribed_From",
    "City", "Status"];

  constructor(private _packageService: BnsPackageService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.dropdown = new FormGroup({
      PackageName: new FormControl(),
      PackageType: new FormControl()
    });

    this._packageService.getAllPackageType().subscribe(
      (data: PackageType[]) => {
        this.packageType = data;
        if (this.packageType.length > 0) {
          this.packageTypeShow = true;
        }
      }
    );
    this._packageService.getAllHotels().subscribe(
      (data: Hotellist[]) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this._packageService.hotelList = data;
      }
    );
  }
  packageNameNotSelected() {
    this.dataSource.data = this._packageService.hotelList;
  }
  packageNameSelected() {
    this.dataSource.data = this._packageService.getHotelListOnSearch(this.dropdown.controls.PackageName.value);
  }
  packageTypeNotSelected() {
    this.packageName = [];
    this.packageNameShow = false;
    this.dataSource.data = this._packageService.hotelList;
    this.dropdown.controls.PackageName.setValue("");
  }
  packageTypeSelected() {
    this._packageService.getPackageNameByPackageType(this.dropdown.controls.PackageType.value).subscribe(
      (data: PackageName[]) => {
        this.packageName = data;
        this.packageNameShow = true;
      }
    );
  }

}
