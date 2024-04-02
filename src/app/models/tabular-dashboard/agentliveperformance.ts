import { Time } from "@angular/common";

export interface IAgentLivePerformance{
    empName:string;
    teUsername:string;
    agentStatus:string;
    loggedInStatus:string;
    productive: string;
    nonProductive:string;
    aht:number;
    totalScore:number;
    forwardedCount:number;
    queryCount:number;
    queryCompleted:number;
    nfaCount:number;
    requestFurtherInfoOther:number;
    others:number;
    nfaJunkSPAMemail:number;
    futureDate:number;
    queryCompletedNFA:number
    supportEscalation:number;
    
 }