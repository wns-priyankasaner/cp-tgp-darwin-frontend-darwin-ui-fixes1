import { DatePipe } from "@angular/common";

export interface IPendCasesByFilter{
  workID: number;
  categoryID: number;
  emailClassID: number;
  actionID: number;
  startDate: string | null;
  endDate: string | null;
  emailSubject: string;
  emailAddress: string;
}