import { Component, ViewEncapsulation,EventEmitter,Output, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { IActions } from 'src/app/models/common/actions';
import { WorkAllocationService } from 'src/app/services/work-allocation.service';
import { IPendCasesByFilter } from 'src/app/models/email/pendcasesbyfilter';
import { IPendCasesByFilterResponse } from 'src/app/models/email/pendcasesfilterresponse';
import { CommonService } from 'src/app/services/common.service';
import { DatePipe } from '@angular/common';
import { IPendingCasesBySearch } from 'src/app/models/email/pendingcasesbysearch';
import { ICategory } from 'src/app/models/common/category';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { filter } from 'rxjs';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { IWorkBySearch } from 'src/app/models/email/workbysearch';
import { MatPaginator,MatPaginatorIntl } from '@angular/material/paginator';
import { UserService } from 'src/app/services/user.service';
const ELEMENT_DATA: IPendCasesByFilterResponse[]=[

];
@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchDialogComponent {
  @ViewChild(MatPaginator) paginator : MatPaginator;
  @Output() modalClosed = new EventEmitter<any>();
  //dataSource: PendCasesByFilterResponse[] = [];
  displayedColumns: string[] = ['workID', 'subject', 'emailCategory', 'emailSubCategory', 'from', 'receivedDate', 'activityDate', 'workStatus', 'workedBy', 'dueDate', 'action'];
  dataSource : IPendCasesByFilterResponse[] = [];
  noRecordFound: boolean = false;
  //activePageDataChunk: PendCasesByFilterResponse[];
  startDate: any;
  actionID:number=0;
  endDate: any;
  emailInbox: number=0;
  emailInboxCategory: number=0;
  subject: any;
  actiontaken: any;
  code:any[];
  emailaddress: any;
  workid: any;
  ELEMENT_DATA:any[];
  actionsdata: any[];
  pendConsole: IPendingCasesBySearch | undefined;
  categories: ICategory[];
  subcategories: ISubCategory[];
  isLoading: boolean = false;
  isViewOnlyMode:boolean=false;
  activePageDataChunk: IPendCasesByFilterResponse[];
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  currentUserId: string;


  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>,private _commonservice: CommonService, 
    private _workallocation: WorkAllocationService,private datePipe: DatePipe,
    private _userService:UserService) {}

  ngOnInit() {
    this.getCategories();
    this.getSubCategories(this.emailInbox);
    this.getActions();

    this._userService.currentUser$.subscribe(s=>{
      this.currentUserId = s;
   })

  }
  getCategories() {
    this._commonservice.getCategories().subscribe(result => {
      this.categories = result;
    })
  }
  getSubCategories(categoryId: number) {
    categoryId = categoryId == undefined ? 0 : categoryId;
    this._commonservice.getSubCategories(categoryId).subscribe(result => {

      //  console.log(result);
      this.subcategories = result;

    })
  }
  emailInboxChange(categoryId: any) {
    this.emailInboxCategory = 0;


    this._commonservice.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }
  emailInboxCategoryChange() {

  }
  onPageChanged(e: any) {
    if (this.dataSource) {
      const firstCut = e.pageIndex * e.pageSize;
      const secondCut = firstCut + e.pageSize;
      //this.dataSource = this.dataSource.slice(firstCut, secondCut);
      this.activePageDataChunk = this.dataSource.slice(firstCut, secondCut);
      
    }
  }
  
  getActions() {
    this._commonservice.getActions().subscribe(result => {
      this.actionsdata = result;
      
      console.log(this.actionsdata );
    });
  }
  getWorkBySearch(){
    const WorkID = 9; 
   
    const EmpID = this.currentUserId; 
    const type = 'action';
    this._workallocation.getWorkBySearch(WorkID, EmpID, type)
      .subscribe(
        (data: IPendingCasesBySearch) => {
          this.pendConsole = data;
          this.isLoading= true;
          //console.log(data); 
        },
        (error: any) => {
          //console.error(error); 
        }
      );
      this.isLoading= false;
  }
  getPendingCasesByFilter(startDate: string | null, endDate: string | null) {
    const filters: IPendCasesByFilter = {
      workID: this.workid || 0,
      categoryID: this.emailInbox,
      emailClassID: this.emailInboxCategory,
      actionID: this.actionID,
      emailSubject: this.subject,
      emailAddress: this.emailaddress,
      startDate: startDate || null,//'2022-06-01',
      endDate: endDate || null  //'2022-09-01'
    
    };
    //console.log(filters);
    this._workallocation.getPendingCasesByFilters(filters).subscribe(
      (result: IPendCasesByFilterResponse[]) => {
        this.dataSource = result;
        this.onPageChanged({pageIndex:this.pageIndex,pageSize:this.pageSize});
        this.noRecordFound = this.dataSource.length === 0;
      },
      (error: any) => {
        //console.error('Error fetching pending cases:', error);
        this.noRecordFound = true;
      }
    );
  }
  isSearchEnabled(): boolean {
    // Check if only WorkID, Subject, or Email Address is entered
    

    // Check if Start Date and End Date are selected and either Email Inbox or Action ID is entered
    if (this.startDate && this.endDate && (this.emailInbox || this.actionID))  {
      // Check if either Email Inbox or Action ID is entered
        return true;
    }
    else if (this.workid || this.subject || this.emailaddress) {
      return true;
    }

    return false;
  }
  
  search() {
    this.isLoading = true;
    console.log('isLoading set to true');
  
    const formattedStartDate = this.startDate ? this.datePipe.transform(this.startDate, 'yyyy-MM-dd') : null;
    const formattedEndDate = this.endDate ? this.datePipe.transform(this.endDate, 'yyyy-MM-dd') : null;
    const filters: IPendCasesByFilter = {
      workID: this.workid || 0,
      categoryID: this.emailInbox,
      emailClassID: this.emailInboxCategory,
      actionID: this.actionID,
      emailSubject: this.subject,
      emailAddress: this.emailaddress,
      startDate: this.startDate || null,//'2022-06-01',
      endDate: this.endDate || null  //'2022-09-01'
    
    };
    
    this._workallocation.getPendingCasesByFilters(filters).subscribe(
      (result: IPendCasesByFilterResponse[]) => {
        this.dataSource = result;
        this.noRecordFound = this.dataSource.length === 0;
        this.onPageChanged({pageIndex:this.pageIndex,pageSize:this.pageSize});
        this.isLoading = false; // Set isLoading to false after data is loaded
        console.log('after search',this.dataSource);
      },
      (error: any) => {
        this.noRecordFound = true;
        this.isLoading = false; // Ensure isLoading is set to false in case of an error
      }
    );
 
  }
  

  closeModal() {
    this
    this.dialogRef.close();
  }

  performAction(element: any) {
    const WorkID = element.workId; 
    console.log(WorkID);
    
    const EmpID = this.currentUserId; 
    const type = 'action';
    this._workallocation.getWorkBySearch(WorkID, EmpID, type)
      .subscribe(
        (data: IPendingCasesBySearch) => {
          this.pendConsole = data;
          const dataToEmit=this.pendConsole;
          this.modalClosed.emit(dataToEmit);
          this.dialogRef.close();
          this.isLoading= true;
          //console.log(data); 
        },
        (error: any) => {
          //console.error(error); 
        }
      );
      this.isLoading= false;
  
  }
  viewDetails(element: any){
    const WorkID =element.workId; 
    console.log(WorkID);
    
    const EmpID = this.currentUserId; 
    const type = 'view';
    this._workallocation.getWorkBySearch(WorkID, EmpID, type)
      .subscribe(
        (data: IPendingCasesBySearch) => {
          this.pendConsole = data;
          const dataToEmit=this.pendConsole;
          this.modalClosed.emit(dataToEmit);
          this.dialogRef.close();
          this.isLoading= true;
          //console.log(this.pendConsole); 
        },
        (error: any) => {
          //console.error(error); 
        }
      );
      this.isLoading= false;
  }
  
  clear() : void {
    this.dataSource = [];
    this.workid = null;
    this.startDate = null;
    this.endDate = null;
    this.emailInbox = 0;
    this.emailInboxCategory = 0;
    this.subject = null;
    this.actionID = 0;
    this.emailaddress = null;
    this.activePageDataChunk = [];
    this.noRecordFound = false;
    
  }
    
  }

