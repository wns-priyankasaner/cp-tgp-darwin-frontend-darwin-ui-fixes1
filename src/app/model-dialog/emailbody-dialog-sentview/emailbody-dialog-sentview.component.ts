import { Component, Inject, OnInit, ViewChild, ElementRef, Input,AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IEmailSignature } from 'src/app/models/email/emailsignature';
import { IResponseTemplate } from 'src/app/models/email/responsetemplate';
import { EmailService } from 'src/app/services/email.service';
import { CommonService } from 'src/app/services/common.service';
import { IBreak } from 'src/app/models/common/break';
import { Binary } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { IComposeEmail } from 'src/app/models/email/sendemail';
import { IAttachment } from 'src/app/models/email/attachments';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ISentViewMail } from 'src/app/models/email/sentview';
import { forkJoin } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import 'trix';
import { UserService } from 'src/app/services/user.service';
interface ChangeItem {
  content: string;
}
@Component({
  selector: 'app-emailbody-dialog-sentview',
  templateUrl: './emailbody-dialog-sentview.component.html',
  styleUrls: ['./emailbody-dialog-sentview.component.scss']
})

export class EmailbodyDialogSentviewComponent implements OnInit,AfterViewInit {
  @ViewChild('trixEditor', { static: false }) trixEditor: ElementRef;
  ngAfterViewInit() {
    const editor = this.trixEditor.nativeElement;
    editor.addEventListener('trix-initialize', () => {
      this.removeDefaultTrixButtons(editor);
    });
  }
  removeDefaultTrixButtons(editor: any) {
    const toolbar = editor.toolbarElement;
    if (toolbar) {
      const defaultButtons = toolbar.querySelectorAll('.trix-button');
      defaultButtons.forEach((button: HTMLButtonElement) => {
        button.remove();
      });
    }
  }
  sanitizedMessageValue: SafeHtml = '';
  @Input() apiResponse: any;
  selectedAction: string;
  emailId: number;
  toValue: any;
  fromValue: any;
  ccValue: string;
  bccValue: string;
  subjectValue: string;
  templateValue: string;
  messageValue: string;
  bodyValue: string;
  isCheckedYes = false;
  isCheckedNo = false;
  responsetemplate: any[];
  responseTemplateLoaded = false;
  emailSignature: IEmailSignature[];
  categoryId: number = 34;
  selectedValue: string;
  emailSendTye: string = "Reply";
  workId: number;
  status: number;
  templateContents: string;
  selectedFiles: File[] = [];
  fileNames: string[] = [];
  selectedFileContent: string = '';
  attachmentDetails: IAttachment[] = [];
  folders: string[] = ['MKT_Billing', 'MKT_COO'];
  body: string;
  dataSource: ISentViewMail[] = [];
  noRecordFound: boolean = false;
  attachments: IAttachment[] = [];
  attachmentId: number;
  isLoading: boolean = false;
  currentChangeIndex:number=-1;
  changes:string[]=[];
  currentUserId: string;
  
  constructor(private _emailservice: EmailService, private httpClient: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EmailbodyDialogSentviewComponent>, private _emailService: EmailService, 
  private _commonService: CommonService, private sanitizer: DomSanitizer, public dialog: MatDialog,
  private _userService:UserService) {
    this.selectedAction = data.selectedAction;
  }
  ngOnInit(): void {
    this.isCheckedYes = true;
    this.isCheckedNo = false;
    this.getResponsetemplate();
    this.getAttachments();
    this.isLoading = true;
    this.getSentEmailList().subscribe(
      (emails: ISentViewMail[] | ISentViewMail) => {
        if (Array.isArray(emails) && emails.length > 0) {
          const email = emails[0];
          this.fromValue = email.categoryEmail || '';
          this.toValue = email.toReceipient || '';
          this.subjectValue = email.subject;
          this.bodyValue = email.body;
        }
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Failed to fetch sent emails:', error);
        this.isLoading = false;
      }
    );

    this._userService.currentUser$.subscribe(s=>{
      this.currentUserId = s;
   })
 
  }


  @Input() isViewMode: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  applyTrixAttribute(attribute: string) {
    const editor = this.trixEditor.nativeElement;
  
    if (editor) {
      if (attribute === 'link') {
       
        const url = prompt('Enter the URL:');
        if (url) {
          editor.editor.activateAttribute({
            href: url,
            target: '_blank', 
          });
        }
      } else {
       
        editor.editor.activateAttribute(attribute);
      }
    }
  }
  undo() {
    if (this.currentChangeIndex > 0) {
      this.currentChangeIndex--;
      this.updateEditorContent();
    }
  }
  
  redo() {
    if (this.currentChangeIndex < this.changes.length - 1) {
      this.currentChangeIndex++;
      this.updateEditorContent();
    }
  }
  updateEditorContent() {
    if (this.trixEditor && this.changes.length > 0) {
      const currentChange = this.changes[this.currentChangeIndex];
      const trixEditor = this.trixEditor.nativeElement;
  
      if (typeof currentChange === 'string') {
        
        trixEditor.editor.loadHTML(currentChange);
      }
    }
  }
  handleTrixChange(event:any){
    const currentContent =event.target.innerHTML;
    this.addChange(currentContent);
    
  }
  addChange(content:string){
    if(this.currentChangeIndex < this.changes.length -1){
      this.changes.splice(this.currentChangeIndex +1);
    }
    this.changes.push(content);
    this.currentChangeIndex=this.changes.length -1;
  }
  increaseIndent() {
    const editor = this.trixEditor.nativeElement;
    if (editor) {
      editor.editor.increaseNestingLevel();
    }
  }
  
  decreaseIndent() {
    const editor = this.trixEditor.nativeElement;
    if (editor) {
      editor.editor.decreaseNestingLevel();
    }
  }

  async attachFile(event: any) {
    this.isLoading = true;
    const files: FileList = event.target.files;
    if (files.length > 0) {

      const fileArray: File[] = Array.from(files);


      const attachments: IAttachment[] = await this.processSelectedFiles(fileArray);


      this._emailService.saveUploadedfiles(attachments).subscribe(
        (response: any) => {

          console.log('Attachments saved successfully:', response);
          this.getAttachments();
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Error saving attachments:', error);
          this.isLoading = false;
        }
      );


      event.target.value = '';
    }
  }
  async processSelectedFiles(files: File[]): Promise<IAttachment[]> {
    const attachments: IAttachment[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const attachment: IAttachment = {
        isActive: true,
        attachmentId: 0,
        attachmentsPath: null,
        fileName: file.name,
        contentType: file.type,
        fileData: '',
        file: file,
        showExcelIcon: false,
        showPDFIcon: false,
        showJPEGIcon: false,
        showFileIcon: false,
        showTXTIcon: false,
        isExistingAttachment: false,
        emailId: 1,
      };


      attachment.fileData = await this.readFileDataAsBase64(file);

      attachments.push(attachment);
    }

    console.log('Number of attachments:', attachments.length);
    console.log('Attachments details:', attachments);

    return attachments;
  }

  readFileDataAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        // Get the Base64 string representation of the file data
        const base64String = event.target.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }



  deleteAttachment(attachmentId: number) {
    this.isLoading = true;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this attachment?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User confirmed, proceed with deletion
        this._emailService.deleteAttachment(attachmentId).subscribe(
          (result) => {
            if (result) {
              console.log('Attachment deleted successfully.');
              // Update the attachments list after deleting the attachment
              this.attachmentDetails = this.attachmentDetails.filter((attachment) => attachment.attachmentId !== attachmentId);
              // Update the icons for the remaining attachments
              this.processAttachments();
              this.getAttachments();
            } else {
              console.log('Attachment not found.');
            }
            this.isLoading = false;
          },
          (error) => {
            console.error('Error deleting attachment:', error);
            this.isLoading = false;
          }
        );
      }else{
        this.isLoading = false;
      }
    });
  }

  getAttachments(): void {
    const emailId = 1; // Provide the emailId value
    const emailSentType = 'Reply'; // Provide the emailSentType value

    this._emailservice.getAttachments(emailId, emailSentType).subscribe(
      (attachments: IAttachment[]) => {
        this.attachments = attachments;
        console.log(this.attachments);
        this.processAttachments(); // Call the method to modify the attachments array
        //console.log(this.attachments); // Log the updated attachments array
      },
      (error: any) => {
        console.error('Failed to fetch attachments:', error);
      }
    );
  }

  processAttachments(): void {
    for (const attachment of this.attachments) {
      if (attachment.fileName) {
        const ext = attachment.fileName.substring(attachment.fileName.lastIndexOf('.') + 1).toLowerCase();

        if (ext === 'xls' || ext === 'xlsx' || ext === 'csv') {
          attachment.icon = 'description';
        } else if (ext === 'pdf') {
          attachment.icon = 'picture_as_pdf';
        } else if (ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'png' || ext === 'bmp') {
          attachment.icon = 'image';
        } else if (ext === 'txt') {
          attachment.icon = 'description';
        } else {
          attachment.icon = 'insert_drive_file';
        }
      }
    }
  }
  getIconClass(attachment: IAttachment): string {
    return 'material-icons';
  }

  getIcon(attachment: IAttachment): string {
    return attachment.icon || '';
  }


  getEmailSignature() {
    this._emailService.getEmailSignature(this.categoryId).subscribe(result => {
      this.emailSignature = result;
    })
  }
  getResponsetemplate() {
    this._emailService.getResponseTemplate(this.categoryId).subscribe(result => {
      this.responsetemplate = result;
      this.responseTemplateLoaded = true;
    });
  }
  onTemplateSelectionChange() {
    const selectedTemplate = this.responsetemplate.find(template => template.fileName === this.templateValue);
    
    if (selectedTemplate) {
      this.httpClient.get(`assets/html_templates/EmailResponse/${selectedTemplate.fileName}`, { responseType: 'text' }).subscribe(
        (content: string) => {
          const trixEditor = this.trixEditor.nativeElement;
  
          // Clear the current content in the editor
          trixEditor.editor.loadHTML('');
  
          // Load the HTML content into the Trix editor
          trixEditor.editor.loadHTML(content);
        },
        (error: any) => {
          console.error('Failed to fetch template content:', error);
        }
      );
    }
  }
  
  
  private extractPlainText(htmlContent: string): string {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlContent;
  
    // Use a regular expression to replace line breaks with '\n'
    return tempElement.innerText.trim().replace(/\r?\n/g, '\n');
  }

  openFile(attachmentId: number): void {
    this._emailservice.loadAttachment(attachmentId).subscribe(
      attachment => {
        if (attachment == null || attachment.fileData == null) {

        } else {
          const blob = this.base64toBlob(attachment.fileData, attachment.contentType);
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = attachment.fileName;
          link.click();
        }
      },
      error => {
        console.error('Error opening attachment:', error);
        alert('Something went wrong');
      }
    );
  }

  private base64toBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  sendReply() {
    this.isLoading = true;
    this.getEmailSignature();

    const emailData: IComposeEmail = {
      workID: 7,
      emailID: 7,
      subject: this.subjectValue,
      body: this.messageValue,
      to: this.toValue,
      cc: this.ccValue,
      bcc: 'abc@wns.com.com',
      status: 0,
      emailSendType: 'Reply',
      sentDate: new Date(),
      from:this.fromValue
    };


    this._emailService.saveSendEmailHistory(emailData).subscribe(
      response => {

        alert('Email sent successfully');
        this.saveAttachmentDetails();
        this.isLoading = false; 
      },
      error => {
        console.error('Error sending email:', error);
        alert('Something went wrong');
        this.isLoading = false; 
      }
    );
  }
  saveAttachmentDetails() {

    this._emailService.saveUploadedfiles(this.attachmentDetails).subscribe(
      response => {
        console.log('Attachment details saved successfully:', response);

      },
      error => {

        alert('Error saving attachment details');
      }
    );
  }

  onCheckboxChange(selectedCheckbox: string) {
    if (selectedCheckbox === 'yes') {

      this.isCheckedNo = false;
    } else if (selectedCheckbox === 'no') {

      this.isCheckedYes = false;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
  getSentEmailList() {
    const userId = this.currentUserId;
    const categoryId = 0;
    const subCategoryId = 0;
    const subject = 'RE: Re: THE MEDICAL CENTRE';
    const sentDateRange = '2022-09-02@2022-09-14';
    const sendType = 'reply';

    return this._emailservice.getSentEmailList(userId, categoryId, subCategoryId, subject, sentDateRange, sendType);
  }


}
