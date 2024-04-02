import { WorkAllocationService } from './../../services/work-allocation.service';
import { IWorkmanagementModel } from './../../models/work-management/workmanagement';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SentViewEmailDialogComponent } from 'src/app/model-dialog/sent-view-email-dialog/sent-view-email-dialog.component';
import { SendEmailComponent } from 'src/app/model-dialog/send-email-dialog/send-email-dialog.component'
import { BreakDialogComponent } from 'src/app/model-dialog/break-dialog/break-dialog.component';
import { SearchDialogComponent } from 'src/app/model-dialog/search-dialog/search-dialog.component';
import { ComposeNewEmailDialogComponent } from 'src/app/model-dialog/compose-new-email-dialog/compose-new-email-dialog.component';
import { ICategory } from 'src/app/models/common/category';
import { IUserProductivity } from 'src/app/models/email/userproductivity';
import { CommonService } from 'src/app/services/common.service';
import { EmailService } from 'src/app/services/email.service';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { UserService } from 'src/app/services/user.service';
interface ContactType {
  id: number;
  description: string;
}

@Component({
  selector: 'app-work-allocation',
  templateUrl: './work-allocation.component.html',
  styleUrls: ['./work-allocation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WorkAllocationComponent implements OnInit {
  userProductivity: IUserProductivity;
  categories: ICategory[];
  wmEmailInbox: any
  emailInbox: string;
  incorrectTagging = true;
  incorrectCategory: boolean = false;
  workEmailLoaded = false;
  showCategory = false;
  showMPANandAccountNo = false;
  showNoofRequest = false;
  selectedAction: string;
  sumValue: number | undefined;
  getNextWorkData: any;
  UserEmail: string;
  iscallnext: boolean = false;
  showFutureDate = false;
  workManagement: IWorkmanagementModel = {} as IWorkmanagementModel;
  minDate = new Date();
  isLoading: boolean = false;
  isFieldsDisabled = true;
  subcategories: ISubCategory[];
  emailInboxCategory: any = 0;
  actionsdata: any[];
  contacttypedata: any = [];
  selectedValue: string;
  //selectedcontacttypeValue: number;
  selectedValueaction: number;
  showBulkRequest = false;
  contacttypeId: any;
  timerColor: string = '#1ABB9C'; // Initial color is green
  timer: any;
  timerMinutes: number = 0;
  timerSeconds: number = 0;
  displayTime: string = '00:00';
  timerRunning: boolean = false;
  commentText: string = '';
  accountno: string = '';
  Mpan: any;
  incorrectTaggingNo: boolean = true;
  bulkRequest: boolean = false;
  data: any;
  isViewOnlyMode: boolean = false;
  currentUserId: string;


  onKeyPress(event: KeyboardEvent): void {

    const keyCode = event.which || event.keyCode;

    if (keyCode < 48 || keyCode > 57) {

      event.preventDefault();
    }
  }
  constructor(private cdr: ChangeDetectorRef, public dialog: MatDialog, 
    private _commonService: CommonService, 
    private _emailService: EmailService,
    private _userService:UserService) {
       
  }

  ngOnInit() {
    this.selectedAction = '';
    this.getUserProductivity();
    this.iscallnext = false;
    this.isFieldsDisabled = true;
    this.showBulkRequest = false;
    this.getContactType();
    this.bulkRequest = false;
   // this.getNextWorkData();

    
    this._userService.currentUser$.subscribe(s=>{
       this.currentUserId = s;
    })


  }

  openSentViewDialog() {

    const dialogRef = this.dialog.open(SentViewEmailDialogComponent, {
     // width: '100%',
     // height: '100%',
    //  disableClose: true,
      //panelClass: 'full-width-dialog'
      maxWidth: '100vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  openSearchDialog() {
    const dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
    });
    dialogRef.componentInstance.modalClosed.subscribe(data => {

      console.log('Data Emitted from model', data);
      this.getnextwork(data);
    })
  }
  // openSearchDialog() {
  //   const dialogRef = this.dialog.open(SearchDialogComponent, {
  //     width: '100%',
  //     height: '100%',
  //     disableClose: true,
  //   });

  //   dialogRef.componentInstance.modalClosed.subscribe((data) => {
  //     console.log('Dialog result:',data);

  //   });
  // }
  openComposeNewDialog() {
    const dialogRef = this.dialog.open(ComposeNewEmailDialogComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
    });
  }
  getCategories() {
    this._commonService.getCategories().subscribe(result => {
      console.log(result);
      this.categories = result;
    })
  }
  getSubCategories(categoryId: number) {

    categoryId = categoryId == undefined ? 0 : categoryId;

    this._commonService.getSubCategories(categoryId).subscribe(result => {

      this.subcategories = result;
    })

  }
  emailInboxChange(categoryId: any) {

    this.emailInboxCategory = 0;
    this._commonService.getSubCategories(categoryId).subscribe(result => {

      this.subcategories = result;

    });
  }

  emailInboxCategoryChange() {

  }
  getActions() {
    this._commonService.getActions().subscribe(result => {
      this.actionsdata = result;
      //console.log('Action data',this.actionsdata );
    });
  }

  getContactType() {
    this._commonService.getContactType().subscribe(result => {
      this.contacttypedata = result;
      console.log('Contact Type list data', this.contacttypedata);
    });
  }

  emailInboxChanged(catId: any) {
    //alert(`${catId} ${this.emailInbox}`);
  }

  incorrectTaggingChanged(incorrTag: any) {
    //alert(incorrTag);
    this.workEmailLoaded = true;

    if (incorrTag == "true") {
      this.showCategory = true
      this.incorrectTagging = true;
    }
    else {

      this.bulkRequest = false;
      this.showCategory = false;
      this.incorrectTagging = false;
      this.bulkRequestChanged(false);
    }
  }

  bulkRequestChanged(bulkReq: boolean) {
    if (bulkReq === false) { // Add "No" as an additional condition
      this.showMPANandAccountNo = true;
      this.showNoofRequest = false;
    } else {
      this.showMPANandAccountNo = false;
      this.showNoofRequest = true;
    }
  }

  incorrectCategoryChanged(incorrsubCategory: any) {
    console.log("incorrsubCategory:", incorrsubCategory); // Debug statement
    if (incorrsubCategory === true) { // Compare to boolean values, not strings
      this.incorrectCategory = true;
    } else {
      this.incorrectCategory = false;
    }
    console.log("this.incorrectCategory:", this.incorrectCategory); // Debug statement
    // Trigger change detection manually
    this.cdr.detectChanges();
  }

  openReplyModal() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '90%',
      height: '90%',
      disableClose: true,
      data: { selectedAction: 'Reply' }
    });
  }
  openReplyAllModal() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
      data: { selectedAction: 'Reply All' }
    });
  }
  openForwardModal() {
    const dialogRef = this.dialog.open(SendEmailComponent, {
      width: '100%',
      height: '100%',
      disableClose: true,
      data: { selectedAction: 'Forward' }
    });
  }
  openBreakDialog() {
    const dialogRef = this.dialog.open(BreakDialogComponent, {
      width: '400px',

      disableClose: true,
    });
  }

  getUserProductivity() {
    const empId = this.currentUserId ;
    this._emailService.getUserProductivity(empId)
      .subscribe(result => {
        this.userProductivity = result;
        console.log(this.userProductivity);
        const sum =
          this.userProductivity?.requestinfo +
          this.userProductivity?.other +
          this.userProductivity?.requestinfo +
          this.userProductivity?.nfaJunkSPAMemail +
          this.userProductivity?.futureDate +
          this.userProductivity?.supportEscalation +
          this.userProductivity?.queryAlreadyCompleted;

        this.sumValue = sum;

        //console.log(this.sumValue);
      });
  }
  getTooltipText(breaksdDetail: any[]): string {
    return breaksdDetail.map(breakDetail => `${breakDetail.category}: ${breakDetail.timeTaken}`).join(', ');
  }
  getnextwork(data?:any) {
   // this.isLoading = true;
    //alert("You don't have access on work. Please contact to Darwin team");
   // return;
    const UserEmail = this.currentUserId ;
    if (data) {

      this.workManagement = data;
      this.workManagement.workID = data.workId;
      this.workManagement.sentiment = data.sentiment;
      this.workManagement.category = data.emailCategory;
      this.workManagement.IncorrectTagging = data.incorrectTagging;
      this.workManagement.subCategory = data.emailSubCategory;
      this.workManagement.IsSubCategoryCorrect = data.isSubCategoryCorrect;
      if (data.source === 'view') {
        this.isViewOnlyMode = true;
      }
      else if (data.source === 'action') {
        this.isViewOnlyMode = false;
      }
      if (data.IncorrectTagging == null || data.IncorrectTagging == undefined) {
        data.incorrectTagging = false;
      }

      this.isLoading = false;
    }
    else {
      this._emailService.getNextWork(UserEmail)
        .subscribe(result => {
          this.workManagement = result;
          this.timerRunning = true;
          this.timerColor = '#1ABB9C';
          this.timerMinutes = 0;
          this.timerSeconds = 0;
          this.startTimer();
          const selectedContactType = this.contacttypedata.find(
            (type: any) => type.code === this.workManagement.contactTypeId
          );
          //console.log('populated',selectedContactType);
          if (selectedContactType) {
            this.selectedValue = selectedContactType.description;
          } else {
            // Handle the case where no matching contact type is found
            this.selectedValue = ''; // or any default value you prefer
          }
          this.contacttypeId = this.workManagement.contactTypeId;
          console.log(this.contacttypeId);
          this.isFieldsDisabled = false;
          console.log(this.workManagement);
          this.getUserProductivity();
          this.getCategories();
          this.getActions();
          this.getSubCategories(this.workManagement.categoryID);
          this.iscallnext = true;

          if (this.selectedValue == 'FutureDate') {
            this.showFutureDate = true;
            alert('call');
          }
          else {
            this.showFutureDate = false;

          }

          this.isLoading = false;
        });
    }


  }
  // Add a new property to track whether the timer should run or stop

  startTimer() {
    if (this.workManagement.activityTotalTime) {
      // Parse the activityTotalTime into minutes and seconds
      const timeParts = this.workManagement.activityTotalTime.split(':');
      this.timerMinutes = parseInt(timeParts[0]);
      this.timerSeconds = parseInt(timeParts[1]);
    } else {
      // If activityTotalTime is null, start from 00:00
      this.timerMinutes = 0;
      this.timerSeconds = 0;
    }

    this.timer = setInterval(() => {
      this.timerSeconds++;

      if (this.timerSeconds === 60) {
        this.timerSeconds = 0;
        this.timerMinutes++;
      }

      this.displayTime =
        (this.timerMinutes < 10 ? '0' : '') +
        this.timerMinutes +
        ':' +
        (this.timerSeconds < 10 ? '0' : '') +
        this.timerSeconds;

      if (this.timerMinutes === 7) {
        this.timerColor = 'orange'; // Change to orange when 7 minutes
      }

      if (this.timerMinutes === 8) {
        this.timerColor = 'red'; // Change to red when 8 minutes
        // Do not stop the timer, just change the color
      }
    }, 1000);
  }


  // Function to stop the timer when the "Save" button is clicked
  stopTimer() {
    clearInterval(this.timer);
    this.timerRunning = false;
  }


  savework() {
    this.isLoading = true;
    this.workManagement.workedBy = this.currentUserId;
    this.workManagement.Comments = this.commentText;
    this.workManagement.IncorrectTagging = this.incorrectTaggingNo;
    this.workManagement.AccountNumber = this.accountno;
    this.workManagement.emailCategory = this.emailInbox;
    this.workManagement.emailInboxCategory = this.emailInboxCategory;
    this.workManagement.MPAN = this.Mpan;

    this.workManagement.BulkRequest = this.bulkRequest;
    this.workManagement.ActionID = this.selectedValueaction;
    //this.workManagement.workStatus = this.selectedValueaction;
    //this.workManagement.sta

    console.log(this.workManagement)
   
    return;
    this._emailService.saveWork(this.workManagement)
      .subscribe(
        (response) => {
          console.log('Email saved successfully:', response);
          alert('Work saved successfully!');
          this.stopTimer();
          this.cancel();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error saving email:', error);
          alert('An error occurred while saving the work. Please try again later.');
          this.isLoading = false;
        }
      );
  }

  cancel() {
    this.workManagement = {} as IWorkmanagementModel;
    this.selectedValue = '';
    this.selectedValueaction = 0;
    this.commentText = '';
    this.accountno = '';
    this.Mpan = '';
    this.incorrectTagging = true;
    this.incorrectCategory = false;
    this.workEmailLoaded = false;
    this.showCategory = false;
    this.showMPANandAccountNo = false;
    this.showNoofRequest = false;
    this.showFutureDate = false;
    this.contacttypeId = null;
    this.workManagement.EmailID = '';
    this.workManagement.AccountNumber = '';
    this.workManagement.ActionID = 0;
    this.workManagement.MPAN = '';
    this.workManagement.workedBy = '';
    this.workManagement.emailCategory = '';
    this.workManagement.emailInbox = '';
    this.workManagement.correctedSubCategoryID = 0;
    this.workManagement.IsSubCategoryCorrect = false;
    this.workManagement.Comments = '';
    this.workManagement.NumberOfBulkRequest = 0;
    this.workManagement.from = '';
    this.workManagement.to = '';
    this.workManagement.cc = '';
    this.workManagement.bCc = '';
    this.workManagement.subject = '';
    this.workManagement.receivedDate = '';
    this.workManagement.body = '';
    this.workManagement.sentiment = '';
    this.workManagement.workID = 0;
    this.workManagement.IncorrectTagging = false;
    this.workManagement.category = '';
    this.workManagement.subCategory = '';

    this.stopTimer();
    //window.location.reload();
  }

}



