import { Component, OnInit, ElementRef, ViewChild,Input } from '@angular/core';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import { RedirectService } from '../../redirect.service';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitizenSchemeActivityService } from '../service-api/citizen-scheme-activity.service';
import { ApiService } from '../seed-dbt-apply/api.service';
import Swal from 'sweetalert2';
import { PmksyService } from '../../manufacture-portal/service-api/pmksy.service';
import { FileUploadService } from '../file-upload.service';
import { HttpResponse, HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-manufacture-apply',
  templateUrl: './manufacture-apply.component.html',
  styleUrls: ['./manufacture-apply.component.css']
})
export class ManufactureApplyComponent {
  presentationDetails: any;
  factoryVisitDate: any;
  proceedingLetter: any;
  surveyReport: any;
  docPath: any;
  constructor(private router: Router, private route: ActivatedRoute, private objSchm: ManufactureSchemeService, private encDec: EncryptDecryptService,
    private modalService: NgbModal, private objSchmActv: CitizenSchemeActivityService, private objRedirect: RedirectService, private objSeedService: ApiService, private objPMKSY: PmksyService, private fuService: FileUploadService,) { }
  respSts: any;
  respList: any;
  applicantId: any;
  schemeId: any;
  applctnId: any;
  public loading = false;
  resDocSts: any;
  resDocList: any;
  respsubsidy: any;
  appQrySts = environment.constQrySts;
  appRsmSts = environment.constRsmSts;
  sujogProcessId = environment.sujogPortal;
  rsmInfo: any[];
  public isRsmFlg: boolean = false;
  schemeStr;
  redirectList: any[] = [];
  redirectKeyList = '';
  mobileNo = '';
  redirectURL = '';
  refNo = '';
  refText = 'Reference No.';
  seedDBTPaddytotalQuantity: number;
  seedDBTNonPaddytotalQuantity: number;
  seedDBTTotQuantityValidation: number;
  seedDBTProcessId: number;
  respListlen: number;
  maxNoOfSeedDBT = environment.maxNoOfTimeSeedDbtToBeApplied;
  noOfTimeSeedApplied: number;
  @ViewChild('rsmModal') rsmModalRef: ElementRef;
  AuthUpdateSts: number;
  editPhaseActivity: any;
  appId: any;
  profileId: any;
  landareaid: any;
  extensionType = environment.extensionType;
  @ViewChild('someModal') someModalRef: ElementRef;
  referenceNo: any;
  uploadedFiles: File;
  submitted = false;
  manufactureDocument = new UntypedFormGroup({});
  //PPT UPLOAD
  @ViewChild('exampleModal') exampleModal: ElementRef;
  acceptedExtensions = 'ppt,pptx';
  fileType = 'ppt,pptx';
  percentUploaded = [0];
  isMultipleUploaded = false;
  intOnlineServiceId: any;
  intProcessId: any;
  //PPT UPLOAD
  ngOnInit(): void {

    let params = this.route.snapshot.paramMap.get('id');
    let param = this.encDec.decText(params);
    let paramArr = param.split(':');
    this.profileId = paramArr[0];
    this.referenceNo = paramArr[1];
    this.mobileNo = paramArr[2];

    let manufactureParam = {
      "profileId": this.profileId,
      "referenceNo":this.referenceNo
    };

    this.getManufactureStatus(manufactureParam);
  }
  getManufactureStatus(params: any) {
    this.loading = true;
    this.objSchm.getManufactureStatus(params).subscribe(res => {
      //console.log(res.result);
      this.respSts = res.status;
      if (this.respSts == 1) {
        this.loading = false;
        this.respList = res.result;
        this.intOnlineServiceId=this.respList[0]['intOnlineServiceId'];
        this.intProcessId =this.respList[0]['intProcessId'];
        this.presentationDetails = this.respList[0].presentationDetails;
        this.factoryVisitDate = this.respList[0].factoryVisitDate;
        this.proceedingLetter = this.respList[0].proceedingLetter;
        this.surveyReport = this.respList[0].surveyReport;
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
  getKey(obj: { [key: string]: string }): string {
    return Object.keys(obj)[0]; // Returns the first key in the object
  }
  getDocPath(obj: { [key: string]: string }): string {
    const fileName = obj[this.getKey(obj)];
    return `${this.docPath}${fileName}`;
  }

  doSchemeApply(schemeStr: any, schemeName: any, schmServTypeId: any, schmServTypeNm: any) {
    this.setSchmServSesNm(schemeName, schmServTypeId, schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/profile-update', encSchemeStr]);
  }
  goBack() {
    window.history.back();
  }
  doSchemePreview(schemeStr: any) {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/manufacture-preview', encSchemeStr]);
  }

  doUploadPaymentReceipt(schemeStr: any) {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/upload-payment-receipt', encSchemeStr]);
  }

  updateScheme(schemeStru: any) {
    const schemeIds = schemeStru.split(":");
    let schemeId = schemeIds[0];
    let encSchemeStr = this.encDec.encText(schemeStru.toString());
    // if(schemeId==44){
    //   this.router.navigate(['/citizen-portal/apicol/updateSchemestatus',encSchemeStr]);
    // }
    // else{
    this.router.navigate(['/manufacture-portal/updateSchemestatus', encSchemeStr]);
    // }
  }


  doSchemeSeedDBTApply(schemeName: any, schmServTypeId: any, schmServTypeNm: any, schemeStr: any) {
    this.setSchmServSesNm(schemeName, schmServTypeId, schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/seed-apply', encSchemeStr]);
  }

  // mthod to set scheme session details
  setSchmServSesNm(schemeName: any, schmServTypeId: any, schmServTypeNm: any) {
    let schmSesnArr = {};
    schmSesnArr["FFS_APPLY_SCHEME_NAME"] = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"] = schmServTypeNm;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schmServTypeId;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
  }

  doQueryReply(schemeStr: any, schemeName: any, schmServTypeId: any, schmServTypeNm: any) {
    this.setSchmServSesNm(schemeName, schmServTypeId, schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-query-reply', encSchemeStr]);
  }

  doReply(schemeId: any, applicationId: any) {
    let arrayRedUrl: any = [];
    let apiParam = {
      "schemeId": schemeId,
      "applicationId": applicationId
    }
    this.objSchm.getRedirectQueryAPI(apiParam).subscribe(res => {
      if (res.status == 1) {
        this.redirectList = res.result.redirectInfo;
        this.redirectKeyList = res.result.redirectInfo.apiKeyDtls;
        this.redirectURL = res.result.redirectInfo.redirectURL;
        this.mobileNo = res.result.redirectInfo.mobileNo;

        let redirectArr = this.redirectKeyList;
        let value = '';
        let replaceArr = { "appId": applicationId, "[frmmob]": this.mobileNo };
        for (let i = 0; i < redirectArr.length; i++) {
          let key = redirectArr[i]['key'];
          let keyValue = redirectArr[i]['value'];

          let fieldValue = replaceArr[keyValue];
          if (typeof (fieldValue) != 'undefined' && fieldValue != '') {
            arrayRedUrl.push({ [key]: fieldValue });
          }
        }
        arrayRedUrl = arrayRedUrl.reduce(((r, c) => Object.assign(r, c)), {});
        let finalRedirectArrs = [];
        finalRedirectArrs.push(arrayRedUrl);

        this.objRedirect.post(finalRedirectArrs, this.redirectURL);
      }
    });
  }

  doIntegrationPreview(schemeId: any, applicationId: any) {
    let arrayRedUrl: any = [];
    let apiParam = {
      "schemeId": schemeId,
      "applicationId": applicationId
    }
    this.objSchm.getRedirectQueryAPI(apiParam).subscribe(res => {

      if (res.status == 1) {
        this.redirectList = res.result.redirectInfo;
        this.redirectKeyList = res.result.redirectInfo.apiStatusKeyDtls;
        this.redirectURL = res.result.redirectInfo.statusURL;
        this.mobileNo = res.result.redirectInfo.mobileNo;
        let applicantName = res.result.redirectInfo.applicantName;
        let email = res.result.redirectInfo.email;
        this.refNo = res.result.redirectInfo.integrationReferenceNo;
        let intChkStsURLType = res.result.redirectInfo.intChkStsURLType;
        let redirectArr = this.redirectKeyList;
        let value = '';
        let arrayOfUrl = [];
        let strVal = '';
        if (intChkStsURLType == 2) {
          let replaceArr = { "appId": applicationId, "[frmmob]": this.mobileNo, "[refNo]": this.refNo, "[frmname]": applicantName, "[frmmail]": email };
          for (let i = 0; i < redirectArr.length; i++) {
            let key = redirectArr[i]['key'];
            let keyValue = redirectArr[i]['value'];
            arrayRedUrl.push({ [key]: keyValue });

            let fieldValue = replaceArr[keyValue];
            if (typeof (fieldValue) != 'undefined' && fieldValue != '') {
              arrayRedUrl.push({ [key]: fieldValue });
            }
          }
          arrayRedUrl = arrayRedUrl.reduce(((r, c) => Object.assign(r, c)), {});
          let finalRedirectArrs = [];
          finalRedirectArrs.push(arrayRedUrl);

          this.objRedirect.post(finalRedirectArrs, this.redirectURL);
        } else if (intChkStsURLType == 1) {
          let replaceArr = { "appId": applicationId, "[frmmob]": this.mobileNo, "[refNo]": this.refNo };
          let str = '';

          for (let i = 0; i < redirectArr.length; i++) {
            let key = redirectArr[i]['key'];
            let keyValue = redirectArr[i]['value'];

            let fieldValue = replaceArr[keyValue];
            if (typeof (fieldValue) != 'undefined' && fieldValue != '') {
              str += key + "=" + fieldValue + ",";
            }
          }
          let lastChar = str.charAt(str.length - 1);
          if (lastChar == ',') {
            strVal = str.slice(0, -1);
          }
          window.location.href = this.redirectURL + strVal;
        }

      }
    });
  }


  funExtensionChange() {
    let selExtensionType = (document.getElementById('selExtensionType') as HTMLTextAreaElement).value;
    if (selExtensionType == '4') {
      $('.clsReason').removeClass("d-none")
    } else {
      $('.clsReason').addClass("d-none")
    }
  }
  viewActivities(schemeStr: any) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/AllActivities', encSchemeStr]);
  }

  getRsmHist(applctnId: any) {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.profileId,
      "applctnId": applctnId
    };
    this.loading = true;
    this.objSchmActv.schemeRsmHist(params).subscribe(res => {
      if (res.status == 1) {
        this.rsmInfo = JSON.parse(JSON.stringify(res.result['rsmInfoArr']));
        this.isRsmFlg = true;
      } else {
        this.isRsmFlg = false;
        this.rsmInfo = [];
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
      }
      this.loading = false;
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });

    this.open(this.rsmModalRef);
  }
  open(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateBOQ(schemeStr) {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/update-boq', encSchemeStr]);

  }
  updateExtension(schemeStr) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.schemeStr = this.encDec.decText(encSchemeStr);
    let schemeArr = this.schemeStr.split(':');
    //this.loading = false;
    let msgValue = "Are you sure to extension for 7 days?";
    this.loading = true;
    Swal.fire({
      icon: 'error',
      html: msgValue,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.open(this.someModalRef);
      } else {
        let apiParam = {
          "applicationId": schemeArr[1],
          "MIid": this.applicantId
        }
        this.objPMKSY.submitManufactureNoExtension(apiParam).subscribe(res => {
          //console.log(res.resultInfo.upSts);
          if (res.result.resultInfo.upSts == 200) {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              text: "Extension Updated Successfully"
            }).then(() => {
              this.router.navigate(['/manufacture-portal/mi-dashboard']);
            });
          } else {
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: "Something Went Wrong"
            });
          }
        });
      }
    });
  }
  submitExtension() {
    const formData = new FormData();
    let txtExtensionRemarks = (document.getElementById('txtExtensionRemarks') as HTMLTextAreaElement).value;
    let selExtensionType = (document.getElementById('selExtensionType') as HTMLTextAreaElement).value;
    let txtExtensionReason = (document.getElementById('txtExtensionReason') as HTMLTextAreaElement).value;
    let selectedintmnFileList = (<HTMLInputElement>document.getElementById('docExtension'));
    let intmnFile: any = selectedintmnFileList.files.item(0);
    const intmnExtension = selectedintmnFileList.value.split('.').pop();
    if (selExtensionType == '') {
      Swal.fire({
        icon: 'error',
        text: 'Select type of extension'
      });
      return false;
    }
    if (selExtensionType == '4') {
      if (txtExtensionReason == '') {
        Swal.fire({
          icon: 'error',
          text: 'Enter extension reason'
        });
        return false;
      }
    }
    if (txtExtensionRemarks == '') {
      Swal.fire({
        icon: 'error',
        text: 'Enter Remarks'
      });
      return false;
    }
    if (intmnFile) {
      let intmnFileType = 'jpeg,jpg,gif,pdf';
      let intmnFileSize = 10;
      let uploadedIntmnFileSize = intmnFile.size;
      let UploadIntmnFileConvesion = Math.round((uploadedIntmnFileSize / 1024));
      let acceptableIntmnTypes = intmnFileType.split(',');
      const accepteableIntmnLowercase = acceptableIntmnTypes.map(acceptableIntmnTypes => acceptableIntmnTypes.toLowerCase());
      if (accepteableIntmnLowercase.includes(intmnExtension.toLowerCase()) == false) {
        Swal.fire({
          icon: 'error',
          text: 'Upload only ' + intmnFileType + ' files '
        });
        return false;
      }

      else if (UploadIntmnFileConvesion > intmnFileSize * 1024) {
        Swal.fire({
          icon: 'error',
          text: 'Upload document should be < ' + intmnFileSize + ' MB'
        });
        return false;
      }
      else {
        intmnFile = (intmnFile) ? intmnFile : '';
        formData.append('extensionFile', intmnFile);
      }
    }
    formData.append('selExtensionType', selExtensionType);
    formData.append('txtExtensionRemarks', txtExtensionRemarks);
    formData.append('profId', this.profileId);
    formData.append('applicationId', this.appId);
    formData.append('txtExtensionReason', txtExtensionReason);

    this.objPMKSY.submitManufactureExtension(formData).subscribe(res => {
      if (res.status == 1) {
        if (res.result.resultInfo.upSts == 200) {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            text: "Extension Updated Successfully"
          }).then(() => {
            window.location.reload();
          });
        } else {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            text: "Something Went Wrong"
          });
        }
      }
    });
  }

  downloadPPTFormat(fileUrl) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'MI.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.uploadedFiles = input.files[0];
    } else {
      this.uploadedFiles = null; // Clear the file if no file is selected
    }
  }

  previewFile(file: File, event: Event): void {
    event.preventDefault();  // Prevent form submission
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  }
  submitDocument(): void {
    this.submitted = true;
    const formData = new FormData();
    const fileInputs = document.querySelectorAll('.uploadFile') as NodeListOf<HTMLInputElement>;
    let fileNames = '';
    let fileArr = [];
      const fileInput = fileInputs[0];
      const files = fileInput.files;
      const file = files[0];

      if (!file) {
        Swal.fire({
          icon: 'error',
          text: 'Upload Presentation'
        });
        return;
      }

      if (file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const maxSizeInMB = 3;
        const fileSizeInMB = file.size / (1024 * 1024);
        const acceptableTypes = this.fileType.split(',').map(type => type.toLowerCase());

        if (!acceptableTypes.includes(extension)) {
          this.manufactureDocument.reset(); 
          Swal.fire({
            icon: 'error',
            text: 'Upload only ' + this.fileType + ' files for Presentation'
          });
          return;
        }

        if (fileSizeInMB > maxSizeInMB) {
          Swal.fire({
            icon: 'error',
            text:'Presentation should be < ' + maxSizeInMB + 'MB'
          });
          return;
        }

        fileArr.push({ id: 'file' , name: 'Presenation' });
        formData.append('file', file);
    }
    formData.append('intOnlineServiceId', this.intOnlineServiceId);
    formData.append('intProcessId', this.intProcessId);
    formData.append('profileId', this.profileId);
    formData.append('profileId', this.profileId);
    formData.append('referenceNo', this.referenceNo);
    formData.append('mobileNo', this.mobileNo);
    formData.append('pptFiles', JSON.stringify(fileArr));
    fileNames += 'pptFiles,';
    fileNames = fileNames.replace(/,\s*$/, '');
    formData.append('fileNames', fileNames);
    this.uploadFile(formData, 1);
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  hideModal() {
    const modalElement = this.exampleModal.nativeElement;
    modalElement.classList.remove('show');
    modalElement.setAttribute('aria-hidden', 'true');
    modalElement.removeAttribute('aria-modal');
    modalElement.style.display = 'none';
    document.body.classList.remove('modal-open');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.parentNode.removeChild(modalBackdrop);
    }
  }
  uploadFile(formData: any, fileNum: number) {

    Swal.fire({
      title: 'Proceed to submit',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.fuService.uploadPresentationOfManufacture(formData)
          .subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.fileUploadSuccess();
              let upSts = event['body']['result']['flag'];
              let upMsg = event['body']['result']['msg'];
              // start after uploaded
              if (upSts == 1) {
                let params = this.encDec.encText((this.profileId + ':' + this.referenceNo + ':' + this.mobileNo).toString());
                this.loading = false;
                Swal.fire({
                  icon: 'success',
                  text: upMsg,
                }).then(() => {
                  this.hideModal();
                  let manufactureParam = {
                    "profileId": this.profileId,
                    "referenceNo": this.referenceNo
                  };
                  this.getManufactureStatus(manufactureParam);
                  this.router.navigate(['/manufacture-portal/manufacture-applied/' + params]);
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
  showModal() {
    const modalElement = this.exampleModal.nativeElement;
    modalElement.classList.add('show');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.removeAttribute('aria-hidden');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
    this.resetForm();
  }
  resetForm() {
    this.manufactureDocument.reset();
    const fileInput = this.exampleModal.nativeElement.querySelector('#file');
    if (fileInput) {
      fileInput.value = '';
    }
  }

  redirectToDocumentPage(profileId, referenceNo, mobileNo,edit,onlineServiceId,processId,type) {
    let params = this.encDec.encText((profileId + ':' + referenceNo + ':' + mobileNo + ':' + edit + ':' + onlineServiceId + ':' + processId + ':' + type).toString());
    this.router.navigate(['/manufacture-portal/manufacture-doc-upload/' + params])
  }

  getFormattedDate(dateString: string): string {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const [day, month, year] = dateString.split('/');
      return `${day}-${months[parseInt(month) - 1]}-${year}`;
  }
  
  // Method to format date and time from '19/08/2024 12:00 PM' to '19-Aug-2024 12:00 PM'
  formatDateTimeString(dateTimeString: string): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [datePart, timePart, ampmPart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('/');
    const formattedDate = `${day}-${months[parseInt(month) - 1]}-${year}`;
    const formattedTime = `${timePart.slice(0, 2)}${timePart.slice(2)} ${ampmPart}`;
    return `${formattedDate} ${formattedTime}`;
  }
}