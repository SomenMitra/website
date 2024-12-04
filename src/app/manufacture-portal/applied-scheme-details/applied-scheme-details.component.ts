import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';
import { RedirectService } from '../../redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitizenSchemeActivityService } from '../service-api/citizen-scheme-activity.service';
import { ApiService } from '../seed-dbt-apply/api.service';
import Swal from 'sweetalert2';
import { PmksyService } from '../../manufacture-portal/service-api/pmksy.service';

@Component({
  selector: 'app-applied-scheme-details',
  templateUrl: './applied-scheme-details.component.html',
  styleUrls: ['./applied-scheme-details.component.css']
})
export class AppliedSchemeDetailsComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute, private objSchm:ManufactureSchemeService,private encDec: EncryptDecryptService,
    private modalService: NgbModal,private objSchmActv:CitizenSchemeActivityService,private objRedirect: RedirectService,private objSeedService:ApiService, private objPMKSY:PmksyService) { }
  respSts:any;
  respList:any;
  applicantId:any;
  schemeId:any;
  applctnId: any;
  public loading = false;
  resDocSts: any;
  resDocList: any;
  respsubsidy:any;
  appQrySts=environment.constQrySts;
  appRsmSts=environment.constRsmSts;
  sujogProcessId=environment.sujogPortal;
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
  AuthUpdateSts:number;
  editPhaseActivity:any;
  appId:any;
  profileId:any;
  landareaid:any;
  extensionType=environment.extensionType;
  IS_PRE_POST = environment.IS_PRE_POST;
  @ViewChild('someModal') someModalRef: ElementRef;

  ngOnInit(): void {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId  = this.route.snapshot.paramMap.get('id');
    this.seedDBTTotQuantityValidation = Number(environment.seedDBTTOTHECTValdn);
    this.schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = this.schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.appId = schemeArr[1];
    this.profileId = schemeArr[2];
    this.seedDBTProcessId = environment.seedDBT;

    let params = {
      "schemeId":this.schemeId,
      "farmerId":this.profileId,
      "applctnId":this.appId
    };
    this.getAppldManufactureSchmLst(params);

  }
  getAppldManufactureSchmLst(params:any)
  {
    this.objSchm.getAppldManufactureSchmLst(params).subscribe(res=>{
      //console.log(res.result);
      this.respSts  = res.status;
      this.respList = res.result;
      this.landareaid = this.respList[0].schemeSetResults.intLandareaId;
      this.AuthUpdateSts = res.result[0].subsidyList[0].AuthUpdateSts;
      if(res.status.directorate=='Mo Bidyut'){
        this.refText='UPAN No.'
      }
    });
  }
  // getSeedDBTReapplyStatus(){
  //   let params = {
  //     "profileId": this.profileId,
  //   };
  //   this.objSeedService.getSeedDBTReapplyStatus(params).subscribe(res => {

  //    if(res.result.flag == 200)
  //    {

  //     this.seedDBTPaddytotalQuantity = res.result.noOfTimePaddyApplied;
  //     this.seedDBTNonPaddytotalQuantity = res.result.noOfTimeNonPaddyApplied;
  //     this.noOfTimeSeedApplied  = res.result.noOfTimeApplied;

  //    }

  //   });
  //   }
  doSchemeApply(schemeStr : any,schemeName:any, schmServTypeId:any,schmServTypeNm:any)
  {
    this.setSchmServSesNm(schemeName,schmServTypeId,schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/profile-update',encSchemeStr]);
  }
  goBack() {
    window.history.back();
  }
  doSchemePreview(schemeStr : any)
  {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/scheme-preview',encSchemeStr]);
  }

  doUploadPaymentReceipt(schemeStr : any)
  {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/upload-payment-receipt',encSchemeStr]);
  }

  updateScheme(schemeStru : any)
  {
    const schemeIds = schemeStru.split(":");
    let schemeId=schemeIds[0];
    let encSchemeStr = this.encDec.encText(schemeStru.toString());
    // if(schemeId==44){
    //   this.router.navigate(['/citizen-portal/apicol/updateSchemestatus',encSchemeStr]);
    // }
    // else{
      this.router.navigate(['/manufacture-portal/updateSchemestatus',encSchemeStr]);
    // }
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
    this.router.navigate(['/citizen-portal/scheme-query-reply',encSchemeStr]);
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


  funExtensionChange(){
    let selExtensionType=(document.getElementById('selExtensionType') as HTMLTextAreaElement).value;
    if(selExtensionType == '4'){
      $('.clsReason').removeClass( "d-none" )
    }else{
      $('.clsReason').addClass( "d-none" )
    }
  }
  viewActivities(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/AllActivities',encSchemeStr]);
  }

  getRsmHist(applctnId:any) {
    let params = {
      "schemeId":this.schemeId,
      "profileId":this.profileId,
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

  updateBOQ(schemeStr){
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/manufacture-portal/update-boq',encSchemeStr]);

  }
  updateExtension(schemeStr){
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.schemeStr = this.encDec.decText(encSchemeStr);
    let schemeArr = this.schemeStr.split(':');
    //this.loading = false;
          let msgValue="Are you sure to extension for 7 days?";
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
                }else{
                  let apiParam={
                    "applicationId":schemeArr[1],
                    "MIid":this.applicantId
                  }
                  this.objPMKSY.submitManufactureNoExtension(apiParam).subscribe(res => {
                    //console.log(res.resultInfo.upSts);
                    if (res.result.resultInfo.upSts==200) {
                      this.loading = false;
                      Swal.fire({
                        icon: 'success',
                        text: "Extension Updated Successfully"
                      }).then(() => {
                        this.router.navigate(['/manufacture-portal/mi-dashboard']);
                        });
                    }else{
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
  submitExtension(){
    const formData = new FormData();
    let txtExtensionRemarks=(document.getElementById('txtExtensionRemarks') as HTMLTextAreaElement).value;
    let selExtensionType=(document.getElementById('selExtensionType') as HTMLTextAreaElement).value;
    let txtExtensionReason=(document.getElementById('txtExtensionReason') as HTMLTextAreaElement).value;
    let selectedintmnFileList = (<HTMLInputElement>document.getElementById('docExtension'));
    let intmnFile: any = selectedintmnFileList.files.item(0);
    const intmnExtension = selectedintmnFileList.value.split('.').pop();
    if( selExtensionType == ''){
      Swal.fire({
        icon: 'error',
        text: 'Select type of extension'
      });
      return false;
    }
    if(selExtensionType == '4'){
      if( txtExtensionReason == ''){
        Swal.fire({
          icon: 'error',
          text: 'Enter extension reason'
        });
        return false;
      }
    }
    if(txtExtensionRemarks == ''){
      Swal.fire({
        icon: 'error',
        text: 'Enter Remarks'
      });
      return false;
    }
    if(intmnFile){
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
          if (res.result.resultInfo.upSts==200) {
            this.loading = false;
            Swal.fire({
              icon: 'success',
              text: "Extension Updated Successfully"
            }).then(() => {
              window.location.reload();
              });
          }else{
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: "Something Went Wrong"
            });
          }
        }
      });
  }

}
