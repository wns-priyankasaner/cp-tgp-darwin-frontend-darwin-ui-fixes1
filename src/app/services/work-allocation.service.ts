import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {IResponseTemplate} from '../models/email/responsetemplate';
import {IEmailSignature} from '../models/email/emailsignature';
import { IUserProductivity } from '../models/email/userproductivity';
import { catchError } from 'rxjs/operators';
import { IAttachment} from 'src/app/models/email/attachments';
import { IPendCasesByFilter } from '../models/email/pendcasesbyfilter';
import { IPendCasesByFilterResponse } from '../models/email/pendcasesfilterresponse';
import { IPendingCasesBySearch } from '../models/email/pendingcasesbysearch';
import { API_BASE_URL } from 'src/config/config';
@Injectable({
  providedIn: 'root'
})
export class WorkAllocationService {
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
    }),
};

//apiURL = 'https://localhost:7062/api';

constructor(private httpClient: HttpClient) { }

getPendingCasesByFilters(filters:IPendCasesByFilter): Observable<IPendCasesByFilterResponse[]> {
  return this.httpClient
 .post<IPendCasesByFilterResponse[]>(API_BASE_URL + '/WorkManagement/GetPendingCases',filters);
}
getWorkBySearch(workid:number,empId:string,type:string): Observable<IPendingCasesBySearch> {
  return this.httpClient
 .get<IPendingCasesBySearch>(API_BASE_URL + '/WorkManagement/GetWorkBySearch?workId='+workid+'&empId='+empId+'&type='+type);
}


}
