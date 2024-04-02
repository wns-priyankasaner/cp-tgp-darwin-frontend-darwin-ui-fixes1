import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IBreak } from 'src/app/models/common/break';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';
import { IAuxQueuesBreak } from 'src/app/models/common/auxqueu';
import { EmailService } from 'src/app/services/email.service';
import { IUserProductivity } from 'src/app/models/email/userproductivity';
import { ICategory } from 'src/app/models/common/category';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-break-dialog',
  templateUrl: './break-dialog.component.html',
  styleUrls: ['./break-dialog.component.scss'],
  providers: [DatePipe]
})
export class BreakDialogComponent implements OnInit, OnDestroy {
  break: IBreak[];
  selectedValue: string | null = null;
  code: string = 'U01';
  messageValue: string;
  dialogState: 'break' | 'start' = 'break';
  startTime: Date | null = null;
  endTime: Date | null = null;
  totalDuration: string | null = null;
  timerInterval: any;
  isTimerRunning: boolean = false;
  showValidationMessage: boolean = false;
  currentDateTime: Date = new Date();
  isCancelButtonDisabled: boolean = false;
  userProductivity: IUserProductivity;
  categories: ICategory[];
  wmEmailInbox: any
  emailInbox: string;
  incorrectTagging = true;
  incorrectCategory = false;
  workEmailLoaded = false;
  showCategory = false;
  selectedAction: string;
  sumValue: number | undefined;
  currentUserId: string;


  constructor(private router: Router,private route: ActivatedRoute,private datePipe: DatePipe, public dialogRef: MatDialogRef<BreakDialogComponent>, private _commonService: CommonService ,private _emailService:EmailService,
    private _userService: UserService) { }

  ngOnInit(): void {
    this.getBreakDropdown();

    this._userService.currentUser$.subscribe(s=>{
      this.currentUserId = s;
    })

  }
  reloadCurrentRoute() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    const currentUrl = this.router.url + '?';
    this.router.navigateByUrl(currentUrl).then(() => {
      this.router.navigated = false;
      this.router.navigate([this.route.snapshot.url]);
    });
  }
  
  formatTime(date: Date | null): string {
    if (date instanceof Date) {
      return `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}`;
    }
    return '';
  }

  updateStartTimer() {
    this.timerInterval = setInterval(() => {

      if (this.startTime !== null) {
        this.startTime = new Date(this.startTime);
        this.currentDateTime = new Date();
      }
    }, 1000);
  }

  updateEndTimer() {
    this.timerInterval = setInterval(() => {

      if (this.endTime !== null) {
        this.endTime = new Date(this.endTime);
        this.currentDateTime = new Date();
      }

      if (this.startTime !== null && this.endTime !== null) {
        this.totalDuration = this.calculateDuration(this.endTime.getTime() - this.startTime.getTime());
      }
    }, 1000);
  }

  startBreak() {
    if (!this.selectedValue) {

      this.showValidationMessage = true;
      return;
    }
    this.closeValidationMessage();


    this.dialogState = 'start';
    this.startTime = new Date();
    this.endTime = null;
    this.totalDuration = null;
    this.isTimerRunning = true;
    this.isCancelButtonDisabled = true;
    this.updateStartTimer();
    this.updateOngoingTimer();


    const auxModel: IAuxQueuesBreak = {
      subQueueId: this.selectedValue,
      userId: this.currentUserId,
      comments: this.messageValue,
    };


    this._commonService.addAuxThread(auxModel).subscribe(
      (response: any) => {
        console.log('AuxThread added successfully:', response);

      },
      (error: any) => {
        console.error('Error adding AuxThread:', error);

      }
    );
  }

  closeValidationMessage() {
    this.showValidationMessage = false;
  }
  onBreakSelectionChange() {
    this.closeValidationMessage();
  }
  endBreak() {
    this.dialogState = 'break';
    this.endTime = new Date();
    clearInterval(this.timerInterval);
    this.isTimerRunning = false;

    this.totalDuration = this.calculateDuration(this.endTime.getTime() - this.startTime!.getTime());


    const auxModel: IAuxQueuesBreak = {
      subQueueId: this.selectedValue,
      userId: this.currentUserId,
      comments: this.messageValue,

    };
    this._commonService.updateAuxThread(auxModel).subscribe(
      (response: any) => {
        //console.log('API response:', response);
        this.getUserProductivity()
        this.dialogRef.close();
        this.reloadCurrentRoute();
      },
      (error: any) => {
        //console.error('Error updating AuxThread:', error);

        this.dialogRef.close();
       
      }
    );
  }

  endOngoingTimer() {
    clearInterval(this.timerInterval);
    this.isTimerRunning = false;
    this.isCancelButtonDisabled = false;
  }
  calculateDuration(duration: number = 0): string {
    const milliseconds = Math.floor((duration % 1000) / 10);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}:${this.pad(milliseconds)}`;
  }

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }
  updateOngoingTimer() {
    this.timerInterval = setInterval(() => {

      if (this.startTime !== null) {
        this.startTime = new Date(this.startTime);
        this.currentDateTime = new Date();
      }


      if (this.endTime !== null && this.isTimerRunning) {
        this.endTime = new Date(this.endTime);
        this.currentDateTime = new Date();
      }


      if (this.startTime !== null && this.endTime !== null) {
        this.totalDuration = this.calculateDuration(this.endTime.getTime() - this.startTime.getTime());
      }
    }, 1000);
  }
  getBreakDropdown() {
    this._commonService.getBreak(this.code).subscribe(result => {
      console.log(result);
      this.break = result;
    })
  }

  closeModal() {
    clearInterval(this.timerInterval);
    this.dialogRef.close();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }
  getUserProductivity(){
    const empId = this.currentUserId;
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

    
      });
  }

}

