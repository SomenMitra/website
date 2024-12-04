import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { CitizenSchemeActivityService } from '../../service-api/citizen-scheme-activity.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormArray } from '@angular/forms';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';

@Component({
  selector: 'app-scheme-query-reply',
  templateUrl: './scheme-query-reply.component.html',
  styleUrls: ['./scheme-query-reply.component.css']
})
export class SchemeQueryReplyComponent implements OnInit {

  schemeName = null;
  schemeType = null;

  loading = false;
  schemeStr:any;
  schemeId:any;
  applicantId:any;
  applctnId:any;
  authMsg:any;
  authActnOn:any;

  submitted = false;
  queryReplyForm: UntypedFormGroup;
  queryDocs: UntypedFormArray;
  fileType='pdf';
  fileFileSize = 1;

  constructor(private router: Router,private route:ActivatedRoute,private encDec:EncryptDecryptService,private objSchmActv:CitizenSchemeActivityService,private rplyFm: UntypedFormBuilder,public vldChkLst:ValidatorchklistService) { }

  ngOnInit(): void {
    let schmSesnInfo  = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    this.schemeName   = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType   = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId  = this.route.snapshot.paramMap.get('id');
    this.schemeStr   = this.encDec.decText(encSchemeId);
    let schemeArr    = this.schemeStr.split(':');
    this.schemeId    = schemeArr[0];
    this.applctnId   = schemeArr[1];
    this.getQueryDtls();
    let scmDmgFrmObj: any = {};
    scmDmgFrmObj["txtMessage"] = new UntypedFormControl('');
    let qryArrObj = this.rplyFm.array([this.createItem(0)]);
    if(qryArrObj)
    {
        scmDmgFrmObj["queryDocs"]  = qryArrObj;
        this.queryReplyForm = this.rplyFm.group(scmDmgFrmObj);
        this.queryDocs = this.queryReplyForm.get('queryDocs') as UntypedFormArray;
    }
  }

  // start add/ remove more
  createItem(index:any) {
    return this.rplyFm.group(index,{
      'docSlno': [],
      'docName': [],
      'docFile': [],
    });
  }

  addRow(index:any){
    this.queryDocs = this.queryReplyForm.get('queryDocs') as UntypedFormArray;
    this.queryDocs.push(this.createItem(index));
  }
  removeRow(index:any) {
    if(index>0)
    {
      (<UntypedFormArray>this.queryReplyForm.get('queryDocs')).removeAt(index);
    }
    else{
      Swal.fire({
        icon: 'error',
        text: '1st row we cant remove it'
      });
    }
  }
  // end add/ remove more

  // get scheme query details
  getQueryDtls(){
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applctnId": this.applctnId
    };
    this.loading = true;
    this.objSchmActv.getSchmQueryDtls(params).subscribe(res=>{
      if(res.status>0)
      {
        this.loading = false;
        let qryArr = res.result['qryInfoArr'];
        if(Object.keys(qryArr).length>0)
        {
	        this.authMsg    = (qryArr.authMsg!='')?qryArr.authMsg:'--';
          this.authActnOn = qryArr.authActnOn;
        }
      }
    },
    error => {
      Swal.fire({
        icon: 'error',
        text: environment.errorMsg
      });
      this.loading = false;
    });

  }

  goToBack() {
    let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
    this.router.navigate(['/citizen-portal/apicol/scheme-applied', encAppCtnId]);
  }

  onSubmit() {
    this.submitted = true;
    if (this.queryReplyForm.invalid) {
      return;
    }
    else{
      this.submitReply();
    }
  }

  submitReply() {
    const formData = new FormData();
    let rplMsg = this.queryReplyForm.controls['txtMessage'].value;
    let vSts   = true;
    if(!this.vldChkLst.blankCheck(rplMsg,"Reply Message"))
    {
      vSts = false;
    }
    let fileNames = '';

      for (let i = 0; i < this.queryDocs.length; i++) {

        let fileName = 'docFile' + i;
        const selectedFileList = (<HTMLInputElement>document.getElementById(fileName));
        const extension = selectedFileList.value.split('.').pop();
        let docNm = (<HTMLInputElement>document.getElementById('docName'+i)).value;

        let file:any = selectedFileList.files.item(0);
        if(file)
        {
          let uploadedFileSize = file.size;
          let UploadFileConvesion=Math.round((uploadedFileSize / 1024));
          let acceptableTypes = this.fileType.split(',');
          const accepteableLowercase = acceptableTypes.map(acceptableTypes => acceptableTypes.toLowerCase());
          if(accepteableLowercase.includes(extension.toLowerCase()) == false)
          {
            Swal.fire({
              icon: 'error',
              text: 'Upload only '+this.fileType+' files'
            });
            vSts = false;
          }
          else if(UploadFileConvesion > this.fileFileSize*1024){
            Swal.fire({
              icon: 'error',
              text: 'Upload document should be < '+ this.fileFileSize+' MB'
            });
            vSts = false;
          }
          file = (file)?file:'';
          formData.append(fileName, file);
          formData.append(fileName + '_txt', docNm);
          fileNames += fileName + ",";
        }
        if(vSts == false)
        {
          break;
        }
      }

    if(vSts)
    {
      formData.append('fileName', fileNames);
      formData.append('replyMsg' , rplMsg);
      formData.append('applctnId' , this.applctnId);
      formData.append('schemeId' , this.schemeId );
      formData.append('profId' , this.applicantId );
      this.updateData(formData);
    }
  }

  // to update data in server
  updateData(formDataObj:FormData) {
    this.loading = true;
    this.objSchmActv.doQryReply(formDataObj).subscribe(res => {
          let upSts = res.status;
          let upMsg = res.msg;
           // start after uploaded
          if(upSts==1)
          {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              text: upMsg
            }).then((result) => {
              if (result.isConfirmed) {
                let encUrlDt = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
                this.router.navigate(['/citizen-portal/apicol/scheme-applied', encUrlDt]);
              }
            })
          }
          else{
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: upMsg
            });
          }
          // end after uploaded
        });
  }

}
