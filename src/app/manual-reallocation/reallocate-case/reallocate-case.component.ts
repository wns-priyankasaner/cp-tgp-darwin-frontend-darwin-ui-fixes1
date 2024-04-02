import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ICategory } from 'src/app/models/common/category';
import { IEmployee } from 'src/app/models/common/employee';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { IWorkAssign } from 'src/app/models/manual-reallocation/workassign';
import { IWorkModel } from 'src/app/models/manual-reallocation/workmodel';
import { CommonService } from 'src/app/services/common.service';
import { ReallocatCaseService } from 'src/app/services/reallocat-case.service';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
@Component({
  selector: 'app-reallocate-case',
  templateUrl: './reallocate-case.component.html',
  styleUrls: ['./reallocate-case.component.scss']
})
export class ReallocateCaseComponent implements OnInit{
  displayedColumns: string[] = ['Action', 'WorkID', 'Category', 'SubCategory', 'EmailReceivedDate', 'EmailSubject', 'WokedBy', 'ActionTaken', 'WorkedDate', 'SLA'];
  emailInbox: any = 0;
  emailInboxCategory: any = 0;
  dataSource: IWorkModel[] = [];
  categories: ICategory[];
  subcategories: ISubCategory[];
  startDate: any;
  endDate: any;
  employeeId: string;
  filteredEmployees: IEmployee[];
  workId: any;
  subject: any;
  activePageDataChunk: IWorkModel[];
  workIds: number[] = [];
  isLoading:boolean=false;
  actionsdata: any[];
  selectedValue:string;
  actiontaken: any;
  actionID:any;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];


  constructor(private _http: HttpClient, private _commonService: CommonService
    , private _reallocatCaseService: ReallocatCaseService) {

  }

  ngOnInit() {



    this.getCategories();
    this.getSubCategories(this.emailInbox);
    this.searchAndAssignCase();
    this.getEmployee();

    this.activePageDataChunk = this.dataSource.slice(0, 5);

    this.getActions()

  }

  // Load email inbox
  getCategories() {
    this._commonService.getCategories().subscribe(result => {
      // console.log(result);
      this.categories = result;
    })
  }

  // Load email inbox category
  getSubCategories(categoryId: number) {
    categoryId = categoryId == undefined ? 0 : categoryId;
    this._commonService.getSubCategories(categoryId).subscribe(result => {

      //  console.log(result);
      this.subcategories = result;

    })
  }

  // page change event
  onPageChanged(e: any) {
    if (this.dataSource) {
      const firstCut = e.pageIndex * e.pageSize;
      const secondCut = firstCut + e.pageSize;
      //this.dataSource = this.dataSource.slice(firstCut, secondCut);
      this.activePageDataChunk = this.dataSource.slice(firstCut, secondCut);
     
    }
  }

  // Email inbox change event
  emailInboxChange(categoryId: any) {
    this.emailInboxCategory = 0;


    this._commonService.getSubCategories(categoryId).subscribe(result => {
      this.subcategories = result;
    });

  }
// email inbox category change event
  emailInboxCategoryChange() {

  }


  // Date change event
  dateChanged(startDate: any, endDate: any) {

    this.startDate = startDate.value;
    this.endDate = endDate.value;


  }

// filter employee
  filterEmployee(event: any) {
    // const value = event?.target?.value
    // if (value === null || value === '') {
    //   this.filteredEmployees = this.employees;


    // }
    // else {

    //   let filter = value.toLowerCase();
    //   this.filteredEmployees = this.employees.filter(option => option.name.toLowerCase().startsWith(filter));
    // }

  }


  // load search and assigned record 
  searchAndAssignCase() {
    this.isLoading=true;
    const date = new Date();
    const agentSDate = this.startDate ? this.startDate : date.setMonth(date.getMonth() - 1);
    const agentEDate = this.endDate ? this.endDate : date;

    const sdate = formatDate(agentSDate, 'yyyy-MM-dd', 'en-gb');
    const edate = formatDate(agentEDate, 'yyyy-MM-dd', 'en-gb');

    this._reallocatCaseService.searchAndAssignCase(sdate,
      edate, this.emailInbox, this.emailInboxCategory, 0, 0).subscribe(result => {
        this.dataSource = result;
        this.onPageChanged({pageIndex:this.pageIndex,pageSize:this.pageSize});
        this.isLoading=false;

      });
  }


  // Load employee record
  getEmployee() {
    this.isLoading=true;
    this._commonService.getEmployee().subscribe(result => {
      this.filteredEmployees = result;
      this.isLoading=false;
    })
  }


  // Assign work to employee
  assigneWork() {
    this.isLoading=true;
    const request: IWorkAssign = {
      workIds: this.workIds,
      empId: this.employeeId,
      assignedBy: null
    };

    this._reallocatCaseService.assigneWork(request).subscribe(result => {
      alert(result);
     this.searchAndAssignCase();
      this.emailInbox = [];
      this.emailInboxCategory = [];
      this.employeeId = '';
      this.subcategories = [];
      this.workIds.length = 0;
      this.isLoading=false;
    });

  }


  // Checkbox selection
  selectWork(workID: number, event: MatCheckboxChange) {
    
    if (event.checked) {
      this.workIds.push(workID);
    } else {
      const index = this.workIds.indexOf(workID);
      if (index >= 0) {
        this.workIds.splice(index, 1);
      }
    }
  }

  // check existing record
  isExist(workId: number): boolean {
    return this.workIds.indexOf(workId) > -1;
  }

  isIndeterminate() {
    return (this.workIds.length > 0 && !this.isChecked())
  }

// checkbox selection length
  isChecked() {
    return this.workIds.length === this.dataSource.length;
  }


  // multiselect all checkbox
  selectAllWork(event: MatCheckboxChange) {
    if (event.checked) {
      this.dataSource.forEach((work: IWorkModel) => {
        this.workIds.push(work.workID);
      })
    } else {
      this.workIds.length = 0;
    }
  }

// Clear record
  clear() {
    this.dataSource = [];
      this.workIds = [];
      this.startDate = null;
      this.endDate = null;
      this.emailInbox = null;
      this.emailInboxCategory = null;
      this.subject = null;
      
    }

// load action taken
    getActions() {
      this._commonService.getActions().subscribe(result => {
        this.actionsdata = result;
        //console.log(this.actionsdata );
      });
    }

}
