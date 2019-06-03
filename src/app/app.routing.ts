import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';

import { RedirectAuthService } from './pages/user-management/redirect-auth.service';
import { ChangePasswordComponent } from './pages/user-management/change-password/change-password.component';
import { ForgotPasswordComponent } from './pages/user-management/forgot-password/forgot-password.component';

import { UserProfileComponent } from './pages/user-management/user-profile/user-profile.component';
import { EditProfileComponent } from './pages/user-management/edit-profile/edit-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [RedirectAuthService],
    children: [
      {
        path: '',
        loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path:'profile',
        component:UserProfileComponent
      },
      {
        path: 'demoRequest',
        loadChildren: './pages/users/users.module#UsersModule'
      },
      {
        path: 'hotel-management',
        loadChildren:
          './pages/hotel-management/hotel-management.module#HotelManagementModule',
        data: { breadcrumb: 'Hotel-management' }
      },
      
      {
        path: 'ui',
        loadChildren: './pages/ui/ui.module#UiModule',
        data: { breadcrumb: 'UI' }
      },
      {
        path: 'package-management',
        loadChildren:
          './pages/package-management/package-management.module#PackageManagementModule',
        data: { breadcrumb: 'Package-Management' }
      },
      {
        path: 'form-controls',
        loadChildren:
          './pages/form-controls/form-controls.module#FormControlsModule',
        data: { breadcrumb: 'Form Controls' }
      }
    ]
  },
  // { path: 'landing', canActivate:[RedirectAuthService], loadChildren: './pages/landing/landing.module#LandingModule' },
  { path: 'login', loadChildren: './pages/user-management/login/login.module#LoginModule' },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
    data: { breadcrumb: 'changePassword' }
  },
  {
    path:'editProfile',
    component:EditProfileComponent,
    data:{breadcrumb:'edit-profile'}
  },
  {
    path: 'register',
    loadChildren: './pages/user-management/register/register.module#RegisterModule'
  },
  
  { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },

  { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
