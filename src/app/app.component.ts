import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {  Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, PublicClientApplication  } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'Darwin';
  public isUserLoggedIn:boolean = false;
  showFiller = false;
  opened = false;
  currentUser: string;

  private readonly _destroying$ = new Subject<void>();

  constructor(private _router: Router,
    private _authService: MsalService,
     private _msalBroadcastService: MsalBroadcastService,
     private  _userService : UserService
     ){
    this.isUserLoggedIn = false;


  }

  public login(){
    // this.isUserLoggedIn = true;
    // this._router.navigate(['workmanagement'])

   



    this._authService.loginPopup()
    .subscribe({
      next: (result) => {
        console.log(result.account);
       //alert(result.account?.username);
        console.log("In",result);

         this.setCurrentUser(result.account?.username??'');
         this.isUserLoggedIn = true;
      //  localStorage.setItem('accessToken', result.accessToken);
        //this.setLoginDisplay();
        this._router.navigate(['performancedashboard'])
      },
      error: (error) => console.log("error from funciton ", error)
    });

  }

  ngOnInit(){
   

     console.log(this._authService.instance.getAllAccounts());

     var isOrgUser = this._authService.instance.getAllAccounts().filter(data =>
         data.username.indexOf("wns.com") > -1
      )
 
     
      console.log("cheked org user ",isOrgUser);


      if( isOrgUser.length == 1){
       // alert("in for navigation " + isOrgUser[0].username??'');
        this.isUserLoggedIn = true;

        
      
        this.setCurrentUser(isOrgUser[0].username??''); 

        
        let currentNavigation = document.URL.split('/');
        let urlToNavigate = currentNavigation[currentNavigation.length-1];
        
        this._router.navigate([urlToNavigate])
       //this._router.navigate(['performancedashboard'])
      }
      else{
        let msalInstance: PublicClientApplication = this._authService.instance as PublicClientApplication;
    msalInstance["browserStorage"].clear();
      }


     // in app.component.ts       
     this._msalBroadcastService.msalSubject$
     .pipe(
       filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      // takeUntil(this._destroying$)
     )
     .subscribe((result: EventMessage) => {
 
       //alert('in call');
       // Do something with event payload here
     });
 
    //  this._msalBroadcastService.inProgress$
    //       .subscribe((result) => {
    //        alert('inside boracsat')
    //        console.log('inside broadcast', result)
    //      // Do something related to user accounts or UI here
         
    //    })

      
   }


  logout() {
   
    this._authService.logout();

    
    alert("Logout successfully.")
    this.isUserLoggedIn = false;
  this._authService.logout();

    

    
    //this._router.navigate(['/']);
  }

  closeMenuBar(){
    this.opened = false;
  }

  ngOnDestroy(): void {
		this._destroying$.next(undefined);
		this._destroying$.complete();
	}

  setCurrentUser(userId: string){
    this._userService.setCurrentUser(userId);
  }

  reloadCurrentRoute() {
    const currentUrl = this._router.url;
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
    });
  }

}

/*
<header>

  <mat-toolbar class="toolbar-bg-white">
    <button mat-icon-button (click)="opened = !opened" *ngIf="isUserLoggedIn"><mat-icon>menu</mat-icon></button>

    <img class="logo-final" src="assets/Images//logo-final.png" />
    <span class="example-spacer"></span>

    <button mat-icon-button class="example-icon mat-clr-primary" (click)="login()"
      aria-label="Example icon-button with share icon" *ngIf="!isUserLoggedIn">
      <mat-icon class="mat-primary-icon">login</mat-icon>
    </button>

    <button mat-icon-button *ngIf="isUserLoggedIn">
      <mat-icon>account_circle</mat-icon>
    </button>

  </mat-toolbar>
</header>


<!-- <mat-drawer-container class="example-container">
  <mat-drawer mode="side" opened>Drawer content</mat-drawer>
  <mat-drawer-content><router-outlet></router-outlet></mat-drawer-content>
</mat-drawer-container> -->
<mat-sidenav-container>
  
  <mat-sidenav [(opened)]="opened">
    <!-- <mat-menu #appMenu="matMenu">
    <button mat-menu-item [matMenuTriggerFor]="subMenu">Work Management</button>
   </mat-menu> -->
    <div class="side-menu-img">
      <i><img src="assets/Images/Workflow Management (1).png" style="width:50px;"> </i>
    </div>
    <a [matMenuTriggerFor]="workMenu" class="side-menu">


      <span class="side-menu-text">Work Management</span></a>

    <mat-menu #workMenu="matMenu" xPosition="after">

      <a mat-menu-item routerLink="workmanagement">Work Allocation</a>
      <a mat-menu-item routerLink="reallocatcase">Manual Reallocation</a>
    </mat-menu>

    <div class="side-menu-img">
      <mat-icon class="custom-icon" style="width:100px;color: white;">bar_chart</mat-icon>
    </div>
    <a [matMenuTriggerFor]="dashboarMenu" class="side-menu">


      <span class="side-menu-text">Performance Dashboard</span></a>

    <mat-menu #dashboarMenu="matMenu" xPosition="after">

      <a mat-menu-item routerLink="performancedashboard">Business Performance</a>
      <a mat-menu-item routerLink="insightdashboard">Insight Dashboard</a>
      <a mat-menu-item routerLink="tabulardashboard">Tabular Dashboard</a>
    </mat-menu>

    <div class="side-menu-img">
      <mat-icon class="custom-icon" style="width:100px;color: white;">storage</mat-icon>
    </div>
    <a class="side-menu">
      
      <span class="side-menu-text"  style="cursor: pointer;"  routerLink="rawdata">Raw Data</span>
    </a>
      <!-- <a mat-menu-item routerLink="rawdata">Raw data</a> -->
      
    <div class="side-menu-img">
      <i><img src="assets/Images/User Management (1).png" style="width:50px;"> </i>
    </div>
    <a [matMenuTriggerFor]="userMenu" class="side-menu">


      <span class="side-menu-text">User Management</span></a>

    <mat-menu #userMenu="matMenu" xPosition="after">

      <a mat-menu-item routerLink="skillmanagement">Skillset Mapping</a>

    </mat-menu>
    <div class="side-menu-img">
      <mat-icon class="custom-icon" style="width:100px;color: white;">help</mat-icon>
    </div>
    <a [matMenuTriggerFor]="helpMenu" class="side-menu">
      
      <span class="side-menu-text">Help</span></a>
      <mat-menu #helpMenu="matMenu" xPosition="after">

        <a mat-menu-item routerLink="darwindocument">Darwin Document</a>
  
      </mat-menu>
  </mat-sidenav>


  <mat-sidenav-content>
    <div [ngClass]="{'home-page': !isUserLoggedIn}"></div>

    <router-outlet></router-outlet>
  </mat-sidenav-content>
</mat-sidenav-container>






<footer *ngIf="!isUserLoggedIn">
  <mat-toolbar class="toolbar-bg-white">

    <p class="footer-text" style="padding: 11px 0;">Copyright © 2019 | WNS (Holdings) Ltd. All rights reserved.</p>

    <p class="powered-by footer-text  text-right">
      Powered By
    <p></p>

    <img src="assets/Images//footer-logo.png" />
    <p>
  </mat-toolbar>
</footer>
*/