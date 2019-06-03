import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private bnsSnackbar:MatSnackBar) {
    this.bnsSnackbar.open("Welcome to Beep n Stay", "Welcome", {
      duration: 2000
    });
   }

  ngOnInit() {
    
  }

}
