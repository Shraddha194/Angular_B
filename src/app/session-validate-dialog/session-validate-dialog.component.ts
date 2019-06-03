import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-session-validate-dialog',
  templateUrl: './session-validate-dialog.component.html',
  styleUrls: ['./session-validate-dialog.component.scss']
})
export class SessionValidateDialogComponent  {

  constructor(
    public dialogRef: MatDialogRef<SessionValidateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) {
      dialogRef.disableClose = true;
     }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
