import { Component, OnInit, ViewChild, ElementRef, Inject, Input,AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { EmailService } from 'src/app/services/email.service';
import { IEmailCategories } from 'src/app/models/email/emailcategories';
import { IAttachment } from 'src/app/models/email/attachments';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IComposeNewMail } from 'src/app/models/email/composenewmail';
import { forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DateRange } from '@angular/material/datepicker';
import { LoadingSpinnerComponent } from 'src/app/loading-spinner/loading-spinner.component';
import 'trix';
import { UserService } from 'src/app/services/user.service';
interface ChangeItem {
  content: string;
}
@Component({
  selector: 'app-compose-new-email-dialog',
  templateUrl: './compose-new-email-dialog.component.html',
  styleUrls: ['./compose-new-email-dialog.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class ComposeNewEmailDialogComponent implements OnInit,AfterViewInit {
  private typo: any;
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
  plainTextContent: string = '';
  changes:string[]=[];
  currentChangeIndex:number=-1;
  isLoading:boolean=false;
  toValue: string = '';
  fromValue: string;
  ccValue: string = '';
  bccValue: string;
  subjectValue: string = '';
  messageValue: string = '';
  bodyValue: string;
  isCheckedYes: boolean = false;
  isCheckedNo: boolean = false;
  emailCategories: IEmailCategories[] = [];
  selectedEmails: string = '';
  attachments: IAttachment[] = [];
  attachmentDetails: IAttachment[] = [];
  isGraphSearch:any;
  composeEmail:any;
  customerEmails:any;
  currentUserId: string;
  constructor(
    public dialogRef: MatDialogRef<ComposeNewEmailDialogComponent>, 
    private _emailservice: EmailService, private sanitizer: DomSanitizer, public dialog: MatDialog
    , @Inject(MAT_DIALOG_DATA) public data: any,
    private _userService:UserService
  ) { }
  ngOnInit(): void {
    this.isCheckedYes = true;
    this.isCheckedNo = false;
    const userEmail = this.currentUserId;
    this.getEmailCategoriesByUser(userEmail);

    
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
      // Convert FileList to a regular array of File objects
      const fileArray: File[] = Array.from(files);

      // Convert File objects to Attachment objects
      const attachments: IAttachment[] = await this.processSelectedFiles(fileArray);

      // Call the API to save attachments
      this._emailservice.saveUploadedComposefiles(attachments).subscribe(
        (response: any) => {
          // Handle the response from the API if needed
          console.log('Attachments saved successfully:', response);
          this.getAttachments();
          this.isLoading = false;
        },
        (error: any) => {
          console.error('Error saving attachments:', error);
          this.isLoading = false;
        }
      );

      // Clear the file input field
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
        this._emailservice.deleteComposeAttachment(attachmentId).subscribe(
          (result) => {
            if (result) {
              console.log('Attachment deleted successfully.');
              // Update the attachments list after deleting the attachment
              this.attachmentDetails = this.attachmentDetails.filter((attachment) => attachment.attachmentId !== attachmentId);
              // Update the icons for the remaining attachments
              this.processAttachments();
              this.getAttachments();
              this.isLoading = false; 
            } else {
              console.log('Attachment not found.');
            }
          },
          (error) => {
            console.error('Error deleting attachment:', error);
            this.isLoading = false; 
          }
        );
      }
    });
  }
  getEmailCategoriesByUser(userEmail: string): void {
    this.isLoading = true; 
    this._emailservice.getEmailCategoriesByUser(userEmail)
      .subscribe((data: IEmailCategories[]) => {
        this.emailCategories = data;
        this.isLoading = false; 
      });
  }
  onEmailSelectionChange(email: string): void {

    this.selectedEmails = email;
  }

  getAttachments(): void {
    const emailId = 1; // Provide the emailId value
    const emailSentType = 'Compose'; // Provide the emailSentType value

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
  openFile(attachmentId: number): void {
    this._emailservice.loadComposeAttachment(attachmentId).subscribe(
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
    const currentDateTime = new Date();
    const composeEmailData: IComposeNewMail = {
      from: 'darwin.utility@wns.com', //this.selectedEmails, // Use the selectedEmails array or any other logic to populate this
      to: this.toValue,
      cc: '',//this.ccValue,
      subject: this.subjectValue,
      body: this.messageValue,
      isActive: true,
      sentDate: currentDateTime,
      sentBy: this.currentUserId
    };
    console.log('Compose Email Data:', composeEmailData);
    this._emailservice.saveComposeEmail(composeEmailData)
      .subscribe((response) => {
        console.log('Email saved successfully:', response);
       alert('Email saved successfully!'); 
       const emailContent = `
          From:  ${this.selectedEmails}
          To: ${this.toValue}
          CC: ${this.ccValue}
          Subject: ${this.subjectValue}
          Message: ${this.messageValue}
          Attachments: ${this.attachments.map(attachment => attachment.fileName).join(', ')}
        `;

        alert('Email sent successfully!\n\n' + emailContent);
        this.dialogRef.close();
        this.isLoading = false; 
      }, (error) => {
        console.error('Error saving email:', error);
        this.isLoading = false; 

      });

    this.dialogRef.close();
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


//   SearchUserGraph (event:any, emailPointer:any) {

//     if ((this.composeEmail.[emailPointer] !== undefined || this.composeEmail.[emailPointer] !== '') && this.composeEmail.[emailPointer].length > 2) {

//         this.customerEmails = [];


//         this.TempToEmail = this.composeEmail.[emailPointer];

//         let keywordSearchArray = this.composeEmail.[emailPointer].split(';');

//         let keywordSearch = keywordSearchArray[keywordSearchArray.length - 1];

//         //jeWorkAllocationService.getExistingUserEmail($scope.composeEmail.To).then(function (response) {


//         if ((event.altKey && event.keyCode === 75) || this.isGraphSearch == false) {


//           this.isGraphSearch = true;

//             EmailService.SearchUserGraph(keyword:String).then(function (response) {

//                 // console.log(response.data);

//                 this.customerEmails = response.data;

//             });

//         }

//         else {

//             EmailService.getExistingUserEmail(keywordSearch).then(function (response) {

//                 this.customerEmails = response.data;

//             });

//         }

//     }

//     else {

//         this.isGraphSearch = false;

//     }

// }
}
