import { Injectable } from '@angular/core';
import { endPoints } from 'src/environments/environment';
import {
  HttpHeaders,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { SubscriptionService } from './models/subscription-service';
import { SubscriptionServiceAudit } from './models/subscription-service-audit';
import { AddSubscription } from './models/add-package';
import { ViewPackageById } from './models/view-package-by-id';
import { HotelService } from './models/servicedetails';
import { ViewPackage } from './models/view-package';
import { PackageList } from './models/packagelist';
import { Hotellist } from './models/hotellist';
import { PackageType } from './models/package-type';
import { PackageName } from './models/package-name';
import { AllService } from './models/all-service';
import { Packageview } from './models/packageview';

@Injectable({
  providedIn: 'root'
})
export class BnsPackageService {
  hotelList: Hotellist[] = [];
  packageList: PackageList[] = [];
  url = endPoints.url;
  packageServiceAddUrl =
    this.url + 'hotelsubscriptionservice/addsubscriptionservice';
  hotelViewUrl = this.url + 'hotellist/';
  packageUpdateUrl = this.url + 'hotelsubscription/updatesubscription/';
  packageViewUrl = this.url + 'hotelsubscription/getsubscriptiondetails';
  packageByIdViewUrl = this.url + 'hotelsubscription/getsubscriptionbyid/'; // her
  packageByIdUrl = this.url + 'hotelsubscription/getsubscriptionbyid/'; // here
  packageAddUrl = this.url + 'hotelsubscription/addsubscription';
  packageAuditAddUrl =
    this.url + 'hotelsubscriptionserviceaudit/addsubscriptionserviceaudit';
  packageDeleteUrl =
    this.url + 'hotelsubscriptionservice/deletesubscriptionservice/';
  packageServiceDeleteUrl =
    this.url + 'hotelsubscriptionservice/deletesubscriptionservice/';
  packageServiceAuditDeleteUrl =
    this.url + 'hotelsubscriptionserviceaudit/deletesubscriptionserviceaudit/';
  packageCheckUrl = this.url + 'hotelsubscription/checksubscription/';
  packageServiceByPackageIdViewUrl =
    this.url + 'hotelsubscriptionservice/getservicesbysubscription/';
  hotelAllViewUrl = this.url + 'hotelservices/';
  packageTypeAllViewUrl = this.url + 'hotelsubscriptiontype';
  packageNameurl = this.url + 'hotelsubscription/getsubscriptionname/';
  commonhearder = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private httpClient: HttpClient) {}

  getHotelListOnSearch(name) {
    return this.hotelList.filter(x => x.Package_Name === name);
  }
  getPackageListOnFilter(date) {
    return this.packageList.filter(x => x.Created_On.substring(0, 10) === date);
  }
  getAllPackgeList() {
    return this.httpClient.get<PackageList[]>(
      this.url + 'hotelsubscription/getsubscriptiondetails'
    );
  }

  getAllHotels() {
    return this.httpClient.get<Hotellist[]>(this.url + 'hotellist');
  }

  getAllPackageType() {
    return this.httpClient.get<PackageType[]>(
      this.url + 'hotelsubscriptiontype/'
    );
  }

  getPackageNameByPackageType(id) {
    return this.httpClient.get<PackageName[]>(
      this.url + 'hotelsubscription/getsubscriptionname/' + id
    );
  }

  getPackageTypeById(id) {
    return this.httpClient.get<PackageType[]>(
      this.url + 'hotelsubscriptiontype/' + id
    );
  }

  getAllServices() {
    return this.httpClient.get<AllService[]>(this.url + 'hotelservices');
  }

  packageDetailsByPackageId(id) {
    return this.httpClient.get<Packageview[]>(
      this.url + 'hotelsubscription/getsubscriptionbyid/' + id
    );
  }

  // -------------add-edit-view----

  addPackageServices(item: SubscriptionService) {
    const body = JSON.stringify(item);
    return this.httpClient
      .post(this.packageServiceAddUrl, body, { headers: this.commonhearder })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  addPackageAudit(item: SubscriptionServiceAudit) {
    const body = JSON.stringify(item);
    return this.httpClient
      .post(this.packageAuditAddUrl, body, { headers: this.commonhearder })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  addPackage(item: AddSubscription) {
    const body = JSON.stringify(item);
    return this.httpClient
      .post(this.packageAddUrl, body, { headers: this.commonhearder })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getPackageById(sub_id: number) {
    return this.httpClient.get(this.packageByIdUrl + sub_id).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  viewPackageById(id: number) {
    return this.httpClient.get<ViewPackageById[]>(this.packageByIdViewUrl + id);
  }
  getServicesByPackageId(sub_id: number) {
    return this.httpClient
      .get<HotelService[]>(this.packageServiceByPackageIdViewUrl + sub_id)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  updatePackage(sub_id: number, item: ViewPackage) {
    const body = JSON.stringify(item);
    return this.httpClient
      .put(this.packageUpdateUrl + sub_id, body, {
        headers: this.commonhearder
      })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  deletePackageServices(sub_id: number, item: ViewPackage) {
    const body = JSON.stringify(item);
    return this.httpClient.delete(this.packageServiceDeleteUrl + sub_id).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  checkPackage(id: number[]) {
    return this.httpClient.get(this.packageCheckUrl + id);
  }
  deletePackage(id: number[]) {
    return this.httpClient.delete(this.packageDeleteUrl + id);
  }
  deletePackageService(id: number[]) {
    return this.httpClient.delete(this.packageServiceAuditDeleteUrl + id);
  }
  getAllPackageNameByPackageTypeId(id) {
    return this.httpClient.get(this.packageNameurl + id);
  }
  getAllHotelServices() {
    return this.httpClient.get<HotelService[]>(this.hotelAllViewUrl).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  private handleError(ex: HttpErrorResponse) {
    if (ex.error instanceof ErrorEvent) {
      console.log('client side error', ex.message);
    } else {
      console.log('server side error', ex.message);
    }
    return throwError('something went wrong');
  }
}
