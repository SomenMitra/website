import { Component, OnInit } from '@angular/core';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, NG_ASYNC_VALIDATORS, Validators, FormArray } from '@angular/forms';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import Swal from 'sweetalert2';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { FileUploadService } from '../file-upload.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-scheme-document-apicol',
  templateUrl: './scheme-document-apicol.component.html',
  styleUrls: ['./scheme-document-apicol.component.css'],
  providers: [CitizenProfileService, ValidatorchklistService]
})
export class SchemeDocumentApicolComponent implements OnInit {
  documentForm = new UntypedFormGroup({});
  schemeId: any;
  respSts: any;
  respDynm: any;
  applctnSts: any;
  dynDocElem: any[] = [];
  empRadioValue: any[] = [];
  applicantId: any;
  applctnId: any;
  controlTypeArr: any = [];
  responseSts: any;
  responseDynm: any;
  responseInfo: any;
  resDocSts: any;
  resDocList: any;
  uploadForm: UntypedFormGroup;
  sMsg: string = '';
  fileAttributes: any[] = [];


  public loading = false;
  percentCompleted: number = 0;
  isMultipleUploaded = false;
  isSingleUploaded = false;
  urlAfterUpload = '';
  percentUploaded = [0];
  acceptedExtensions = 'jpg, jpeg, bmp, png, pdf, doc';

  appDraftSts = environment.constDrftSts;
  appPrevwSts = environment.constPrevwSts;

  myFiles: any[] = [];
  isDraft = false;

  schemeName = null;
  schemeType = null;
  apprRsmSts:any;
  intOnlineProfileId:any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private objSchmCtrl: CitizenSchemeService,
    private encDec: EncryptDecryptService,
    private vldChkLst: ValidatorchklistService,
    private objProf: CitizenProfileService,
    private Http: HttpClient,
    private formBuilder: UntypedFormBuilder, private fuService: FileUploadService) {
    this.uploadForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    let schmSesnInfo  = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    this.schemeName   = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType   = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.applctnId = schemeArr[1];
    this.apprRsmSts= (Number(schemeArr[2])>0)?schemeArr[2]:0;
    // get dynamic documents
    this.getDynmDocs();

  }

  // start get dynamic documents
  getDynmDocs() {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applctnId": this.applctnId
    };
    this.loading = true;
    this.objSchmCtrl.getSchmDocList(params).subscribe(res => {
      this.resDocSts = res.status;
      this.resDocList = res.result['docArr'];
      this.applctnSts = res.result['applctnSts'];
      this.intOnlineProfileId = res.result['intOnlineProfileId'];
      this.loading = false;
      let arr = {};
      let c = 0;
      for (let item of this.resDocList) {
        arr[item.intDocumentId] = ['', Validators.required];        
        arr['optntype'+item.intDocumentId] = ['', Validators.required];
        arr['optndata'+item.intDocumentId] = [item.optnDataVal, Validators.required];
        this.fileAttributes[item.intDocumentId] = item;
        c++
      }
      if (c == this.resDocList.length) {
        this.uploadForm = this.formBuilder.group(arr);
      }
    });
  } 

  getFileDetails(e,schmId,docId) {
    if(schmId==environment.sujogPortal){
      this.getSujogFileUpload(e,docId);
    }
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }
  getSujogFile(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  onFormSubmit() {
    let arr = this.resDocList; 
    const formData = new FormData();
    let fileNames = '';
    let hdnFile = '';
    let retVal = true;
    for (let i = 0; i < arr.length; i++) {
      let documentId = arr[i]['intDocumentId'];
      let fileName = 'file' + documentId;
      let allAttributes = this.fileAttributes[documentId];
      let optnType = allAttributes.optnType;
      let fileType = allAttributes.vchFileType;
      let fileMandatory = allAttributes.tinIsMandatory;
      let fileFileSize = allAttributes.smiFileSize;
      let fileSizeType = allAttributes.tinSizeType;
      let fileDocumentName = allAttributes.vchDocumentName;
      let fileDocumentFle  = allAttributes.vchDocumentFile;
      let selectedOptn:any = '';
      let sujogFileDetls='';
      if(optnType==2)
      {
        selectedOptn = (<HTMLInputElement>document.getElementById('optndata' + documentId)).value;
      }
      sujogFileDetls = (<HTMLInputElement>document.getElementById('hdnFileStoreId_' + documentId)).value;
      const selectedFileList = (<HTMLInputElement>document.getElementById(fileName));
      const extension = selectedFileList.value.split('.').pop();

      let file:any = selectedFileList.files.item(0);
      if(fileMandatory ==1 && optnType==2 && selectedOptn=='')
      {
        Swal.fire({
          icon: 'error',
          text: 'Select '+fileDocumentName
        });
        retVal = false;
      }
      else if(fileMandatory ==1 && !file && fileDocumentFle=='')
      {
        Swal.fire({
          icon: 'error',
          text: 'Upload '+fileDocumentName
        });
        retVal = false;
      }
      else {
        if(file) 
        {
          let uploadedFileType = file.type;
          let uploadedFileSize = file.size;
          
          let UploadFileConvesion=Math.round((uploadedFileSize / 1024));
          let acceptableTypes = fileType.split(',');
          const accepteableLowercase = acceptableTypes.map(acceptableTypes => acceptableTypes.toLowerCase());
          if(accepteableLowercase.includes(extension.toLowerCase()) == false)
          {
            Swal.fire({
              icon: 'error',
              text: 'Upload only '+fileType+' files for '+fileDocumentName
            });

            retVal = false;
          }

          else if(UploadFileConvesion > fileFileSize*1024){
            Swal.fire({
              icon: 'error',
              text: fileDocumentName+' should be < '+ fileFileSize+'MB'
            });

            retVal = false;
          }
        }
        else{
          hdnFile = (<HTMLInputElement>document.getElementById('hdnDoc_'+documentId)).value;
        }
        file = (file)?file:'';
        
        formData.append(fileName + '_attributes', JSON.stringify(allAttributes));
        formData.append(fileName, file);
        formData.append(fileName + '_hdn', hdnFile);
        formData.append(fileName+'_optn', selectedOptn);
        formData.append(fileName+'_hdnFileStoreId', sujogFileDetls);
        fileNames += fileName + ",";
      }
      if(retVal == false)
      {
        break;
      }
      
    }
    
    if(retVal==true)
    {
      fileNames = fileNames.replace(/,\s*$/, "");
      formData.append("fileNames", fileNames);
      formData.append("schemeId", this.schemeId);
      formData.append("profileId", this.applicantId);
      formData.append("applctnId", this.applctnId);
      formData.append("draftSts", String(this.isDraft));
      this.uploadFile(formData, 1);
    }   
  }

  onSaveAsDraftClick(){
    this.isDraft = true;
  }

  onSaveNextClick(){
    this.isDraft = false;
  }

  uploadFile(formData: any, fileNum: number) {
    this.loading = true;
    this.fuService.uploadWithProgress(formData)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.percentUploaded[fileNum] = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileUploadSuccess();
          let upSts = event['body']['status'];
          let upMsg = event['body']['msg'];
           // start after uploaded
          if(upSts==1)
          {
            this.loading = false;
            if(this.isDraft)
            {
              Swal.fire({
                icon: 'success',
                text: upMsg
              });
              let encAppCtnId = this.encDec.encText((this.schemeId+':'+this.applctnId).toString());
              this.router.navigate(['/citizen-portal/scheme-document-apicol',encAppCtnId]);
            }
            else{
              let encAppCtnId = this.encDec.encText((this.schemeId+':'+this.applctnId+':1').toString());
              this.router.navigate(['/citizen-portal/scheme-preview-apicol',encAppCtnId]);
            }
          }
          else{
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

  goToBack()
  {
    let docSecAvl   = 1;// doc section available
    let encAppCtnId = this.encDec.encText((this.schemeId+':'+this.applctnId+':'+docSecAvl).toString());
    this.router.navigate(['/citizen-portal/scheme-apply-apicol',encAppCtnId]);
  }

  // go to that tab section
  goToSectn(sectnType:any)
  {
    let sectnUrl    = '/citizen-portal/scheme-list';
    let sectnEncStr = this.route.snapshot.paramMap.get('id');
    switch (sectnType) {
      case "1":
        sectnUrl = '/citizen-portal/profile-update';
        break;
      case "2":
        sectnUrl = '/citizen-portal/scheme-apply-apicol';
          break;
      case "3":
        sectnUrl = '/citizen-portal/scheme-document-apicol';
        break;
    }
    this.router.navigate([sectnUrl,sectnEncStr]);
  }
  getSujogFileUpload(event,docId) {
    let docName=(document.getElementById('optndata'+docId) as HTMLTextAreaElement).value;
    if(event.target.files.length > 0) 
    {
      let fileName=event.target.files[0];

      const formData = new FormData();
      formData.append('sujogFile', fileName);
      formData.append('sujogDocFile', docName);
      this.Http.post(environment.serviceURL+'getSujogFileUpload', formData).subscribe(response => {
        console.log(response['result']);
        if (response['status'] == 1) {
                (document.getElementById('hdnFileStoreId_'+docId)as HTMLTextAreaElement).value=JSON.stringify(response['result']);
              }
      });          
    }     

   }

}
