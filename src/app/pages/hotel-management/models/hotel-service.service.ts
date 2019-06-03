import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';

import { endPoints } from 'src/environments/environment';
import { AdminModel } from './admin-model';
import { HotelMaster } from './hotel-master';
import { HotelModel } from './hotel-model';
import { CityModel } from './city-model';
import { StateModel } from './state-model';
import { CountryModel } from './country-model';
import { SubscriptionTypeModel } from './subscription-type-model';
import { SubscriptionModel } from './subscription-model';

@Injectable({
  providedIn: 'root'
})
export class HotelServiceService {
  url = endPoints.url + "hotel/";
  imageURL = endPoints.url + "image/";
  adminURL = endPoints.url + "admin/";
  auditURL = endPoints.url + 'audit/';

  cityURL = endPoints.url + "city/";
  stateURL = endPoints.url + "state/";
  countryURL = endPoints.url + "country/";
  packageURL = endPoints.url + "sub-type/";
  subURL = endPoints.url+"subscription/";
  hotelId;

  constructor(private _http: HttpClient) { }

  getAllHotels() {
    return this._http.get<HotelMaster[]>(this.url);
  }

  getHotelById(hotel_id: number) {
    return this._http.get<HotelMaster[]>(this.url + hotel_id);
  }

  addHotel(fd: FormData) {
    return this._http.post(this.url, fd, { observe: "events" });
  }

  updateHotel(fd: FormData) {
    this.hotelId = fd.get('hotel_id');
    
    
    return this._http.put(this.url + this.hotelId, fd, { observe: "events" });
  }

  updateHotelWithoutLogo(hotel: HotelModel) {
    return this._http.put(this.url + '/without/' + hotel.hotel_id, hotel);
  }

  addImage(fd: FormData) {
    return this._http.post(this.imageURL, fd, { observe: "events" });
  }

  updateImage(fd: FormData) {
    this.hotelId = fd.get('hotel_id');
    return this._http.put(this.imageURL + this.hotelId, fd, { observe: "events" });
  }
  addAdmin(admin: AdminModel) {
    return this._http.post(this.adminURL, admin);
  }

  updateAdmin(admin: AdminModel) {
   
    return this._http.put(this.adminURL + admin.hotel_id, admin);
  }

  deleteHotelByID(hotel_id: number) {
 
    let header = new HttpHeaders().set("Content-Type", "application/json");
    return this._http.delete(this.url + hotel_id, { headers: header });
   
  }
  deleteImageById(hotel_id: number) {
    let header = new HttpHeaders().set("Content-Type", "application/json");
    return this._http.delete(this.imageURL + hotel_id, { headers: header });
    // return this._http.delete(this.imageURL + hotel_id);
  }
  deleteAdminById(hotel_id: number) {
    let header = new HttpHeaders().set("Content-Type", "application/json");
    return this._http.delete(this.adminURL + hotel_id, { headers: header });
    // return this._http.delete(this.adminURL + hotel_id);
  }

  getCityByState(state_id: number) {
    return this._http.get<CityModel[]>(this.cityURL + state_id);
  }
  getStateByCountry(country_id: number) {
    return this._http.get<StateModel[]>(this.stateURL + country_id);
  }
  getCityByCountry(country_id: number) {
    return this._http.get<CityModel[]>(this.cityURL + country_id);
  }
  getAllCountries(): Observable<CountryModel[]> {
    return this._http.get<CountryModel[]>(this.countryURL).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getAllPackages() {
    return this._http.get<SubscriptionTypeModel[]>(this.packageURL);
  }
  getAllSubs() {
    return this._http.get<SubscriptionModel[]>(this.subURL);
  }
  getSubByPackages(sub_type_id) {
   
    return this._http.get<SubscriptionModel[]>(this.subURL + sub_type_id);
  }




  private handleError(ex: HttpErrorResponse) {
    if (ex.error instanceof ErrorEvent) {
      console.log("client side error", ex.message);
    } else {
      console.log("server side error", ex.message);
    }
    return throwError("something went wrong");
  }
}
