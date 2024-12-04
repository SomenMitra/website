import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { RedirectService } from '../../../redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitizenSchemeActivityService } from '../../service-api/citizen-scheme-activity.service';
import { ApiService } from '../../seed-dbt-apply/api.service';
import Swal from 'sweetalert2';
import { ApicolService } from '../../apicol/service-api/apicol.service';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_ASYNC_VALIDATORS, Validators, UntypedFormArray } from '@angular/forms';
@Component({
  selector: 'app-applied-scheme-details',
  templateUrl: './applied-scheme-details.component.html',
  styleUrls: ['./applied-scheme-details.component.css']
})
export class AppliedSchemeDetailsComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute, private objSchm:CitizenSchemeService,private encDec: EncryptDecryptService,
    private modalService: NgbModal,private objSchmActv:CitizenSchemeActivityService,private objRedirect: RedirectService,private objSeedService:ApiService, private apicolScheme:ApicolService) { }
  respSts:any;
  appCancelForm = new UntypedFormGroup({});
  respList:any;
  applicantId:any;
  schemeId:any;
  applctnId: any;
  public loading = false;
  cancelSubmitted = false;
  resDocSts: any;
  resDocList: any;
  respsubsidy:any;
  appQrySts=environment.constQrySts;
  appRsmSts=environment.constRsmSts;
  sujogProcessId=environment.sujogPortal;
  Env = environment;
  rsmInfo: any[];
  public isRsmFlg:boolean=false;
  schemeStr;
  redirectList: any[] = [];
  redirectKeyList='';
  mobileNo='';
  redirectURL='';
  refNo='';
  refText='Reference No.';
  seedDBTPaddytotalQuantity:number;
  seedDBTNonPaddytotalQuantity:number;
  seedDBTTotQuantityValidation:number;
  seedDBTProcessId:number;
  respListlen:number;
  maxNoOfSeedDBT = environment.maxNoOfTimeSeedDbtToBeApplied;
  noOfTimeSeedApplied:number;
  @ViewChild('rsmModal') rsmModalRef: ElementRef;
  @ViewChild('someModal') someModalRef: ElementRef;
  AuthUpdateSts:number;
  editPhaseActivity:any;

  ngOnInit(): void {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId  = this.route.snapshot.paramMap.get('id');
    this.seedDBTTotQuantityValidation = Number(environment.seedDBTTOTHECTValdn);
    this.schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = this.schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.seedDBTProcessId = environment.seedDBT;


    this.getSeedDBTReapplyStatus();


    let params = {
      "schemeId":this.schemeId,
      "profId":this.applicantId,
      "applctnId":0
    };
    this.getAppldSchmLst(params);

    this.appCancelForm = new UntypedFormGroup({
      'vchCancelRemark': new UntypedFormControl('',
        [
          Validators.required,
        ]
      )
    });

  }
  getAppldSchmLst(params:any)
  {
    this.apicolScheme.getAppldSchmLst(params).subscribe(res=>{
      this.respSts  = res.status;
      this.respList = res.result;
      this.AuthUpdateSts = res.result[0].subsidyList[0].AuthUpdateSts;
      if(res.status.directorate=='Mo Bidyut'){
        this.refText='UPAN No.'
      }
    });
  }
  getSeedDBTReapplyStatus(){
    let params = {
      "profileId": this.applicantId,
    };
    this.objSeedService.getSeedDBTReapplyStatus(params).subscribe(res => {

     if(res.result.flag == 200)
     {

      this.seedDBTPaddytotalQuantity = res.result.noOfTimePaddyApplied;
      this.seedDBTNonPaddytotalQuantity = res.result.noOfTimeNonPaddyApplied;
      this.noOfTimeSeedApplied  = res.result.noOfTimeApplied;

     }

    });
    }
  doSchemeApply(schemeStr : any,schemeName:any, schmServTypeId:any,schmServTypeNm:any)
  {
    this.setSchmServSesNm(schemeName,schmServTypeId,schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/apicol/profile-update',encSchemeStr]);
  }
  goBack() {
    window.history.back();
  }
  doSchemePreview(schemeStr : any)
  {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/apicol/scheme-preview',encSchemeStr]);
  }

  doUploadPaymentReceipt(schemeStr : any)
  {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/apicol/upload-payment-receipt',encSchemeStr]);
  }

  updateScheme(schemeStru : any)
  {
    console.log(schemeStru);
    const schemeIds = schemeStru.split(":");
    let schemeId=schemeIds[0];
    let encSchemeStr = this.encDec.encText(schemeStru.toString());
    if(schemeId==44){
      this.router.navigate(['/citizen-portal/apicol/updateSchemestatus',encSchemeStr]);
    }
    else{
      this.router.navigate(['/citizen-portal/apicol/updateSchemestatus',encSchemeStr]);
    }
  }


  doSchemeSeedDBTApply(schemeName:any, schmServTypeId:any,schmServTypeNm:any,schemeStr : any)
  {  this.setSchmServSesNm(schemeName,schmServTypeId,schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/seed-apply', encSchemeStr]);
  }

  // mthod to set scheme session details
  setSchmServSesNm(schemeName:any, schmServTypeId:any,schmServTypeNm:any)
  {
    let schmSesnArr = {};
    schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = schmServTypeNm;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schmServTypeId;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
  }

  doQueryReply(schemeStr : any,schemeName:any, schmServTypeId:any,schmServTypeNm:any)
  {
    this.setSchmServSesNm(schemeName,schmServTypeId,schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/apicol/scheme-query-reply',encSchemeStr]);
  }

  doReply(schemeId : any,applicationId : any){
    let arrayRedUrl:any = [];
    let apiParam = {
      "schemeId":schemeId,
      "applicationId":applicationId
    }
    this.objSchm.getRedirectQueryAPI(apiParam).subscribe(res => {
      if (res.status == 1) {
        this.redirectList = res.result.redirectInfo;
        this.redirectKeyList = res.result.redirectInfo.apiKeyDtls;
        this.redirectURL   = res.result.redirectInfo.redirectURL;
        this.mobileNo   = res.result.redirectInfo.mobileNo;

        let redirectArr=this.redirectKeyList;
        let value='';
        let replaceArr={"appId":applicationId,"[frmmob]":this.mobileNo};
          for(let i = 0; i < redirectArr.length; i++){
            let key=redirectArr[i]['key'];
            let keyValue=redirectArr[i]['value'];

            let fieldValue = replaceArr[keyValue];
            if(typeof(fieldValue)!='undefined' && fieldValue!='')
            {
              arrayRedUrl.push({[key]:fieldValue});
            }
          }
          arrayRedUrl = arrayRedUrl.reduce(((r, c) => Object.assign(r, c)), {});
          let finalRedirectArrs = [];
          finalRedirectArrs.push(arrayRedUrl);

        this.objRedirect.post(finalRedirectArrs,this.redirectURL);
      }
    });
  }

  doIntegrationPreview(schemeId : any,applicationId : any){
    let arrayRedUrl:any = [];
    let apiParam = {
      "schemeId":schemeId,
      "applicationId":applicationId
    }
    this.objSchm.getRedirectQueryAPI(apiParam).subscribe(res => {

      if (res.status == 1) {
        this.redirectList = res.result.redirectInfo;
        this.redirectKeyList = res.result.redirectInfo.apiStatusKeyDtls;
        this.redirectURL   = res.result.redirectInfo.statusURL;
        this.mobileNo   = res.result.redirectInfo.mobileNo;
        let applicantName   = res.result.redirectInfo.applicantName;
        let email   = res.result.redirectInfo.email;
        this.refNo   = res.result.redirectInfo.integrationReferenceNo;
        let intChkStsURLType   = res.result.redirectInfo.intChkStsURLType;
        let redirectArr=this.redirectKeyList;
        let value='';
        let arrayOfUrl = [];
        let strVal ='';
        if(intChkStsURLType==2){
          let replaceArr={"appId":applicationId,"[frmmob]":this.mobileNo,"[refNo]":this.refNo,"[frmname]":applicantName,"[frmmail]":email};
          for(let i = 0; i < redirectArr.length; i++){
            let key=redirectArr[i]['key'];
            let keyValue=redirectArr[i]['value'];
            arrayRedUrl.push({[key]:keyValue});

            let fieldValue = replaceArr[keyValue];
            if(typeof(fieldValue)!='undefined' && fieldValue!='')
            {
              arrayRedUrl.push({[key]:fieldValue});
            }
          }
          arrayRedUrl = arrayRedUrl.reduce(((r, c) => Object.assign(r, c)), {});
          let finalRedirectArrs = [];
          finalRedirectArrs.push(arrayRedUrl);

          this.objRedirect.post(finalRedirectArrs,this.redirectURL);
        }else if(intChkStsURLType==1){
          let replaceArr={"appId":applicationId,"[frmmob]":this.mobileNo,"[refNo]":this.refNo};
          let str ='';

          for(let i = 0; i < redirectArr.length; i++){
            let key=redirectArr[i]['key'];
            let keyValue=redirectArr[i]['value'];

            let fieldValue = replaceArr[keyValue];
            if(typeof(fieldValue)!='undefined' && fieldValue!='')
            {
              str += key+"=" +fieldValue + ",";
            }
          }
          let lastChar = str.charAt(str.length - 1);
          if (lastChar == ',') {
              strVal = str.slice(0, -1);
          }
          window.location.href = this.redirectURL+strVal;
        }

      }
    });
  }



  viewActivities(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/apicol/AllActivities',encSchemeStr]);
  }

  getRsmHist(applctnId:any) {
    let params = {
      "schemeId":this.schemeId,
      "profileId":this.applicantId,
      "applctnId":applctnId
    };
    this.loading = true;
    this.objSchmActv.schemeRsmHist(params).subscribe(res=>{
      if (res.status == 1) {
        this.rsmInfo  = JSON.parse(JSON.stringify(res.result['rsmInfoArr']));
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
  get g(): { [key: string]: AbstractControl } {
    return this.appCancelForm.controls;
  }
  doCancelRequest(){
    this.cancelSubmitted = true;
    if (this.appCancelForm.invalid) {
      Swal.fire({
        icon: 'error',
        text: 'Please enter remark'
      });
      return;
    }
    Swal.fire({
      title: 'Are you sure do you want to cancel the application?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      // cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      showDenyButton: true,
      denyButtonText:'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let params = {
          "schemeId":this.schemeId,
          "profileId":this.applicantId,
          "applctnId":this.applctnId
        };
        this.apicolScheme.cancelRequestApplication(params).subscribe(res=>{
          console.log(res);
        });
        //apicolScheme.cancelRequestApplication
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
  doSchemeCancel(schemeId : any,applicationId : any){
    this.applctnId  =applicationId;
    this.open(this.someModalRef);
     return;

  }
}
