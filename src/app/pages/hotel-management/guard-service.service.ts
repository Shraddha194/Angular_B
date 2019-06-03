import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EditHotelComponent } from './edit-hotel/edit-hotel.component';

@Injectable({
  providedIn: 'root'
})
export class GuardServiceService implements CanDeactivate<EditHotelComponent> {

  canDeactivate(
    component: EditHotelComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (component.isDirty()) {
      return confirm("Are you sure?");
    }

    return true;
  }

  constructor() { }
}
