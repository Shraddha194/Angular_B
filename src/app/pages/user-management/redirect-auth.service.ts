import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BnsServiceService } from './bns-service.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectAuthService implements CanActivate {
  constructor(
    private _bnsservice: BnsServiceService,
    private _router: Router
  ) {}

  canActivate(
    route: import('@angular/router').ActivatedRouteSnapshot,
    _state: import('@angular/router').RouterStateSnapshot
  ):
    | boolean
    | import('@angular/router').UrlTree
    | import('rxjs').Observable<boolean | import('@angular/router').UrlTree>
    | Promise<boolean | import('@angular/router').UrlTree> {
    if (localStorage.length!==0) {
      return true;
    }
    this._bnsservice.redirectURL = _state.url;
    this._router.navigate(['/login']);
  }
}
