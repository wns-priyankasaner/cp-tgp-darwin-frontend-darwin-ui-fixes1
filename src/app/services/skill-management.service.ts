import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISkillSet } from '../models/skillsetmapping/skillset';
import { API_BASE_URL } from 'src/config/config';
@Injectable({
  providedIn: 'root'
})
export class SkillManagementService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  //apiURL = 'https://localhost:7062/api';

  // Constuctor calling
  constructor(private httpClient: HttpClient) { }

  addSkillSet(skillSet: any): Observable<string> {
    return this.httpClient
      .post<string>(API_BASE_URL + '/SkillSetManagement/AddSkillSet', skillSet, this.httpOptions);
  }
  loadUserSkillSet(searchText:string|undefined): Observable<ISkillSet[]> {
    return this.httpClient
        .get<ISkillSet[]>(API_BASE_URL + '/SkillSetManagement/LoadUserSkillSet?searchText=' + searchText);

}
deleteSkill(skillSetId:number): Observable<any> {
  return this.httpClient
      .delete<any>(API_BASE_URL + '/SkillSetManagement/DeleteSkillSet?skillSetId=' + skillSetId);

}

}




