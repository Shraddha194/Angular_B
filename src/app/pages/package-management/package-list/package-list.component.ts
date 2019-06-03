import { Component, OnInit, ViewChild, Output, Input, Inject } from '@angular/core';
import {
  MatTableDataSource,
  MatPaginator,
  MatDatepickerInputEvent,
  MatDialog
} from '@angular/material';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';


import { BnsPackageService } from '../bns-package.service';
import { ConfirmDeleteDialogComponent } from 'src/app/confirm-delete-dialog/confirm-delete-dialog.component';
import { InformativeDialogBoxComponent } from '../../../informative-dialog-box/informative-dialog-box.component';
import { PackageList } from '../models/packagelist';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  dataSource = new MatTableDataSource<PackageList>();
  displayedColumns: string[] = [
    'Package_Name',
    'Created_On',
    'Created_By',
    'No_Of_Hotels',
    'Action',
    'Action1',
    'Action2'
  ];

  constructor(
    private _packageService: BnsPackageService,
    private _route: Router,
    private dialog:MatDialog
  ) {}
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this._packageService.getAllPackgeList().subscribe((data: PackageList[]) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this._packageService.packageList = data;
    });
  }
  viewMore(element) {
    this._route.navigate(['packageview/', element.sub_id]);
  }
  valueChange(abc: any) {
    const date = new Date(abc.value);
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();
    let dd = date.getDate().toString();
    if (dd.length === 1) {
      dd = '0' + dd;
    }
    if (month.length === 1) {
      month = '0' + month;
    }
    const getDate = year + '-' + month + '-' + dd;
    this.dataSource.data = this._packageService.getPackageListOnFilter(getDate);
  }
  toHotelListPage()
  {
    this._route.navigate(['/package-management/hotellist']);
  }
  onEditPage(item: PackageList) {
    this._route.navigate(['/package-management/edit', item.sub_id]);
  }
  onViewPage(item: PackageList) {
    this._route.navigate(['/package-management/view', item.sub_id]);
  }
  toAddPage() {
    this._route.navigate(['/package-management/add']);
  }
 

  delete(item: PackageList) {
    // if (confirm('Are you sure to delete ' + item.Package_Name + ' ?')) {
    //   const id: number[] = [];
    //   id.push(item.sub_id);

    //   this._packageService.checkPackage(id).subscribe((data: any) => {
    //     if (data.length === 0) {
    //       this._packageService.deletePackage(id).subscribe((data1: any) => {
    //         if (data1.affectedRows === 1) {
    //           this._packageService.deletePackageService(id).subscribe(
    //             (data2: any) => {
    //               this.dataSource.data.splice(
    //                 this.dataSource.data.indexOf(item),
    //                 1
    //               );
    //               alert('Data deleted successfully');
    //             },
    //             function(err) {
    //               alert(err);
    //             }
    //           );
    //         }
    //       });
    //     } else {
    //       alert('Cannot delete this package. Used in atleast one Hotel!');
    //     }
    //   });
    // }
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      height:'150px',
      data: "Do you confirm the deletion of this data?",
      hasBackdrop:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
    
      const id: number[] = [];
      id.push(item.sub_id);

      this._packageService.checkPackage(id).subscribe((data: any) => {
        if (data.length === 0) {
          this._packageService.deletePackage(id).subscribe((data1: any) => {
            if (data1.affectedRows === 1) {
              this._packageService.deletePackageService(id).subscribe(
                (data2: any) => {
                  this.dataSource.data.splice(
                    this.dataSource.data.indexOf(item),
                    1
                  );
                    this.dialog.open(InformativeDialogBoxComponent, {
                    width: '250px',
                    height:'150px',
                    data: "Data Deleted Successfully",
                    hasBackdrop:true
                  });
                },
                function(err) {
                  this.dialog.open(InformativeDialogBoxComponent, {
                    width: '250px',
                    height:'150px',
                    data: err
                  });
                }
              );
            }
          });
        } else {
          this.dialog.open(InformativeDialogBoxComponent, {
            width: '400px',
            height:'150px',
            data: "Cannot delete this package. Used in atleast one Hotel!",
            hasBackdrop:true
          });
          
        }
      });
      }
    });
  }

}

