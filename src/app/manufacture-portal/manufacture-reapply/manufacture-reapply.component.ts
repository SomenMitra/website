import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import Swal from 'sweetalert2';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-manufacture-reapply',
  templateUrl: './manufacture-reapply.component.html',
  styleUrls: ['./manufacture-reapply.component.css']
})
export class ManufactureReapplyComponent {
  languageNew: string;
  profileId: any;
  processId: any;
  manufactureInfo: any;
  public loading = false;
  reApplyDate: any;
  expiryDate: any;
  currentDate: Date = new Date(); // Get the current date
  miName: any;
  isRenewFormVisible: boolean = false;
  maxDate: NgbDateStruct; 
  reRegister: FormGroup;
  maxFileSize = 2 * 1024 * 1024; // 2 MB
  fileType = 'jpg,jpeg,png,pdf';
  percentUploaded = [0];
  isMultipleUploaded = false;
  uploadedFiles: any;
  showHideUploadedFiles = false;
  resp: any;
  isReRegister: number;
  appliedOn: any;
  bgDocument: any;
  validityDate: any;
  status: any;
  jsonBgDocument: any;
  jsonValidityDate: any;
  fromDate: any;
  toDate: any;
  vchReferenceNo: any;
  respSts: number;
  respList: any;
  intOnlineServiceId: any;
  intProcessId: any;
  docPath: any;
  remarkByOff: any;
  constructor(public translate: TranslateService, private api: ManufactureSchemeService, private fb: FormBuilder, public vldChkLst: ValidatorchklistService, private fuService: FileUploadService, ) {
    translate.addLangs(['English', 'Odia']);

    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      //console.log(browserLang)
      translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
      $('body').addClass(browserLang);
    } else {
      localStorage.setItem('locale', 'English');
      translate.setDefaultLang('English');
    }
    const currentDate = new Date();
    this.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };

    this.reRegister = this.fb.group({
      formFile: ['', [Validators.required, this.validateFile.bind(this)]],
      txtValidityFromDate: ['', Validators.required],
      txtValidityToDate: ['', Validators.required],
      remark: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.languageNew = localStorage.getItem('locale');
    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-dark');
      $('#slider').prop("checked", true)
    } else {
      this.setTheme('theme-light');
      $('#slider').prop("checked", false)
    }

    this.manufactureInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.reApplyDate = this.manufactureInfo.MI_REAPPLY_DATE;
    this.expiryDate = this.manufactureInfo.MI_EXPIRY_DATE;
    this.miName = this.manufactureInfo.USER_FULL_NAME;
    this.getReapplyDetails();
  }
  setTheme(themeName: any) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }
  getReapplyDetails() {
    let params = {
      "miSchemeId": this.manufactureInfo.MI_SCHEME_ID,
      "profileId": this.manufactureInfo.USER_ID
    };
    this.loading = true;
    this.api.getReapplyDetails(params).subscribe(res => {
      this.loading = false;
      this.resp = res.result;
      this.isReRegister = this.resp[0].res.isReRegister;
      this.vchReferenceNo = this.resp[0].res.vchReferenceNo;
      this.status = this.resp[0].status;
      this.appliedOn = this.resp[0].notingDetails.dtActionTaken;
      this.remarkByOff = this.resp[0].notingDetails.txPublicNoting;
      this.jsonBgDocument = this.resp[0].notingDetails.jsnAdditionalDocument ? this.resp[0].notingDetails.jsnAdditionalDocument : [];
      this.bgDocument = this.jsonBgDocument.length > 0 ? JSON.parse(this.jsonBgDocument):[];
      this.bgDocument = this.bgDocument[0];
      this.jsonValidityDate = this.resp[0].notingDetails.txtOtherDetails ? this.resp[0].notingDetails.txtOtherDetails:[];
      this.validityDate = this.jsonValidityDate.length > 0 ? JSON.parse(this.jsonValidityDate):[];
      this.fromDate = this.validityDate[0];
      this.toDate = this.validityDate[1];
      let manufactureParam = {
        "profileId": this.manufactureInfo.USER_ID,
        "referenceNo": this.vchReferenceNo
      };
      this.getManufactureStatus(manufactureParam);
     });
    
  }

  getManufactureStatus(params: any) {
    this.loading = true;
    this.api.getManufactureStatus(params).subscribe(res => {
      //console.log(res.result);
      this.respSts = res.status;
      if (this.respSts == 1) {
        this.loading = false;
        this.respList = res.result;
        this.intOnlineServiceId = this.respList[0]['intOnlineServiceId'];
        this.intProcessId = this.respList[0]['intProcessId'];
        this.docPath = this.respList[0].docPath;
        // console.log(this.proceedingLetter);
        // console.log(this.docPath);
      }
      // this.landareaid = this.respList[0].schemeSetResults.intLandareaId;
      // this.AuthUpdateSts = res.result[0].subsidyList[0].AuthUpdateSts;
      // if (res.status.directorate == 'Mo Bidyut') {
      //   this.refText = 'UPAN No.'
      // }
    });
  }
  // Function to check if the expiry date is in the future or past
  isExpired(): boolean {
    const [day, month, year] = this.expiryDate.split('/').map(Number);
    const expiry = new Date(year, month - 1, day);
    return expiry <= this.currentDate;
  }
  showRenewForm() {
    this.isRenewFormVisible = !this.isRenewFormVisible; // Toggle visibility
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr.split('/').reverse().join('-')); // Convert to "yyyy-MM-dd"
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    // Function to get ordinal suffix
    const getOrdinalSuffix = (day: number) => {
      return ['th', 'st', 'nd', 'rd'][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  }
  onDateSelectTest(): void {
    let txtValidityFromDate = $(".txtValidityFromDate").attr("id");
    let txtValidityToDate = $(".txtValidityToDate").attr("id");

    // Get the values from the input fields
    const fromDateValue = (<HTMLInputElement>document.getElementById(txtValidityFromDate)).value;
    const toDateValue = (<HTMLInputElement>document.getElementById(txtValidityToDate)).value;

    // Split and construct Date objects
    const fromDateParts = fromDateValue.split('/');
    const toDateParts = toDateValue.split('/');
    const fromDate = new Date(+fromDateParts[2], +fromDateParts[1] - 1, +fromDateParts[0]);
    const toDate = new Date(+toDateParts[2], +toDateParts[1] - 1, +toDateParts[0]);

    // Check if the toDate is smaller than the fromDate
    if (toDate < fromDate) {
      Swal.fire({
        icon: 'error',
        text: 'From Date should not be greater than To Date'
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear the input fields
          (<HTMLInputElement>document.getElementById(txtValidityFromDate)).value = '';
          (<HTMLInputElement>document.getElementById(txtValidityToDate)).value = '';

          // Manually reset the datepicker states to allow re-selecting the previous date
          const fromDateElement = document.getElementById(txtValidityFromDate);
          const toDateElement = document.getElementById(txtValidityToDate);

          // Trigger 'input' event to update the datepicker internally
          fromDateElement.dispatchEvent(new Event('input', { bubbles: true }));
          toDateElement.dispatchEvent(new Event('input', { bubbles: true }));

          // Alternatively, you could trigger focus and blur events to reset the state visually
          fromDateElement.focus();
          fromDateElement.blur();
          toDateElement.focus();
          toDateElement.blur();
        }
      });
    }
  }

  preventInput(event: KeyboardEvent | ClipboardEvent | Event): void {
    event.preventDefault();
  }

  // Custom validator for file type and size
  validateFile(control: any) {
    const file = control.value;  // This won't directly give the file object, but the file input

    if (file && file instanceof File) {  // Ensure file is of the correct type
      const fileType = file.name.split('.').pop().toLowerCase();
      const validTypes = ['jpg', 'jpeg', 'png', 'pdf'];

      if (!validTypes.includes(fileType)) {
        return { invalidFileType: true };
      }

      if (file.size > this.maxFileSize) {
        return { invalidFileSize: true };
      }
    }
    return null;
  }
  previewFile(fileOrUrl: File | string, event: Event): void {
    event.preventDefault();
    if (fileOrUrl instanceof File) {
      // Handle File object
      const fileURL = URL.createObjectURL(fileOrUrl);
      window.open(fileURL, '_blank');
    } else {
      window.open(fileOrUrl, '_blank');
    }
  }

  onFileSelect(event: any) {
    const fileInput = event.target;  // Reference to the input field
    const file = fileInput.files[0]; // Get the selected file
    if (file && this.checkDocumentValidation(file)) {
      this.uploadedFiles = file;
      this.showHideUploadedFiles = true;
    } else {
      this.reRegister.get('formFile')?.setValue(''); // Clear form control if validation fails
      fileInput.value = ''; // Clear the file input field
      this.uploadedFiles = '';
      this.showHideUploadedFiles = false;
    }
  }

  checkDocumentValidation(file: File): boolean {
    const extension = file.name.split('.').pop().toLowerCase();
    const maxSizeInMB = 2;
    const fileSizeInMB = file.size / (1024 * 1024);
    const acceptableTypes = this.fileType.split(',').map(type => type.toLowerCase());

    if (!acceptableTypes.includes(extension)) {
      Swal.fire({
        icon: 'error',
        text: 'Upload only ' + this.fileType
      });
      return false;
    }

    if (fileSizeInMB > maxSizeInMB) {
      Swal.fire({
        icon: 'error',
        text: ' File size should be < ' + maxSizeInMB + 'MB'
      });
      return false;
    }
    return true;
  }
  // Prevent invalid form submission
  onSubmit() {
    let errFlag = 0;
    const formData = new FormData();
    let txtValidityFromDate = $(".txtValidityFromDate").attr("id");
    let txtValidityToDate = $(".txtValidityToDate").attr("id");
    let isReRegisterSts = $(".isReRegisterSts").attr("id");
    const fromDateValue = (<HTMLInputElement>document.getElementById(txtValidityFromDate)).value;
    const toDateValue = (<HTMLInputElement>document.getElementById(txtValidityToDate)).value;
    const reRegisterSts = (<HTMLInputElement>document.getElementById(isReRegisterSts)).value;
    // let reRegisterSts = this.reRegister.value.isReRegisterSts ? this.reRegister.value.isReRegisterSts : 0; 
    let remark = this.reRegister.value.remark != undefined ? this.reRegister.value.remark : "";
    
    if ((errFlag == 0) && !this.uploadedFiles) {
      Swal.fire({
        icon: 'error',
        text: 'Upload BG Document'
      });
      errFlag = 1;  
      return;
    }
    if ((errFlag == 0) && !fromDateValue) {
      Swal.fire({
        icon: 'error',
        text: 'Enter From Date'
      });
      errFlag = 1;  
      return;
    }
    if ((errFlag == 0) && !toDateValue) {
      Swal.fire({
        icon: 'error',
        text: 'Enter To Date'
      });
      errFlag = 1;  
      return;
    }
    if ((errFlag == 0) && !remark) {
      Swal.fire({
        icon: 'error',
        text: 'Enter Remark'
      });
      errFlag = 1;
      return;
    }

    if (errFlag === 0) {
      const file = this.uploadedFiles;
      formData.append('profileId', this.manufactureInfo.USER_ID);
      formData.append('uploadedFiles', file);
      formData.append('fromDate', fromDateValue);
      formData.append('toDate', toDateValue);
      formData.append('remark', remark);
      formData.append('isReRegister', reRegisterSts);
      this.uploadForm(formData, 1);
    }
  }

  uploadForm(formData: any, fileNum: number) {
    this.loading = false;
    Swal.fire({
      title: 'Proceed to submit',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.fuService.uploadReapplyManufacture(formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.fileUploadSuccess();
              let upSts = event['body']['result']['flag'];
              let upMsg = event['body']['result']['msg'];
              // start after uploaded 
              if (upSts == 1) {
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  text: upMsg,
                }).then(() => {
                  this.getReapplyDetails();
                });
              }
              else {
                this.loading = false;
                Swal.fire({
                  icon: 'error',
                  text: upMsg
                });
              }
              // end after uploaded
            }
          },
            err => console.log(err)
          );
      }
    })
  }
  fileUploadSuccess() {
    let flag = true;
    this.percentUploaded.forEach(n => {
      if (n !== 100) {
        flag = false;
      }
    });
    if (flag) {
      this.isMultipleUploaded = true;
    }
  }

  formatAppliedDate(inputDate: string): string {
    const date = new Date(inputDate);

    const day = date.getDate();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;  // Convert to 12-hour format

    const dayWithSuffix = day + (day > 3 && day < 21 ? 'th' : ['st', 'nd', 'rd'][((day % 10) - 1)] || 'th');

    return `${dayWithSuffix} ${month} ${year} ${hours}:${minutes} ${ampm}`;
  }
  
}
