import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-informative-dialog-box',
  templateUrl: './informative-dialog-box.component.html',
  styleUrls: ['./informative-dialog-box.component.scss']
})
export class InformativeDialogBoxComponent {
  constructor(
    public dialogRef: MatDialogRef<InformativeDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
    onOkClick(): void {
    this.dialogRef.close();
  }


}
