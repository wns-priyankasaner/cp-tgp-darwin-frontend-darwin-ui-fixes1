import { DatePipe } from "@angular/common";

export class IComposeNewMail {
  from: string;
  to: string;
  cc: string;
  body: string;
  subject: string;
  sentBy: string;
  isActive: boolean;
  sentDate: Date;
}