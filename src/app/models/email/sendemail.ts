export interface IComposeEmail {
    body: string;
    cc: string;
    bcc: string;
    emailID: number;
    subject: string;
    workID: number;
    to: string;
    emailSendType: string;
    status:number;
    sentDate:Date;
    from:string;
  }
  