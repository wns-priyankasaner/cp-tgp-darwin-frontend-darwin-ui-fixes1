export interface IWorkmanagementModel{

    workID:number;
    emailCategory:string;
    emailInboxCategory:string;
    subCategory:string;
    receivedDate:string;
    subject:any;
    workedBy:string;
    workStatus:string;
    workFinishDate:string;
    expiryDate:string;
    emailInbox:string;
    EmailID:string;
    EmailSubCategory :string;
    categoryID : number;
    BulkRequest:boolean;
    NumberOfBulkRequest:number;
    MPAN:string;
    FutureDate:string;
    correctedSubCategoryID:number;
    category:string;
    IsSubCategoryCorrect:boolean;
    ActionID:number;
    from:string;
    to:string;
    cc:string;
    bCc:string;
    body:string;
    Comments:string;
    IncorrectTagging:boolean;
    AccountNumber:string;
    sentiment:string;
    SpamOrJunk:boolean;
    contactTypeId:any;
    activityTotalTime:string;
    
 }