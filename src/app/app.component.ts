import { Component, ViewChild } from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material';
import { AlertsService } from 'angular-alert-module';
import { ConnectionService } from 'ng-connection-service';
import { BnsServiceService } from './pages/user-management/bns-service.service';
import { InformativeDialogBoxComponent } from './informative-dialog-box/informative-dialog-box.component';
import { SessionValidateDialogComponent } from './session-validate-dialog/session-validate-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public settings: Settings;
  bnsSessionExpired = false;
  isConnected = true;
  constructor(
    public appSettings: AppSettings,
    private service: BnsServiceService,
    private bnsConnectionService: ConnectionService,
    private bnIdle: BnNgIdleService,
    private router: Router,
    private dialog:MatDialog,
    private bnsservice:BnsServiceService
  ) {
    this.settings = this.appSettings.settings;

      this.bnIdle.startWatching(15).subscribe(res => {
        if (res) {
        
          this.bnsSessionExpired = true;
          
          
          if (localStorage.length>0) {
          const dialogRef=this.dialog.open(SessionValidateDialogComponent, {
            width: '250px',
            height:'150px',
            data: "Session Expired! Do you want more time?",
            hasBackdrop:true
          });
          dialogRef.afterClosed().subscribe(result=>{
            if(result)
            {
              localStorage.clear();
              this.router.navigate(['/login']);
            }
          });
          
         
        }
        }
      });
    
    this.bnsConnectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.router.navigate(['/error']);
      } else {
        this.router.navigate([this.service.redirectURL]);
      }
    });
  }

  ngOnInit() {}
}
