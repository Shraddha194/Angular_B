import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotelManagementComponent } from './hotel-management/hotel-management.component';

import { EditHotelComponent } from './edit-hotel/edit-hotel.component';
import { ViewHotelComponent } from './view-hotel/view-hotel.component';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule, MatTableModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatPaginatorModule, MatIconModule, MatCheckboxModule, MatListModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatCardModule } from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipesModule } from 'src/app/theme/pipes/pipes.module';
import { AddHotelComponent } from './add-hotel/add-hotel.component';

export const routes = [
  { path: '', component: HotelManagementComponent, pathMatch: 'full' },
  { path: 'add', component: AddHotelComponent, data: { breadcrumb: 'Add Hotel' }, pathMatch: 'full' },
  { path: 'view/:hotel_id', component: ViewHotelComponent, data: { breadcrumb: 'View Hotel' }, pathMatch: 'full' },
  {path:'edit/:hotel_id', component: EditHotelComponent, data: { breadcrumb: 'Edit Hotel' }}
];
@NgModule({
  declarations: [HotelManagementComponent, AddHotelComponent, EditHotelComponent, ViewHotelComponent],
  imports: [
    CommonModule,
    CdkTableModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatIconModule,
    MatCheckboxModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    QuillModule,
    SharedModule,
    PipesModule
  ]
})
export class HotelManagementModule { }
