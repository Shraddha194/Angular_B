import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OverlayContainer } from "@angular/cdk/overlay";
import { CustomOverlayContainer } from "./theme/utils/custom-overlay-container";
import { BnNgIdleService } from "bn-ng-idle";
import { AgmCoreModule } from "@agm/core";
import { ConnectionService } from "ng-connection-service";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};
import { CookieService } from "ngx-cookie-service";
import { CalendarModule } from "angular-calendar";
import { SharedModule } from "./shared/shared.module";
import { PipesModule } from "./theme/pipes/pipes.module";
import { routing } from "./app.routing";

import { AppSettings } from "./app.settings";
import { AppComponent } from "./app.component";
import { PagesComponent } from "./pages/pages.component";
import { NotFoundComponent } from "./pages/errors/not-found/not-found.component";
import { ErrorComponent } from "./pages/errors/error/error.component";

import { TopInfoContentComponent } from "./theme/components/top-info-content/top-info-content.component";
import { SidenavComponent } from "./theme/components/sidenav/sidenav.component";
import { VerticalMenuComponent } from "./theme/components/menu/vertical-menu/vertical-menu.component";
import { HorizontalMenuComponent } from "./theme/components/menu/horizontal-menu/horizontal-menu.component";
import { FlagsMenuComponent } from "./theme/components/flags-menu/flags-menu.component";
import { FullScreenComponent } from "./theme/components/fullscreen/fullscreen.component";
import { ApplicationsComponent } from "./theme/components/applications/applications.component";
import { MessagesComponent } from "./theme/components/messages/messages.component";
import { UserMenuComponent } from "./theme/components/user-menu/user-menu.component";
import { FavoritesComponent } from "./theme/components/favorites/favorites.component";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CustomEmailAsyncDirectiveDirective } from "./pages/user-management/asynchronous-validators/custom-email-async-directive.directive";
import { ChangePasswordComponent } from "./pages/user-management/change-password/change-password.component";
import { CustomAsyncEmailValidatorDirective } from "./pages/user-management/asynchronous-validators/custom-async-email-validator.directive";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { UrlSerializer } from "@angular/router";
import { AlertsModule } from "angular-alert-module";
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
  MatCardModule,

  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS
} from "@angular/material";
import { ForgotPasswordComponent } from "./pages/user-management/forgot-password/forgot-password.component";
import { Lowercaseconvert } from "./pages/user-management/lowercaseconvert";
import { BnsInterceptor } from "./bns-interceptor";
import { ConfirmDeleteDialogComponent } from "./confirm-delete-dialog/confirm-delete-dialog.component";
import { InformativeDialogBoxComponent } from "./informative-dialog-box/informative-dialog-box.component";
import { UserProfileComponent } from './pages/user-management/user-profile/user-profile.component';
import { EditProfileComponent } from './pages/user-management/edit-profile/edit-profile.component';
import { QuillModule } from "ngx-quill";
import { SessionValidateDialogComponent } from './session-validate-dialog/session-validate-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDialogModule,
    MatCardModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAAYi6itRZ0rPgI76O3I83BhhzZHIgMwPg"
    }),
    AlertsModule.forRoot(),
    PerfectScrollbarModule,
    CalendarModule.forRoot(),
    SharedModule,
    PipesModule,
    HttpClientModule,
    routing,
    PerfectScrollbarModule,
    QuillModule,
    SharedModule,
    PipesModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent,
    ErrorComponent,
    TopInfoContentComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    FavoritesComponent,

    ForgotPasswordComponent,
    CustomEmailAsyncDirectiveDirective,
    ChangePasswordComponent,
    CustomAsyncEmailValidatorDirective,
    ConfirmDeleteDialogComponent,
    InformativeDialogBoxComponent,
    UserProfileComponent,
    EditProfileComponent,
    SessionValidateDialogComponent
  ],
  entryComponents: [VerticalMenuComponent,SessionValidateDialogComponent, ConfirmDeleteDialogComponent,InformativeDialogBoxComponent],
  providers: [
    BnNgIdleService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: HTTP_INTERCEPTORS, useClass: BnsInterceptor, multi: true },
    AppSettings,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    CookieService,
    ConnectionService,
    {
      provide: UrlSerializer,
      useClass: Lowercaseconvert
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
