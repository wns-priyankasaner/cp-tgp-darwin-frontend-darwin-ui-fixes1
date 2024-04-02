export interface ISentViewMail {
    emailId: number;
    subject: string;
    toReceipient: string;
    ccReceipient: string | null;
    bccReceipient: string | null;
    emailSendType: string;
    category: string;
    subCategory: string;
    sentDate: Date;
    body: string;
    sentBy: string | null;
    categoryEmail: string | null;
  }
  