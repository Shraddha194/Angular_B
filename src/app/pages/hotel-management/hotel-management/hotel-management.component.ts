import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from "@angular/material";
import { HotelMaster } from "src/app/pages/hotel-management/models/hotel-master";
import { SelectionModel } from "@angular/cdk/collections";
import { Router } from "@angular/router";
import { HotelModel } from "src/app/pages/hotel-management/models/hotel-model";
import { HotelServiceService } from "../models/hotel-service.service";
import { InformativeDialogBoxComponent } from "src/app/informative-dialog-box/informative-dialog-box.component";
import { ConfirmDeleteDialogComponent } from "src/app/confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: "app-hotel-management",
  templateUrl: "./hotel-management.component.html",
  styleUrls: ["./hotel-management.component.scss"]
})
export class HotelManagementComponent implements OnInit {
  displayedColumns: string[] = ['hotel_id', 'Logo', 'hotel_name', 'owner_name', 'address_', 'view','edit' ,'delete'];
  dataSource = new MatTableDataSource<HotelMaster>();
  selection = new SelectionModel<HotelMaster>(true);

  arrIds: any[] = [];
  flag: boolean = true;
  isButtonVisible: boolean = false;

  isButtonClick() {
    if (this.isButtonVisible === false) {
      this.isButtonVisible = true;
      this.flag = false;
    }
    else {
      this.isButtonVisible = false;
      this.flag = true;
    }
  }
  @ViewChild('paginator1') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _services: HotelServiceService,
    private _router: Router,
    private dialog:MatDialog
  ) {
    this.loadDetails();
  }

  loadDetails() {
    this._services.getAllHotels().subscribe(
      (data: HotelMaster[]) => {
        this.dataSource.data = data;
      },
      function (err) { },
      function () {
      }
    );
  }


  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(str: string) {
    this.dataSource.filter = str.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.paginator.pageSize;
    if (numSelected === numRows) {
      this.isButtonVisible = true;
      this.flag = false;
    }
    else {
      this.isButtonVisible = false;
      this.flag = true;
    }
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.isButtonVisible = false;
      this.selection.clear();
    }
    else {
      for (let i = 0; i < this.paginator.pageSize; i++) {
        this.selection.select(this.dataSource.data[i]);
      }
    }
  }

  onDeleteAll() {
    if (this.selection.selected.length == 0) {
      alert('Please select at least one record to delete');
    }
    else {
      this.selection.selected.forEach(x => {
        this.arrIds.push(x.hotel_id);
      });
    }
  }


  onDelete(id: number) {
    const dialogref=this.dialog.open(InformativeDialogBoxComponent, {
      width: '250px',
      height:'150px',
      data: "Do  you want to delete this item?",
      hasBackdrop:true
    }); 
    dialogref.afterClosed().subscribe(result=>
      {
        this._services.deleteAdminById(id).subscribe(
          (data: any) => {
            if (data.affectedRows > 0) {
              this._services.deleteImageById(id).subscribe(
                (data: any) => {
                  if (data.affectedRows > 0) {
                    this._services.deleteHotelByID(id).subscribe(
                      (data: any) => {
                        if (data.affectedRows > 0) {
                          const dialogref=this.dialog.open(InformativeDialogBoxComponent, {
                            width: '250px',
                            height:'150px',
                            data: "Data Deleted Successfully",
                            hasBackdrop:true
                          }); 
                          dialogref.afterClosed().subscribe(result=>
                            {
                              if(result)
                              this._router.navigate(['/hotel-management']);
                            })
                          
                        }
                      }
                    );
                  }
                }
              );
  
            }
            else {
            }
          }
        );
      })
      

    

  }
  onAdd() {
    this._router.navigate(['/hotel-management/add']);
  }

  editHotel(id: number) {
    this._router.navigate(['hotel-management/edit', id]);
  }

  viewMore(item: HotelModel) {
    this._router.navigate(['hotel-management/view', item.hotel_id]);
  }

}
