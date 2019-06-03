import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { QuillModule } from "ngx-quill";
import { SharedModule } from "src/app/shared/shared.module";
import { PipesModule } from "src/app/theme/pipes/pipes.module";
import { AddpackagematComponent } from "./addpackagemat/addpackagemat.component";
import { ViewpackagematComponent } from "./viewpackagemat/viewpackagemat.component";
import { HotelListComponent } from "./hotel-list/hotel-list.component";
import { PackageListComponent } from "./package-list/package-list.component";
import {
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
  MatCardModule
} from "@angular/material";
import { CdkTableModule } from "@angular/cdk/table";
import { EditpackagematComponent } from "./editpackagemat/editpackagemat.component";


export const routes = [
  { path: "", component: PackageListComponent, pathMatch: "full" },
  {
    path: "add",
    component: AddpackagematComponent,
    data: { breadcrumb: "Add Package" },
    pathMatch: "full"
  },
  {
    path: "view/:sub_id",
    component: ViewpackagematComponent,
    data: { breadcrumb: "View Package" },
    pathMatch: "full"
  },
  {
    path: "hotellist",
    component: HotelListComponent,
    data: { breadcrumb: "Hotel List" },
    pathMatch: "full"
  },
  {
    path: "edit/:sub_id",
    component: EditpackagematComponent,
    data: { breadcrumb: "Edit Package" }
  }
];

@NgModule({
  declarations: [
    PackageListComponent,
    AddpackagematComponent,
    ViewpackagematComponent,
    HotelListComponent,
    EditpackagematComponent,
 
  ],
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
  ],
})
export class PackageManagementModule {}
