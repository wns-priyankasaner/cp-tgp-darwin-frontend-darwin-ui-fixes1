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
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import 'trix';

interface ChangeItem {
  content: string;
}
@Component({
  selector: 'app-send-email',
  templateUrl: './send-email-dialog.component.html',
  styleUrls: ['./send-email-dialog.component.scss']
})
export class SendEmailComponent implements OnInit,AfterViewInit {
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
  sanitizedMessageValue: SafeHtml = '';
  selectedAction: string;
  emailId: number;
  toValue: string;
  fromValue: string = "darwin.utility@wns.com";
  ccValue: string =  "";
  bccValue: string = "";
  subjectValue: string = "";
  templateValue: string = '';
  messageValue: string ='';
  bodyValue: string;
  isCheckedYes = false;
  isCheckedNo = false;
  responsetemplate: any[];
  responseTemplateLoaded = false;
  emailSignature: IEmailSignature[];
  categoryId: number = 34;
  selectedValue: string;
  emailSendTye: string;
  workId: number;
  status: number;
  templateContents: string;
  selectedFiles: File[] = [];
  fileNames: string[] = [];
  selectedFileContent: string = '';
  attachmentDetails: IAttachment[] = [];
  folders: string[] = ['MKT_Billing', 'MKT_COO'];
  attachments: IAttachment[] = [];
  plainTextContent: string = '';
  changes:string[]=[];
  currentChangeIndex:number=-1;
  isLoading:boolean=false;
  goldLink: string =
    'https://app.customerthermometer.com/?template=log_feedback&hash=d750aef1&embed_data=dGVtcGVyYXR1cmVfaWQ9MSZ0aGVybW9tZXRlcl9pZD0xNjcwOTYmbnBzX3JhdGluZz0tMQ==&e=Anonymous&f=&l=&c=&c1=' +
    this.fromValue +
    '&c2=' +
    this.fromValue +
    '&c3=&c4=&c5=&c6=&c7=&c8=&c9=&c10=';

  greenLink: string =
    'https://app.customerthermometer.com/?template=log_feedback&hash=3d25b509&embed_data=dGVtcGVyYXR1cmVfaWQ9MiZ0aGVybW9tZXRlcl9pZD0xNjcwOTYmbnBzX3JhdGluZz0tMQ==&e=Anonymous&f=&l=&c=&c1=' +
    this.fromValue +
    '&c2=' +
    this.fromValue +
    '&c3=&c4=&c5=&c6=&c7=&c8=&c9=&c10=';

  yellowLink: string =
    'https://app.customerthermometer.com/?template=log_feedback&hash=a8bde0f6&embed_data=dGVtcGVyYXR1cmVfaWQ9MyZ0aGVybW9tZXRlcl9pZD0xNjcwOTYmbnBzX3JhdGluZz0tMQ==&e=Anonymous&f=&l=&c=&c1=' +
    this.fromValue +
    '&c2=' +
    this.fromValue +
    '&c3=&c4=&c5=&c6=&c7=&c8=&c9=&c10=';

  redLink: string =
    'https://app.customerthermometer.com/?template=log_feedback&hash=e912c358&embed_data=dGVtcGVyYXR1cmVfaWQ9NCZ0aGVybW9tZXRlcl9pZD0xNjcwOTYmbnBzX3JhdGluZz0tMQ==&e=Anonymous&f=&l=&c=&c1=' +
    this.fromValue +
    '&c2=' +
    this.fromValue +
    '&c3=&c4=&c5=&c6=&c7=&c8=&c9=&c10=';

  constructor(public dialog: MatDialog, private httpClient: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SendEmailComponent>, private _emailService: EmailService, private _commonService: CommonService, private sanitizer: DomSanitizer) {
    this.selectedAction = data.selectedAction;
  }

  ngOnInit(): void {
    this.isCheckedYes = true;
    this.isCheckedNo = false;
    this.getResponsetemplate();
    this.onCheckboxChange('yes');
    //this.getAttachments();
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
    const files: FileList = event.target.files;
    if (files.length > 0) {

      const fileArray: File[] = Array.from(files);


      const attachments: IAttachment[] = await this.processSelectedFiles(fileArray);


      this._emailService.saveUploadedfiles(attachments).subscribe(
        (response: any) => {

          console.log('Attachments saved successfully:', response);
          this.getAttachments();
        },
        (error: any) => {
          console.error('Error saving attachments:', error);
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
        emailId: 7,
      };


      attachment.fileData = await this.readFileDataAsBase64(file);

      attachments.push(attachment);
    }

    //console.log('Number of attachments:', attachments.length);
    //console.log('Attachments details:', attachments);

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
          },
          (error) => {
            console.error('Error deleting attachment:', error);
          }
        );
      }
    });
  }

  getAttachments(): void {
    const emailId =7 //this.emailId; // Provide the emailId value
    const emailSentType = 'Reply';//this.emailSendTye; // Provide the emailSentType value

    this._emailService.getAttachments(emailId, emailSentType).subscribe(
      (attachments: IAttachment[]) => {
        this.attachments = attachments;
        //console.log(this.attachments);
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
    this._emailService.loadAttachment(attachmentId).subscribe(
      attachment => {
        if (attachment == null || attachment.fileData == null) {
          // File not available. Handle accordingly.
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

  getResponsetemplate() {
    this._emailService.getResponseTemplate(this.categoryId).subscribe(result => {
      this.responsetemplate = result;

      this.responseTemplateLoaded = true;
    });
  }
  onTemplateSelectionChange() {
    const selectedTemplate = this.responsetemplate.find(template => template.fileName === this.templateValue);
    
    if (selectedTemplate) {
      this.httpClient.get(`assets/html_templates/response_templates/${selectedTemplate.fileName}`, { responseType: 'text' }).subscribe(
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
  


  getEmailSignature() {
    this._emailService.getEmailSignature(this.categoryId).subscribe(result => {
      this.emailSignature = result;
    })
  }

  sendReply() {
    this.getEmailSignature();

    const emailData: IComposeEmail = {
      workID: 7,
      emailID: 7,
      subject: this.subjectValue,
      body: this.messageValue,
      to: this.toValue,
      cc: this.ccValue,
      bcc: '',
      status: 0,
      emailSendType: this.emailSendTye,
      sentDate: new Date(),
      from:this.fromValue
    };


    this._emailService.saveSendEmailHistory(emailData).subscribe(
      response => {

        alert('Email sent successfully');
        const emailContent = `
        From: ${this.fromValue}
        To: ${this.toValue}
        CC: ${this.ccValue}
        Subject: ${this.subjectValue}
        Body: ${this.messageValue}
       Attachments: ${this.attachments.map(attachment => attachment.fileName).join(', ')}
       Response Templates: ${JSON.stringify(this.responsetemplate, null, 2)}
      `;


        alert('Email sent successfully!\n\n' + emailContent);
        this.dialogRef.close();

      },
      error => {
        console.error('Error sending email:', error);
        alert('Something went wrong');
      }
    );
  }
  saveAttachmentDetails() {

    this._emailService.saveUploadedfiles(this.attachmentDetails).subscribe(
      response => {


      },
      error => {

        alert('Error saving attachment details');
      }
    );
  }

  onCheckboxChange(selectedCheckbox: string) {
    if (selectedCheckbox === 'yes') {
      this.isCheckedNo = false;


      if (this.isCheckedYes) {
        this.httpClient.get('assets/html_templates/email_feedback_sign.html', { responseType: 'text' }).subscribe(
          (content: string) => {

            this.sanitizedMessageValue = this.sanitizer.bypassSecurityTrustHtml(content);

          },
          (error: any) => {
            console.error('Failed to fetch template content:', error);
          }
        );
      } else {


      }
    } else if (selectedCheckbox === 'no') {

      this.isCheckedYes = false;



      this.sanitizedMessageValue = '';
    }
  }

  onSymbolClick(event: MouseEvent, link: string) {
    event.stopPropagation();
    window.open(link, '_blank');
    console.log('Symbol clicked.');
    const target = event.target as HTMLElement;
    console.log('Target element:', target);
    if (target.tagName === 'I') {

      const symbolClass = target.getAttribute('class');
      console.log('Symbol class:', symbolClass);
      switch (symbolClass) {
        case 'gold-symbol':
          console.log('Opening gold link:', this.goldLink);
          this.openLink(this.goldLink);
          break;
        case 'green-symbol':
          console.log('Opening green link:', this.greenLink);
          this.openLink(this.greenLink);
          break;
        case 'yellow-symbol':
          console.log('Opening yellow link:', this.yellowLink);
          this.openLink(this.yellowLink);
          break;
        case 'red-symbol':
          console.log('Opening red link:', this.redLink);
          this.openLink(this.redLink);
          break;
        default:
          break;
      }
    }
  }

  openLink(link: string) {

    window.open(link, '_blank');
  }
  closeModal() {
    this.dialogRef.close();
  }


}
