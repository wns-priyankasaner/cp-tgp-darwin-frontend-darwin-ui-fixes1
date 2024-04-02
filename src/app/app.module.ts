import { CUSTOM_ELEMENTS_SCHEMA, NgModule,ErrorHandler, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { WorkAllocationComponent } from './work-management/work-allocation/work-allocation.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { SentViewEmailDialogComponent } from './model-dialog/sent-view-email-dialog/sent-view-email-dialog.component';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';


//import { SendEmailComponent } from './model-dialog/send-email-dialog/send-email-dialog.component'
import { SendEmailComponent } from './model-dialog/send-email-dialog/send-email-dialog.component'
import { RawDataExtractComponent } from './raw-data/raw-data-extract/raw-data-extract.component';
import { BreakDialogComponent } from './model-dialog/break-dialog/break-dialog.component';
import { SearchDialogComponent } from './model-dialog/search-dialog/search-dialog.component';
import { ComposeNewEmailDialogComponent } from './model-dialog/compose-new-email-dialog/compose-new-email-dialog.component';
import { DatePipe } from '@angular/common';
import { EmailbodyDialogSentviewComponent } from './model-dialog/emailbody-dialog-sentview/emailbody-dialog-sentview.component';
import { ConfirmationDialogComponent } from './model-dialog/confirmation-dialog/confirmation-dialog.component';

import { TabularDataExtractComponent } from './tabular-dashboard/tabular-data-extract/tabular-data-extract.component';
import { SkillManagementComponent } from './user-management/skill-management/skill-management.component';
import { ReallocateCaseComponent } from './manual-reallocation/reallocate-case/reallocate-case.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InsightDashboardComponent } from './insights-dashboard/insight-dashboard/insight-dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { PerformanceDashboardComponent } from './business-performance/performance-dashboard/performance-dashboard.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { OutstandingBarGraphComponent } from './business-performance/outstanding-bar-graph/outstanding-bar-graph.component';
import { ReceivedVsCompletedComponent } from './business-performance/received-vs-completed/received-vs-completed/received-vs-completed.component';
import { SlabreakdownBarGraphComponent } from './business-performance/slabreakdown-bar-graph/slabreakdown-bar-graph/slabreakdown-bar-graph.component';
import { SlaLineGraphComponent } from './business-performance/sla-line-graph/sla-line-graph/sla-line-graph.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HoursBarGraphComponent } from './business-performance/hours-bar-graph/hours-bar-graph.component';
import { AhtLineGraphComponent } from './business-performance/aht-line-graph/aht-line-graph.component';
import { ErrorHandlerService } from './services/error-handler.service';
import { MsalGuard, MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { UserService } from './services/user.service';

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;

@NgModule({
  declarations: [
    AppComponent,
    WorkAllocationComponent,
    SentViewEmailDialogComponent,
    SendEmailComponent,
    RawDataExtractComponent,
    BreakDialogComponent,
    SearchDialogComponent,
    ComposeNewEmailDialogComponent,
    EmailbodyDialogSentviewComponent,
    ConfirmationDialogComponent,
   
    
    RawDataExtractComponent,
    SendEmailComponent,
    TabularDataExtractComponent,
    SkillManagementComponent,
    ReallocateCaseComponent,
    InsightDashboardComponent,
    PerformanceDashboardComponent,
    SidenavComponent,
    OutstandingBarGraphComponent,
    ReceivedVsCompletedComponent,
    SlabreakdownBarGraphComponent,
    LoadingSpinnerComponent,
    SlabreakdownBarGraphComponent,
    SlaLineGraphComponent,
    
    HoursBarGraphComponent,
    AhtLineGraphComponent
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatGridListModule,
    MatCheckboxModule,
    MatGridListModule,
    MatTooltipModule,
    MatCheckboxModule,
    HighchartsChartModule,
    MatExpansionModule,
    MatProgressSpinnerModule,

       MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: "c7c632c7-8c29-441e-b052-190a30315767", // Application (client) ID from the app registration
          authority:
            "https://login.microsoftonline.com/23f8ecfb-6a90-46c2-96ca-4a362721b82c" ,
            postLogoutRedirectUri: 'https://darwin-dev.wnstriangenxt.com'
            
         // redirectUri: "http://localhost:4200", // This is your redirect URI
        },
        cache: {
          cacheLocation: "sessionStorage",
          storeAuthStateInCookie: false, // Set to true for Internet Explorer 11
        },
      }),
      {
         interactionType: InteractionType.Redirect,
         authRequest:{
          scopes:['user.Read']
         }
      },
    
      {
        interactionType:InteractionType.Redirect,
        
        protectedResourceMap: new Map([
          ['https://login.microsoftonline.com/329e91b0-e21f-48fb-a071-456717ecc28e',['user.Read']]
        ])
      }
      
   ),

  ],

  

  exports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatMenuModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    HttpClientModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatGridListModule,
    MatProgressSpinnerModule
  ],


  

  providers: [DatePipe, UserService,
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { maxWidth: '95vw', hasBackdrop: true } },
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting: forwardRef(() => ngDefaultControl),
    //   multi: true,
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi:true 
    }, MsalGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
