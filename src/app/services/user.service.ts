import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

Injectable({
    providedIn: 'root',
  })
  export class UserService {

   private currentUserSubject = new BehaviorSubject<string>('');

   currentUser$ = this.currentUserSubject.asObservable();

    constructor(){
        
    }

    setCurrentUser(user: string){
        this.currentUserSubject.next(user);
    }

}