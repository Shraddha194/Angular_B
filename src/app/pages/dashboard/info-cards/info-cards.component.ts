import { Component, OnInit } from '@angular/core';
import { BnsServiceService } from '../../user-management/bns-service.service';


@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit {
  public colorScheme = {
    domain: ['rgba(255,255,255,0.8)']
  };
  bnsNumberOfPackages = 0;
  bnsNumberOfHotels = 0;
  constructor(public bnsservice: BnsServiceService) {}

  ngOnInit() {
    this.getNoOfPackage();
    this.getNoOfHotel();
  }
  getNoOfPackage() {
    this.bnsservice.getNoofPackages().subscribe((data: any) => {
      this.bnsNumberOfPackages = data[0].packagecount;
    });
  }
  getNoOfHotel() {
    this.bnsservice.getNoofHotel().subscribe((data: any) => {
     
      this.bnsNumberOfHotels = data[0].hotelcount;
      
    });
  }
}
