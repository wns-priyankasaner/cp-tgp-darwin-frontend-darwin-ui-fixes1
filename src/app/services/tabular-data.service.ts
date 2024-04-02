import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAgentLivePerformance } from '../models/tabular-dashboard/agentliveperformance';
import { IAgentPerformance } from '../models/tabular-dashboard/agentperformance';
import { ISLA } from '../models/tabular-dashboard/sla';
import { IProcessPerformance } from '../models/tabular-dashboard/processperformance';
import { API_BASE_URL } from 'src/config/config';
@Injectable({
  providedIn: 'root'
})
export class TabularDataService {
  //apiURL = 'https://localhost:7062/api';
  constructor(private httpClient:HttpClient) { }



  getAgentLivePerformance(categoryId:number,subCategoryId:number): Observable<IAgentLivePerformance[]> {
    return this.httpClient
        .get<IAgentLivePerformance[]>(API_BASE_URL + '/TabularDashboard/GetAgentLivePerformance?categoryId='+categoryId+'&subCategoryId='+subCategoryId);

}
getAgentClearence(startDate:string,endDate:string,categoryId:number,subCategoryId:number,isOrderDesc:boolean): Observable<IAgentPerformance[]> {
  return this.httpClient
      .get<IAgentPerformance[]>(API_BASE_URL + '/TabularDashboard/GetAgentClearence?startDate='+startDate+'&endDate='+endDate+'&categoryId='+categoryId+'&subCategoryId='+subCategoryId+'&isOrderDesc='+isOrderDesc);

}
getDashboardSla(startDate:string,endDate:string,categoryId:number,subCategoryId:number): Observable<ISLA[]> {
  return this.httpClient
      .get<ISLA[]>(API_BASE_URL + '/TabularDashboard/GetDashboardSla?startDate='+startDate+'&endDate='+endDate+'&categoryId='+categoryId+'&subCategoryId='+subCategoryId);

}
getProcessClearance(startDate:string,endDate:string,categoryId:number,subCategoryId:number): Observable<IProcessPerformance[]> {
  return this.httpClient
      .get<IProcessPerformance[]>(API_BASE_URL + '/TabularDashboard/GetProcessClearance?startDate='+startDate+'&endDate='+endDate+'&categoryId='+categoryId+'&subCategoryId='+subCategoryId);

}
}
