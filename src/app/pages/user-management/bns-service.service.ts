import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

import { endPoints } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Userclass } from './models/userclass';
import { EmailDetails } from './models/email-details';
import { Editprofile } from './models/editprofile';

@Injectable({
  providedIn: 'root'
})
export class BnsServiceService {

  redirectURL = '';
  bnsuserlogin="user/login/";
  bnsForgotPassword="user/";
  bnsChangePassAfterLogin="user/changePassword/";
  bnsgetData="user/getData/";
  bnsgetEmail="user/verifyEmail/";
  bnsChangePass="user/";
  bnsgetUserByEmail="user/fname/";
  bnsAddUser="user/";
  bnsSendEmail="user/sendmail";
  bnsVerifyEmail="user/verifyEmail/";
  bnsnoofhotel="user/count/hotel";
  bnsnoofpkg="user/count/package";
  bnsupdateprofile="user/updateProfileWithoutimage/";
  bnsupdateprofileWithImg="user/updateProfileWithimage/";
  constructor(private bnsHttp: HttpClient, private _router: Router) {}
  login(item) {
    const body = JSON.stringify(item);
    return this.bnsHttp
      .post(endPoints.url+this.bnsuserlogin, body, { headers: endPoints.hotelHeader })
      .pipe(
        retry(3),
        catchError(this.handleErr)
      );
  }
  forgotPassword(item) {
    const json = JSON.stringify(item);
    return this.bnsHttp
      .put(endPoints.url+this.bnsForgotPassword + item.emailId, json, {
        headers: endPoints.hotelHeader
      })
      .pipe(
        retry(3),
        catchError(this.handleErr)
      );
  }
  changePassword(item) {
    const json = JSON.stringify(item);
    return this.bnsHttp
      .put(endPoints.url+this.bnsChangePassAfterLogin + item.emailId, json, {
        headers: endPoints.hotelHeader
      })
      .pipe(
        retry(3),
        catchError(this.handleErr)
      );
  }
  getUserData(emailId) {
    return this.bnsHttp.get(endPoints.url+this.bnsgetData + emailId).pipe(
      retry(3),
      catchError(this.handleErr)
    );
  }
  getUserEmail(emailId: string) {
    return this.bnsHttp.get(endPoints.url+this.bnsgetEmail + emailId);
  }
  getUserPassword(emailId: string) {
    return this.bnsHttp.get<[]>(endPoints.url+this.bnsChangePass + emailId);
  }
  updateProfile(profileData:Editprofile)
  {
    const body=JSON.stringify(profileData);
    console.log(localStorage.getItem('id'));
    return this.bnsHttp.put(endPoints.url+this.bnsupdateprofile+localStorage.getItem('id'),body,{
      headers: endPoints.hotelHeader
    })
  }
  updateProfileWithPhoto(profile:FormData)
  {
    return this.bnsHttp.put(endPoints.url+this.bnsupdateprofileWithImg+localStorage.getItem('id'),profile,{ observe: "events" });
  }
  getUserByEmail(item) {
    const body = JSON.stringify(item);
    return this.bnsHttp.post(endPoints.url+this.bnsgetUserByEmail, body, {
      headers: endPoints.hotelHeader
    });
  }
  updateUserData(item: Userclass) {
    const body = JSON.stringify(item);

    return this.bnsHttp.put(this.login + item.emailId, body, {
      headers: endPoints.hotelHeader
    });
  }
  addUser(item: FormData) {
    return this.bnsHttp.post(endPoints.url+this.bnsAddUser, item, {
      observe: 'events'
    });
  }
  sendEmail(item: EmailDetails) {
    const body = JSON.stringify(item);

    return this.bnsHttp.post(endPoints.url+this.bnsSendEmail, body, {
      headers: endPoints.hotelHeader
    });
  }
  verifyEmail(item) {
    const json = JSON.stringify(item);
    return this.bnsHttp
      .post(endPoints.url+this.bnsVerifyEmail, json, { headers: endPoints.hotelHeader })
      .pipe(
        retry(3),
        catchError(this.handleErr)
      );
  }
  getNoofPackages() {
    return this.bnsHttp.get(endPoints.url+this.bnsnoofpkg);
  }
  getNoofHotel() {
    return this.bnsHttp.get(endPoints.url+this.bnsnoofhotel);
  }
  handleErr(err: HttpErrorResponse) {
    if (err.error instanceof ErrorEvent) {
      console.log('Client side event', err.message);
    } else {
      console.log('Server side event', err.message);
    }
    return throwError('Something went Wrong');
  }
  logout() {
    localStorage.clear();
    this._router.navigate(['']);
  }
}
