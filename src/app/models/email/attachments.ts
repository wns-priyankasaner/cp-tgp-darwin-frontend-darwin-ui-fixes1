export interface IAttachment{
    attachmentId: number;
  attachmentsPath: string |null;
  fileName: string;
  contentType: string;
  fileData: string;
  file: File;
  showExcelIcon: boolean;
  showPDFIcon: boolean;
  showJPEGIcon: boolean;
  showTXTIcon: boolean;
  showFileIcon: boolean;
  isExistingAttachment: boolean;
  emailId:number;
  icon?: string;
  fileUrl?: string;
  isActive:boolean;
}
interface AttachmentData extends IAttachment {
  attachmentDetails: IAttachment[];
  selectedFiles: File[];
}