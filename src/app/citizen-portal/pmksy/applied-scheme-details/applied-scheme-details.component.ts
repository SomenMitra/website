import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { RedirectService } from '../../../redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitizenSchemeActivityService } from '../service-api/citizen-scheme-activity.service';
import { ApiService } from '../../seed-dbt-apply/api.service';
import Swal from 'sweetalert2';
import { PmksyService } from '../../pmksy/service-api/pmksy.service';
import { WebsiteApiService } from '../../../website/website-api.service';

@Component({
  selector: 'app-applied-scheme-details',
  templateUrl: './applied-scheme-details.component.html',
  styleUrls: ['./applied-scheme-details.component.css']
})
export class AppliedSchemeDetailsComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute, private objSchm:CitizenSchemeService,private encDec: EncryptDecryptService,
    private modalService: NgbModal,private objSchmActv:CitizenSchemeActivityService,private objRedirect: RedirectService,private objSeedService:ApiService,private objPMKSY:PmksyService,private apilist: WebsiteApiService,) { }
  respSts:any;
  respList:any;
  applicantId:any;
  schemeId:any;
  applctnId: any;
  loading = false;
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
  landareaid:any;
  prevMIDetails:any[]=[];
  MIlist:any[]=[];
  govtPrice:any;
  miPrice:any;
  isHidden=true;
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
    this.seedDBTProcessId = environment.seedDBT;


    this.getSeedDBTReapplyStatus();


    let params = {
      "schemeId":this.schemeId,
      "profId":this.applicantId,
      "applctnId":this.appId
    };
    this.getAppldSchmLst(params);


    
  }
  getAppldSchmLst(params:any)
  {
    this.objSchm.getAppldSchmLst(params).subscribe(res=>{
      this.respSts  = res.status;
      this.respList = res.result;
      this.landareaid = this.respList[0].schemeSetResults.intLandareaId;
      this.AuthUpdateSts = res.result[0].subsidyList[0].AuthUpdateSts;
      if(res.status.directorate=='Mo Bidyut'){
        this.refText='UPAN No.'
      }
      // console.log(this.refText);
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
  doSchemeApply(schemeStr: any, schemeName: any, schmServTypeId: any, schmServTypeNm: any, intSPDPSts:any)
  {
    this.setSchmServSesNm(schemeName, schmServTypeId, schmServTypeNm, intSPDPSts);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/pmksy/profile-update',encSchemeStr]);
  }
  doSwitchMI(schemeStr){
    this.loading = true;
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.schemeStr = this.encDec.decText(encSchemeStr);
    let schemeArr = this.schemeStr.split(':');
    let apiParam={
      'processId':schemeArr[0],
      'onlineServiceId':schemeArr[1],
    }
    this.objPMKSY.getPreviousMIdetails(apiParam).subscribe(res => {
      if (res.result.resultInfo) {
        this.loading = false;
        this.prevMIDetails=res.result.resultInfo.miDetails;
        this.MIlist=res.result.resultInfo.getMI;
        this.open(this.someModalRef);
        
      }else{
        this.loading = false;
        Swal.fire({
          icon: 'error',
          text: "Something Went Wrong"
        });
      }
    });
  }
  searchSwitchMI(schemeStr){
    this.isHidden=false;
    this.loading = true;
    let miId=$(".pmksy_mi_id").attr("id");
    let miVal: any=(<HTMLInputElement>document.getElementById(miId)).value;
    if(miVal == 0 || miVal==''){
      Swal.fire({
        icon: 'error',
        text: 'Select Manufacture'
      });
      return false;
    }
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.schemeStr = this.encDec.decText(encSchemeStr);
    let schemeArr = this.schemeStr.split(':');
    let processId=schemeArr[0];
    let componentId=schemeArr[1];
    let subComponentId=schemeArr[2];
    let landArea=schemeArr[3];
    let spacing=schemeArr[4];
    if(componentId==1){
      let spaceId = spacing.split(' X ');
      var space1=spaceId[0];
      var space2=spaceId[1];
    }else{
      var sprinkSubComVal=spacing;
    }
    let params = {
      area: landArea,
      space1: space1,
      space2: space2,
      sprinklerSubcomponent: sprinkSubComVal,
      miVal: miVal,
      componentVal:componentId,
      subComponentVal:subComponentId,
      processId:processId,
      totAcer:landArea,
      landType:1
    }
    this.apilist.searchSubsidyCalculation(params)
      .subscribe((data: any) => {
        this.isHidden=true;
        this.govtPrice=data.result.govtPrice;
        this.miPrice=data.result.miPrice;
        if(data.result.status == '1' ){
          if( data.result.govtPrice!='' && data.result.miPrice == ''){
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: 'Manufacture price not updated for this land and spacing'
            });
          }else if(data.result.govtPrice =='' && data.result.miPrice == ''){
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: 'Department price is not define for this land and spacing'
            });
          }
        }else {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            text: 'Invalid Details'
          });
        }       

        });
  }
  submitSwitchMI(){
    this.loading = true;
    let miId=$(".pmksy_mi_id").attr("id");
    let miVal: any=(<HTMLInputElement>document.getElementById(miId)).value;
    let GovPrice=(document.getElementById('hidGovPrice') as HTMLInputElement).value;
    let miPrice=(document.getElementById('hidMiPrice') as HTMLInputElement).value;
    let applicationId=(document.getElementById('applicationId') as HTMLInputElement).value;
    let prevGovIndicativeCost=(document.getElementById('hidPrevGovIndicativeCost') as HTMLInputElement).value;
    let prevMIIndicativeCost=(document.getElementById('hidPrevMIIndicativeCost') as HTMLInputElement).value;
    if(miVal == 0 || miVal==''){
      Swal.fire({
        icon: 'error',
        text: 'Select Manufacture'
      });
      return false;
    }
    if(GovPrice == ''){
      Swal.fire({
        icon: 'error',
        text: 'Govt. price can not left blank'
      });
      return false;
    }
    if(miPrice == ''){
      Swal.fire({
        icon: 'error',
        text: 'Manufacture price can not left blank'
      });
      return false;
    }
    let msgValue="Are you sure to submit?";
      this.loading = true;
      Swal.fire({
          icon: 'error',
          html: msgValue,
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: "No"
        }).then((result) => {                
            if (result.isConfirmed) {
              let params = {
                miVal: miVal,
                GovPrice:GovPrice,
                miPrice:miPrice,
                applicationId:applicationId,
                prevGovIndicativeCost:prevGovIndicativeCost,
                prevMIIndicativeCost:prevMIIndicativeCost,
                applicantId:this.applicantId
              }
              this.objPMKSY.updateSwitchManufacture(params)
                .subscribe((res: any) => {
                  if (res.result.resultInfo.upSts==200) {
                    this.loading = false;
                    //this.close(this.someModalRef);
                    Swal.fire({
                      icon: 'success',
                      text: "Manufacture Switch Successfully"
                    }).then(() => {
                      this.router.navigate(['/citizen-portal/dashboard']);
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
  goBack() {
    window.history.back();
  }
  doSchemePreview(schemeStr : any)
  {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/pmksy/scheme-preview',encSchemeStr]);
  }

  doUploadPaymentReceipt(schemeStr : any)
  {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/upload-payment-receipt',encSchemeStr]);
  }

  updateScheme(schemeStru : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStru.toString());

      this.router.navigate(['/citizen-portal/pmksy/updateSchemestatus',encSchemeStr]);
    
  }


  doSchemeSeedDBTApply(schemeName: any, schmServTypeId: any, schmServTypeNm: any, schemeStr: any, intSPDPSts:any)
  {
    this.setSchmServSesNm(schemeName, schmServTypeId, schmServTypeNm, intSPDPSts);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/seed-apply', encSchemeStr]);
  }

  // mthod to set scheme session details
  setSchmServSesNm(schemeName: any, schmServTypeId: any, schmServTypeNm: any, intSPDPSts:any)
  {
    let schmSesnArr = {};
    schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = schmServTypeNm;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schmServTypeId;
    schmSesnArr["FFS_APPLY_SPDP"]           = intSPDPSts;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
  }

  doQueryReply(schemeStr: any, schemeName: any, schmServTypeId: any, schmServTypeNm: any, intSPDPSts:any)
  {
    this.setSchmServSesNm(schemeName, schmServTypeId, schmServTypeNm, intSPDPSts);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/pmksy/scheme-query-reply',encSchemeStr]);
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
        //console.log(finalRedirectArrs);
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
          //console.log(finalRedirectArrs);return false;
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
    this.router.navigate(['/citizen-portal/AllActivities',encSchemeStr]);
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

}
