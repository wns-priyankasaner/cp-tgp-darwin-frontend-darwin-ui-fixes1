import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from 'src/config/config';

@Injectable({
  providedIn: 'root'
})
export class RawDataService {
  //apiURL = 'https://localhost:7062/api';
  constructor(private httpClient:HttpClient) { }

 


  todayDueData(empId:string,catId:number,subCatId:number): Observable<any> {
    return this.httpClient
        .get<any>(API_BASE_URL + '/RawData/GetTodaysSLADueData?empId='+empId+'&catId='+catId+'&subCatId='+subCatId);

}
outStandingData(empId:string,catId:number,subCatId:number): Observable<any> {
  return this.httpClient
      .get<any>(API_BASE_URL + '/RawData/GetOutstandingData?empId='+empId+'&catId='+catId+'&subCatId='+subCatId);

}
miData(empId:string,startDate:string,endDate:string,catId:number,subCatId:number): Observable<any> {
  return this.httpClient
      .get<any>(API_BASE_URL + '/RawData/GetMIData?empId='+empId+'&startDate='+startDate+'&endDate='+endDate+'&catId='+catId+'&subCatId='+subCatId);


}
completedData(empId:string,startDate:string,endDate:string,catId:number,subCatId:number): Observable<any> {
  return this.httpClient
      .get<any>(API_BASE_URL + '/RawData/GetCompletedData?empId='+empId+'&startDate='+startDate+'&endDate='+endDate+'&catId='+catId+'&subCatId='+subCatId);


}
transactionalData(empId:string,startDate:string,endDate:string,catId:number,subCatId:number): Observable<any> {
  return this.httpClient
      .get<any>(API_BASE_URL + '/RawData/GetTransactionalData?empId='+empId+'&startDate='+startDate+'&endDate='+endDate+'&catId='+catId+'&subCatId='+subCatId);


}
agentProcessClearanceData(empId:string,startDate:string,endDate:string,catId:number,subCatId:number): Observable<any> {
  return this.httpClient
      .get<any>(API_BASE_URL + '/RawData/GetAgentProcessData?empId='+empId+'&startDate='+startDate+'&endDate='+endDate+'&catId='+catId+'&subCatId='+subCatId);


}
outstandingDataPOC(empId:string,catId:number,subCatId:number): Observable<any> {
  return this.httpClient
      .get<any>(API_BASE_URL + '/RawData/GetOutstandingDataPOC?empId='+empId+'&catId='+catId+'&subCatId='+subCatId);

}
miDataPOC(empId:string,startDate:string,endDate:string,catId:number,subCatId:number): Observable<any> {
  return this.httpClient
      .get<any>(API_BASE_URL + '/RawData/GetMIDataPOC?empId='+empId+'&startDate='+startDate+'&endDate='+endDate+'&catId='+catId+'&subCatId='+subCatId);


}
}

