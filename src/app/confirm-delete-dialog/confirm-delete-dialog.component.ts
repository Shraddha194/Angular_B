import { Component, OnInit, Inject, HostListener } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";


@Component({
  selector: "app-confirm-delete-dialog",
  templateUrl: "./confirm-delete-dialog.component.html",
  styleUrls: ["./confirm-delete-dialog.component.scss"]
})
export class ConfirmDeleteDialogComponent  {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) {
      dialogRef.disableClose = true;
     }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
