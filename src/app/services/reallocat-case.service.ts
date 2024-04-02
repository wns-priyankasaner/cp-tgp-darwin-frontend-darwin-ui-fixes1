import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IWorkModel } from '../models/manual-reallocation/workmodel';
import { Observable } from 'rxjs';
import { IWorkAssign } from '../models/manual-reallocation/workassign';
import { API_BASE_URL } from 'src/config/config';
@Injectable({
  providedIn: 'root'
})
export class ReallocatCaseService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //apiURL = 'https://localhost:7062/api';

  // Constuctor calling
  constructor(private httpClient: HttpClient) { }

  searchAndAssignCase(startDate: string, endDate: string, catId: number, subCatId: number, actionId: number, workId: number): Observable<IWorkModel[]> {
    return this.httpClient
      .get<IWorkModel[]>(API_BASE_URL + '/ReallocateCase/SearchAndAssignCase?categoryID=' + catId + '&subCategoryID=' + subCatId
        + '&receivedStartDate=' + startDate + '&receivedEndDate=' + endDate + '&actionID=' + actionId + '&workId=' + workId);

  }

  assigneWork(assignWork: IWorkAssign): Observable<string> {
    return this.httpClient
      .post<string>(API_BASE_URL + '/ReallocateCase/AssigneWork', assignWork, this.httpOptions);
  }
}
