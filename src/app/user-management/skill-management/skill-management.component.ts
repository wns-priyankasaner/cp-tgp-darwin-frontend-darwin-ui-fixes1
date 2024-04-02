import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { ICategory } from 'src/app/models/common/category';
import { IEmployee } from 'src/app/models/common/employee';
import { ISubCategory } from 'src/app/models/common/subcategory';
import { ISkillSet } from 'src/app/models/skillsetmapping/skillset';
import { CommonService } from 'src/app/services/common.service';
import { SkillManagementService } from 'src/app/services/skill-management.service';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import { debounceTime } from 'rxjs';


const LoadUserSkill: ISkillSet[] = [

];

@Component({
  selector: 'app-skill-management',
  templateUrl: './skill-management.component.html',
  styleUrls: ['./skill-management.component.scss']
})
export class SkillManagementComponent implements OnInit {
  displayedColumns: string[] = ['UserName', 'UserEmail', 'Category', 'Subcategories', 'deleteEmployee'];
  emailInbox: number[];
  emailInboxCategory: number[];
  employeeId: string;
  categories: ICategory[];
  subcategories: ISubCategory[];
  employees: IEmployee[];
  filteredEmployees: IEmployee[];
  dataSource: ISkillSet[] = [];
  activePageDataChunk:ISkillSet[];
  searchText: string | undefined = undefined;
  LoadUserSkill: any[];
  skillset: ISkillSet[] = [];
  dialogRef: any;
  dialog: any;
  isLoading:boolean=false;
  subject:any; 
  searchString: string = '';
  filterPredicate:any;
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  searchValue: string;
  

  

  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSubCatSelected') private allSubCatSelected: MatOption;

  constructor(private _http: HttpClient,
    private _commonService: CommonService,
    private _skillManagementService: SkillManagementService) {

  }

  ngOnInit() {
    this.LoadUserSkill = this.dataSource;
    //const date=new Date();
    //this.startDate=this.startDate?this.startDate:date.setMonth(date.getMonth()-1);
    //this.endDate=this.endDate?this.endDate:date;
    this.getCategories();
    this.getEmployee();

    this.loadUserSkillSet(this.searchText);

    
  }

  // Load category
  getCategories() {
    this._commonService.getCategories().subscribe(result => {
      // console.log(result);
      this.categories = result;
    })
  }

  // Email inbox change event
  emailInboxChange() {
    this._commonService.getSubCategoriesByCategories(this.emailInbox).subscribe(result => {
      this.subcategories = result;
    });
  }

  // Multiselect checkbox for all email inbox
  selectAllCategory() {
    if (this.allSelected.selected) {
      this.emailInbox = [...this.categories.map(x => x.id), 0];
      this.emailInboxChange();
    } else {
      this.emailInbox = [];
      this.subcategories = [];
      this.emailInboxCategory = [];
    }
  }

  // Single checkbox selection for email inbox
  selectCategory() {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      this.subcategories = [];
      this.emailInboxCategory = [];
      return false;
    }
    if (this.emailInbox.length == this.categories.length)
      this.allSelected.select();
    this.emailInboxChange();
    return;
  }

  // Multiselection checkbox for email inbox category
  selectAllSubCategory() {
    if (this.allSubCatSelected.selected) {
      this.emailInboxCategory = [...this.subcategories.map(x => x.id), 0];
    } else {
      this.emailInboxCategory = [];
    }
  }

  // single select checkbox for email inbox category
  selectSubCategory() {
    if (this.allSubCatSelected.selected) {
      this.allSubCatSelected.deselect();
      return false;
    }
    if (this.emailInboxCategory.length == this.subcategories.length)
      this.allSubCatSelected.select();
    return;
  }

  // Load employee record
  getEmployee() {
    this.isLoading=true;
    this._commonService.getEmployee().subscribe(result => {
      // console.log(result);
      
        this.employees = result;
        this.filteredEmployees = result;
        this.isLoading = false;
      
    })
  }


  // Add employee skillset
  addSkillSet() {
    this.isLoading=true;
    const request = {
      'empID': this.employeeId,
      'catIDs': this.emailInbox.join(','),
      'subCatIDs': this.emailInboxCategory.join(','),
      'locEmailIDs': '',
      "emailCategory": 0,
      "categoryID": 0,

    };

    this._skillManagementService.addSkillSet(request).subscribe(result => {
      alert(result);
      this.loadUserSkillSet(this.searchText);
      this.emailInbox = [];
      this.emailInboxCategory = [];
      this.employeeId = '';
      this.subcategories = [];
      this.isLoading=false;
    });

  }


  // Filter emplyee data
  filterEmployee(event: any) {
    const value = event?.target?.value
    if (value === null || value === '') {
      this.filteredEmployees = this.employees;


    }
    else {

      let filter = value.toLowerCase();
      this.filteredEmployees = this.employees.filter(option => option.name.toLowerCase().startsWith(filter));
    }

  }

  // Page event change
  
  onPageChanged(e: any) {
      if (this.dataSource) {
        const firstCut = e.pageIndex * e.pageSize;
        const secondCut = firstCut + e.pageSize;
        //this.dataSource = this.dataSource.slice(firstCut, secondCut);
        this.activePageDataChunk = this.dataSource.slice(firstCut, secondCut);
       
      }
    }
 
 

  // Load user skillset 
  public loadUserSkillSet(searchText: string | undefined) {


    this._skillManagementService.loadUserSkillSet(searchText).subscribe(result => {
      this.dataSource = result;
      this.onPageChanged({pageIndex:this.pageIndex,pageSize:this.pageSize});
    });
  }
//Delete user skillset
  deleteSkill(skillId: number) {
    this.isLoading=true;

    if (confirm("Are you sure to delete ")) {
    }


    this._skillManagementService.deleteSkill(skillId).subscribe(result => {
      this.loadUserSkillSet(this.searchText);
      this.isLoading=false;

    });
  }

  // deleteSkill(skillId: number) {
  //   this.isLoading = true;
  
  //   const confirmResult = confirm("Are you sure you want to delete this skill?");
  
  //   if (confirmResult) {
  //     this._skillManagementService.deleteSkill(skillId).subscribe(result => {
  //       this.loadUserSkillSet(this.searchText);
  //       this.isLoading = false;
  //     });
  //   } else {
  //     this.isLoading = false; // Cancel the loading indicator
  //   }
  // }



  onSearch(event:any) {
    setTimeout(() => {
      const searchValue = event.target.value;
      this.activePageDataChunk = this.activePageDataChunk.filter(element => {
        return element.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
          element.userEmail.toLowerCase().includes(searchValue.toLowerCase()) ||
          element.category.toLowerCase().includes(searchValue.toLowerCase());
      });
    }, 100);
  }
  
  

  
//   applyFilter() {
//   //   this.dataSource.filterPredicate = (data: User, filter: string): boolean => {
//   //     const userName = data.userName.toLowerCase();
//   //     const userEmail = data.userEmail.toLowerCase();
//   //     const category = data.category.toLowerCase();
//   //     const searchTerm = filter.toLowerCase();

//   //     return userName.includes(searchTerm) ||
//   //       userEmail.includes(searchTerm) ||
//   //       category.includes(searchTerm);
//   //   };

//   //   this.dataSource.filteredData.next(this.dataSource.data.filter(this.dataSource.filterPredicate));
//   // }
// }
}
