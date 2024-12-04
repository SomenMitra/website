import { Component, OnInit, Injectable, ElementRef,AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { ValidatorchklistService } from '../../../validatorchklist.service';
import { RedirectService } from '../../../redirect.service';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import { NgbDateParserFormatter, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { formatDate } from '@angular/common';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import FuzzySet from 'fuzzyset';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from "moment";
import { Moment } from "moment";
function padNumber(value: number | null) {
  if (!isNaN(value) && value !== null) {
    return `0${value}`.slice(-2);
  }
  return '';
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');

      let dateObj: NgbDateStruct = { day: <any>null, month: <any>null, year: <any>null }
      const dateLabels = Object.keys(dateObj);

      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || <any>null;
      });
      return dateObj;
    }
    return null;
  }

  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    return date ?
      `${padNumber(date.day)}/${padNumber(date.month)}/${date.year || ''}` :
      '';
  }

  static formatDateStr(date: NgbDateStruct | NgbDate | null | ''): string {
    return date ?
      `${date.year || ''}-${padNumber(date.month)}-${padNumber(date.day)}` :
      '';
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomParserFormatter.formatDate(date);
  }
}


@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css'],
  providers: [CitizenProfileService, ValidatorchklistService, NgbDateCustomParserFormatter]
})
export class ProfileUpdateComponent implements OnInit,AfterViewInit {

  dob: NgbDateStruct;
  loading = false;
  responseSts: any;
  schemeId: any;
  applicantId: any;
  applctnId: any;
  applicantName = '';
  spdp_id = '';
  emailId = '';
  emailIdSts = false;
  mobileNo = '';
  aadhaarNo = '';
  gender = '';
  castCatg = '';
  fatherNm = '';
  districtId = 0;
  blockId = 0;
  gpId = 0;
  villageId = 0;
  address = '';
  redirectURL='';
  serviceModeId=0;
  keyArr='';
  cityId='';
  genderList: any[] = [];
  castCatgList: any[] = [];
  cateStatus = false;
  districtList: any[] = [];
  blockList: any[] = [];
  gpList: any[] = [];
  vlgList: any[] = [];
  redirectList: any[] = [];
  cityList: any[] = [];
  redirectKeyList='';
  redirectFrnmName='';
  redirectAPIDetls='';
  mstrDt: any = new BehaviorSubject('');
  getData = this.mstrDt.asObservable();
  profImgUrl: any = '';
  KprofImgUrl: any = '';
  profDefImgUrl: any = '';
  isProfImgUrl = false;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  maxLghNm = 100;
  minLghNm = 5;
  maxLghEmail = 50;
  minLghEmail = 10;
  maxLghMob = 10;
  minLghMob = 10;
  maxLghFnm = 100;
  minLghFnm = 5;
  maxLghAdrs = 500;
  minLghAdrs = 5;
  minLghAdhno=12;
  maxLghAdhno=12;


  imgExtnArr:any[] = ['jpg','jpeg','png'];
  imgFileSize = 1;

  draftSts = 1;
  saveNxtSts = 2;
  schemeName = null;
  schemeType = null;
  schemeTypeId = 0;
  tinDirectorate=0;

  aadhrMndSts = false;
  docSectnSts = false; // document section display/ not
  serviceMode = false; // Service Mode
  baseType = false; // API TYPE Mode
  intSPDPStatus = false;
  verifyOTP = true; // API TYPE Mode
  verifySPDPOTP = true; // API TYPE Mode
  time1: NgbTimeStruct;
  txtOTP='';
  intBlockUlb =1;
  agricultureDirectory=environment.agricultureDirectory;
  KName='';
  KEmail='';
  KMobile='';
  KGender='';
  KDob:NgbDateStruct;
  KCategory='';
  KFatherName='';
  KdistrictName='';
  KblockName='';
  KgpName='';
  KvillageName='';
  Kaddress='';
  districtName=''
  blockName='';
  gpName='';
  villageName='';
  onlineServiceId='';
  CrossMOb='';
  castCatgName='';
  KcastCatgName='';
  eMsg='';
  onlineProfileId=0;
  aadherMob='';
  whetherOdishaOne = 0;
  odishaoneaadhar= '';
  KO_SCHEME_IDS=environment.KO_SCHEME_IDS;
  verifyDob = true;
  dateType = 'text';
  physicalList: any[] = [];
  physical:any = '';
  modeofFinance:any;
  workflowId:any;
  financeType:any=false;
  isButtonVisible: boolean = false;
  farmerInfoData :any;
  LOGIN_THROUGH = 0;
  constructor(
    private router: Router, private route: ActivatedRoute, private encDec: EncryptDecryptService, private objMstr: CitizenMasterService, private objProf: CitizenProfileService, public vldChkLst: ValidatorchklistService, private el: ElementRef, private objRedirect: RedirectService,private _sanitizer: DomSanitizer
  ) { }

  //constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    let schmSesnInfo  = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    this.schemeName   = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType   = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;
    this.schemeTypeId = schmSesnInfo.FFS_APPLY_SCHEME_TYPE_ID;

    this.aadhrMndSts  = (this.schemeTypeId==environment.constScheme) ? true : false;

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.LOGIN_THROUGH = (farmerInfo['LOGIN_THROUGH'] == 1 ? farmerInfo['LOGIN_THROUGH'] : 0);
    this.farmerInfoData =farmerInfo;
    this.applicantId  = farmerInfo.USER_ID;
    this.aadherMob     = farmerInfo.USER_MOBILE;

    this.whetherOdishaOne     = farmerInfo.WHETHERODISHAONE?farmerInfo.WHETHERODISHAONE:0;
    this.odishaoneaadhar     = farmerInfo.ODISHAONE_AADHAR?farmerInfo.ODISHAONE_AADHAR:"";
    if(this.whetherOdishaOne == 1 && this.odishaoneaadhar!=''){
      this.aadhaarNo  = this.odishaoneaadhar;
    }

    let encSchemeId   = this.route.snapshot.paramMap.get('id');
    let schemeStr     = this.encDec.decText(encSchemeId);
    let schemeArr     = schemeStr.split(':');
   //  console.log(schemeArr,'profile-update');
    // return ;
    this.schemeId     = schemeArr[0];

    this.applctnId    = schemeArr[1];
    this.docSectnSts  = (schemeArr[2]!=undefined && schemeArr[2]>0)?true:false;
    if(this.schemeId == environment.seedDBT)
    {
    this.docSectnSts = false;
    }
    this.serviceMode  = (schemeArr[3]!=undefined && schemeArr[3]==2)?true:false;
    this.baseType  = (schemeArr[4]!=undefined && schemeArr[4]==1)?true:false;
    this.intSPDPStatus  = (schemeArr[6]!=undefined && schemeArr[6]==1)?true:false;
    if(this.serviceMode && this.baseType){
      let apiParam = {
        "processId":this.schemeId,
        "applicantId":this.applicantId
      }
      this.objProf.getRedirectAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          this.redirectList = res.result.redirectInfo;
          this.redirectKeyList = res.result.redirectInfo.apiKeyDtls;
          this.redirectURL   = res.result.redirectInfo.redirectURL;
          this.redirectAPIDetls   = res.result.redirectInfo.redirectAPIDetls;
          this.tinDirectorate   = res.result.redirectInfo.tinDirectorate;
          this.serviceModeId   = 2;
        }
      });
    }else if(this.serviceMode && environment.AIFPortal==this.schemeId){
      let apiParam = {
        "processId":this.schemeId,
        "applicantId":this.applicantId
      }
      this.objProf.getRedirectAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          this.redirectURL   = res.result.redirectInfo.redirectOthURL;
          this.serviceModeId   = 2;
        }
      });
    }
    else{
      this.serviceModeId   = 1;
    }
    // if(this.schemeId==36){
    //     let apiParam = {
    //       "schemeId":this.schemeId
    //     }
    //     this.objProf.getRedirectCityAPI(apiParam).subscribe(res => {
    //       if (res.status == 1) {
    //         this.cityList = res.result.resultInfo;
    //       }
    //     });
    //   }else{
    //     this.cityList   = [];
    //   }



    setTimeout(()=>{
      this.getFarmrInfo();
 }, 1000);


this.time1 = {hour: 15, minute: 58, second: 55};


    // let todayDt = new Date();
    // this.minDate = { year: 1900, month: 1, day: 1 }
    // this.maxDate = { year: todayDt.getFullYear(), month: todayDt.getMonth() + 1, day: (todayDt.getDate() - 1) }

    const currentYear = new Date();
    const pastDate = new Date(currentYear.getFullYear() - 18, currentYear.getMonth()+1, currentYear.getDate());
    this.minDate =  { year: 1900, month: 1, day: 1 }
    this.maxDate =  { year: pastDate.getFullYear(), month: pastDate.getMonth()+1, day: pastDate.getDate() }
    // this.getDatetime();
    ///this.getTime();
  }
  getPhysicalDisableData(constKey: any) {
    let param = {
      "constKey": constKey,
      "schemeId": this.schemeId,
      "subConstKey": ""
    }
    this.objMstr.getMstrConstList(param).subscribe(res => {
     
      if (res.status == 1) {
        this.physicalList = res.result;
      }
    },
      error => {
        this.physicalList = [];
      });
     
  }
  // getTime() {
  //   let value = null;

  //     if (!this.time){
  //       value = new Date().getHours() +':'+ new Date().getMinutes();
  //      // alert(value)
  //     }

  //     else
  //     {
  //       value = new Date().getHours() +':'+ new Date().getMinutes();
  //     }
  //   if (!value) {
  //     value = new Date(
  //       this.time ? this.time.hour : 0,
  //       this.time ? this.time.minute : 0
  //     );
  //     this._value=value;
  //   } else
  //     this._value=null
  //   this.form.get("control").setValue(this._value);
  //   this.label=value;
  // }
  // form = new FormGroup({
  //   control: new FormControl()
  // });
  goToBack() {
    // let bckUrl = '/citizen-portal/scheme-list';
    // this.router.navigate([bckUrl]);
    window.history.back();
  }

  getGenderList(constKey: any) {
    let currObj = this;
    this.getMasterList(constKey);
    this.mstrDt.subscribe(res => {
      currObj.genderList = res;
    })
  }
  getMasterList(constKey: any) {
    let param = {
      "constKey": constKey
    }
    let mstrData = [];
    this.objMstr.getMstrConstList(param).subscribe(res => {
      if (res.status == 1) {
        this.mstrDt.next(res.result)
      }
    },
      error => {
        mstrData = [];
        this.mstrDt.next(mstrData)
      });
    this.mstrDt.next;
  }

  getCatgList(constKey: any) {
    let param = {
      "constKey": constKey,
      "schemeId":this.schemeId,
      "subConstKey":"MKUY_CATEGORY"
    }
    this.objMstr.getMstrConstList(param).subscribe(res => {
      if (res.status == 1) {
        this.castCatgList = res.result;
      }
    },
      error => {
        this.castCatgList = [];
      });
  }
  getDistList() {
    this.blockList = [];
    this.gpList = [];
    this.vlgList = [];
    let param = {
      "parentId": 1,
      "subLevelId": 1
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.districtList = res.result;
      }
    },
      error => {
        this.districtList = [];
      });
  }

  getBlockList(eVlue: any,eSts:any,block:any) {
    this.gpList = [];
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 2
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.blockList = res.result;
        for (var val of res.result) {
          if(val.intHierarchyValueId==block){
            this.intBlockUlb = val.intBlockUlb;
            break;
          }
        }
      }
    },
      error => {
        this.blockList = [];
      });
      if(eSts==1)
      {
        this.blockId = 0;
        this.gpId = 0;
        this.villageId = 0;
      }
  }

  getGpList(eVlue: any,eSts:any) {
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 3
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.gpList = res.result;

      }
    },
      error => {
        this.gpList = [];
      });

      if(eSts==1)
      {
        this.gpId = 0;
        this.villageId = 0;
      }
  }

  getGpListNew(event,eSts:any) {
    let eVlue = event.value;
    this.intBlockUlb = event.options[event.selectedIndex].getAttribute('data-val');

    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 3
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.gpList = res.result;

      }
    },
      error => {
        this.gpList = [];
      });

      if(eSts==1)
      {
        this.gpId = 0;
        this.villageId = 0;
      }
  }

  getVlgList(eVlue: any,eSts:any) {
    let param = {
      "parentId": eVlue,
      "subLevelId": 4
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.vlgList = res.result;
      }
    },
      error => {
        this.vlgList = [];
      });
      if(eSts==1)
      {
        this.villageId = 0;
      }
  }

  // get farmer  basic info
  getFarmrInfo() {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
   // console.log(farmerInfo);
    let params = {
      "profileId": this.applicantId,
      "applicationId":this.applctnId,
      "schemeId":this.schemeId,
      "subConstKey":"MKUY_CATEGORY",
      "aadhaarNo":farmerInfo['USER_AADHAAR'] != '' ? farmerInfo['USER_AADHAAR'] : ''
    };
    this.loading = true;

    this.getGenderList('GENDER_LIST');
    this.getCatgList('CASTE_CATEGORY');
    this.getDistList();
    this.getPhysicalDisableData('PHYSICALLY_DISABLED');

    this.objProf.profileBuildAPICOL(params).subscribe(res => {
      this.responseSts = res.status;
      if (res.status > 0) {
        let resProfInfo = res.result['profileInfo'];
        // get profile info
        this.applicantId = resProfInfo['applicantId'];
        this.applicantName = resProfInfo['applicantName'];
        this.emailId = resProfInfo['emailId'];
        this.emailIdSts = (resProfInfo['emailId'] != '') ? true : false;
        this.mobileNo   = resProfInfo['mobileNo'];
        this.physical = resProfInfo['physicalDisabled'];
       // this.aadhaarNo  = (resProfInfo['aadhaarNo'])?resProfInfo['aadhaarNo']:this.odishaoneaadhar;
       this.aadhaarNo  = (farmerInfo['LOGIN_THROUGH'] == 1 ? farmerInfo['USER_AADHAAR'] : ((resProfInfo['aadhaarNo'])?resProfInfo['aadhaarNo']:this.odishaoneaadhar));
        if(this.aadhaarNo != ''){
         this.verifyOTP = false;
          this.aadhrMndSts=false;
        }
        this.modeofFinance = (resProfInfo['vchmeanoffinance'])?resProfInfo['vchmeanoffinance']:'';
        this.workflowId = (resProfInfo['intWorkflowEffectId'])?resProfInfo['intWorkflowEffectId']:1;
        if(this.workflowId==2){
          this.financeType=true;
        }else{
          this.financeType=false;
        }
        this.fatherNm   = resProfInfo['fatherNm'];
        this.gender     = resProfInfo['gender'];
        this.castCatg   = resProfInfo['castCatg'];
        this.castCatgName   = resProfInfo['castCatgName'];
        let dobV = resProfInfo['dob'];

        const dateArr = dobV.split('-');
        const ngbDate: NgbDateStruct = {
          year: parseInt(dateArr[0]),
          month: parseInt(dateArr[1]),
          day: parseInt(dateArr[2]),
        }
        this.dob = ngbDate;
        this.districtId    = resProfInfo['districtId'];
        this.blockId       = resProfInfo['blockId'];
        this.gpId          = resProfInfo['gpId'];
        this.villageId     = resProfInfo['villageId'];
        this.districtName    = resProfInfo['districtNm'];
        this.blockName       = resProfInfo['blockNm'];
        this.gpName          = resProfInfo['gpNm'];
        this.villageName     = resProfInfo['vlgNm'];
        this.address       = resProfInfo['address'];
        this.profImgUrl    = resProfInfo['profPic'];
        let profData  =  resProfInfo['profPic'].replace('data:image/png;base64,','');
        this.isProfImgUrl  = (profData!='')?true:false;
        this.profDefImgUrl = resProfInfo['defProfPic'];
        this.cityId = resProfInfo['cityId'];
        this.onlineProfileId = resProfInfo['OnlineProfileId'];
        
        if(this.districtId>0)
        {
          this.getBlockList(this.districtId,2,this.blockId );
        }
        if (this.blockId > 0) {
          this.getGpList(this.blockId,2);
        }
        if (this.gpId > 0) {
          this.getVlgList(this.gpId,2);
        }
        this.loading = false;
       if(this.aadhaarNo!='' && this.onlineProfileId){
          this.checkAadhaarValidation(this.aadhaarNo,this.onlineProfileId);
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
  checkAadhaarValidation(aadhaarNo, onlineProfileId): Promise<any> {
    return new Promise((resolve, reject) => {
      let params = {
        aadhaarNo: aadhaarNo,
        onlineProfileId: onlineProfileId
      };
      
      this.loading = true;
      this.objProf.checkAadhaarValidation(params).subscribe(res => {
        this.loading = false;
        if (res.status === 1) {
          const resStatus = res.result.resultInfo.msgStstus;
          const resStatusMsg = res.result.resultInfo.errMsg;
  // console.log(resStatus);
          if (resStatusMsg !== 'SUCCESS') {
            // Handle error response
            const resData = res.result.resultInfo.resData.table;
            Swal.fire({ 
              html: resData,
              title: resStatusMsg,
              width: '1200px',
              padding: '1em',
              customClass: {
                popup: 'custom-popup custom-swal',
                icon: 'custom-icon'
              }
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/citizen-portal/dashboard']);
              }
            });
            reject(resStatusMsg); // Reject the promise if not successful
          } else {
            resolve(res); // Resolve the promise if successful
          }
        } else {
          reject(res.msg); // Reject the promise if the response status is not 1
        }
      }, error => {
        this.loading = false;
        reject(environment.errorMsg); // Reject on error
      });
    });
  }
  // update farmer basic info
  async updFarmerInfo(vType: any) {
    
    let profIdP = this.applicantId;
    let applicantNmP = this.applicantName;
    let emailIdP = this.emailId;
    let mobileNoP = (this.mobileNo)?this.mobileNo:this.aadherMob;
    let genderP = this.gender;
    let dobP = NgbDateCustomParserFormatter.formatDateStr(this.dob);
    dobP = (dobP == '--') ? '' : dobP;
    let castCatgP = this.castCatg;
    let fatherNmP = this.fatherNm;
    let aadhaarNoP= this.aadhaarNo;
    let districtIdP = this.districtId;
    let blockIdP = this.blockId;
    let gpIdP = this.gpId;
    let villageIdP = this.villageId;
    let addressP = this.address;
    let profSts = 0;
    let serviceModeId = this.serviceModeId;
    let redirectURL = this.redirectURL;
    let redirectArr = this.redirectKeyList;
    let arrayOfUrl = [];
    let arrayRedUrl:any = [];
    let redirectFrnmName='';
    let fuzzyResult=[];
    let schemeId=this.schemeId;
    let cityId=this.cityId;
    let physicalD=this.physical
    let replaceArr={"[frmname]":applicantNmP,"[frmmob]":mobileNoP,"[frmmail]":emailIdP,"[frmfather]":fatherNmP,"[frmaadhar]":aadhaarNoP,"[frmgender]":genderP,"[frmdob]":dobP,"[frmcity]":cityId};

    let sujogArr={"apiId": "Rainmaker","ver": ".01","ts": "","action": "_send","did": "1","key": "","msgId": "20170310130900|en_IN","authToken": null};
    //let replaceArr={"[frmname]":applicantNmP,"[frmmob]":mobileNoP,"[frmmail]":emailIdP};
    if(serviceModeId==2){
      for (let i = 0; i < redirectArr.length; i++) {
        let key=redirectArr[i]['key'];
        let value = (document.getElementById(key) as HTMLTextAreaElement).value;
        arrayOfUrl.push({key:key,value:value});
        arrayRedUrl.push({[key]:value});

        let fieldValue = replaceArr[value];
        if(typeof(fieldValue)!='undefined' && fieldValue!='')
        {
          arrayRedUrl[i] = {[key]:fieldValue};
        }
      }

      arrayRedUrl = arrayRedUrl.reduce(((r, c) => Object.assign(r, c)), {});
      //console.log(arrayRedUrl);return false;
    }else{
      let arrayOfUrl='';
    }
    let vSts = true;
    let koValidation=(environment.KO_SCHEME_IDS.includes(this.schemeId));

    if (!this.vldChkLst.blankCheck(applicantNmP, "Applicant Name") && koValidation===false) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheckCustome(applicantNmP, "Applicant Name cann't Blank.Update in Krush Odisha Portal") && koValidation===true) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(applicantNmP, this.maxLghNm, "Applicant Name")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(applicantNmP, this.minLghNm, "Applicant Name")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validEmail(emailIdP)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(emailIdP, this.maxLghNm, "Email Id")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(emailIdP, this.minLghNm, "Email Id")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(mobileNoP, "Mobile Number") && koValidation===false) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheckCustome(mobileNoP, "Mobile Number cann't Blank.Update in Krush Odisha Portal") && koValidation===true) {
      vSts = false;
    }
    else if (!this.vldChkLst.validMob(mobileNoP)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(mobileNoP, this.maxLghMob, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(mobileNoP, this.minLghMob, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheckRdo("gender", "Gender") && koValidation===false) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheckRdoCustome("gender", "Gender Information is not available.Please Update in Krush Odisha Portal to Proceed") && koValidation===true) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(dobP, "Date of Birth") && koValidation===false) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheckCustome(dobP, "Date of Birth Information is not available.Please Update in Krush Odisha Portal to Proceed") && koValidation===true) {
      vSts = false;
    }
    else if (!this.vldChkLst.selectDropdown(castCatgP, "Category") && koValidation===false) {
      vSts = false;
    }
    else if (!this.vldChkLst.selectDropdownCustome(castCatgP, "Category Information is not available.Please Update in Krush Odisha Portal to Proceed") && koValidation===true) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(aadhaarNoP, "Aadhaar Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validAadhar(aadhaarNoP)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(aadhaarNoP, this.maxLghAdhno, "Aadhaar Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(aadhaarNoP, this.minLghAdhno, "Aadhaar Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(fatherNmP, "Father's/ Husband's Name")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(physicalD, "Differently Abled")) {
      vSts = false;
    }
    else if (vType == this.saveNxtSts) {
      if (!this.vldChkLst.blankImgCheck(this.profImgUrl, "Upload Image")) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(districtIdP, "District") && koValidation===false) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdownCustome(districtIdP, "District Information is not available.Please Update in Krush Odisha Portal to Proceed") && koValidation===true) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(blockIdP, "Block/ ULB") && koValidation===false) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdownCustome(blockIdP, "Block/ ULB Information is not available.Please Update in Krush Odisha Portal to Proceed") && koValidation===true) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(gpIdP, "GP/ Ward") && koValidation===false) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdownCustome(gpIdP, "GP/ Ward Information is not available.Please Update in Krush Odisha Portal to Proceed") && koValidation===true) {
        vSts = false;
      }
      else if ( this.intBlockUlb==1 && !this.vldChkLst.selectDropdown(villageIdP, "Village") && koValidation===false) {
        vSts = false;
      }
      else if (this.intBlockUlb==1 && !this.vldChkLst.selectDropdownCustome(villageIdP, "Village Information is not available.Please Update in Krush Odisha Portal to Proceed") && koValidation===true) {
        vSts = false;
      }
      else if (this.vldChkLst.blankCheck(addressP, "Communication Address") == false && koValidation===false) {
        vSts = false;
      }
      else if (this.vldChkLst.blankCheckCustome(addressP, "Communication Address Information is not available.Please Update in Krush Odisha Portal to Proceed") == false && koValidation===true) {
        vSts = false;
      }
      else if (!this.vldChkLst.maxLength(addressP, this.maxLghAdrs, "Communication Address")) {
        vSts = false;
      }
      else if (!this.vldChkLst.minLength(addressP, this.minLghAdrs, "Communication Address")) {
        vSts = false;
      }
    }
    else {
      vSts = true;
    }
    const now = moment().startOf('day');
    const dobArray = dobP.split("-");

    //let strDate = control.value;
    const year = parseInt(dobArray[0]);
    const month = parseInt(dobArray[1]);
    const day = parseInt(dobArray[2]);
    var end  = moment([year,month,day]);
    const yearsDiff = now.diff(end, 'years');

    if (yearsDiff < 18) {
      Swal.fire({
        icon: 'error',
        text: 'Your age should be more 18 years'
      });
      console.log(1233);
      vSts = false;
    }
    if (!vSts) {
      return vSts;
    }
    else {
      try {
        const validationResponse = await this.checkAadhaarValidation(this.aadhaarNo, this.onlineProfileId);
        this.loading = true;
        let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
        let profParam = {
          "profId": loginInfo.USER_ID,
          "fullName": applicantNmP,
          "mobNo":mobileNoP,
          "emailId": emailIdP,
          "gender": genderP,
          "dob": dobP,
          "castCatg": castCatgP,
          "aadhaarNo": aadhaarNoP,
          "aadhrMndSts":this.aadhrMndSts,
          "fatherNm": fatherNmP,
          "districtId": districtIdP,
          "blockId": blockIdP,
          "gpId": gpIdP,
          "villageId": villageIdP,
          "address": addressP,
          "profImgUrl": this.profImgUrl,
          "draftSts": vType,
          "redirectURL": redirectURL,
          "serviceModeId": serviceModeId,
          "arrayOfUrl":arrayRedUrl,
          "schemeId":schemeId,
          "onlineProfileId":this.onlineProfileId,
          "applctnId":this.applctnId,
          "schemeTypeId":this.schemeTypeId,
          "spdp_id":this.spdp_id,
          "physicalD":physicalD
        };
        // console.log(profParam);
        // return false;
        // update(searchInput: string) {
        //   setTimeout(() => {
        //     this.myService.search(searchInput)
        //     .subscribe((res) => {
        //       this.myArray.content = res;
        //     });
        //   }, 400);
        // }
        
        this.objProf.profileUpdateAPICOL(profParam).subscribe(res => {
            if (res.status == 1) {
              profSts = 1;
              this.loading = false;
              // set profile pic url in session
              let profPicUrl= res.profPicUrl;
              let applicationId= res.applicationId;
              this.applctnId=res.applicationId;
              let regStatus= res.regStatus;
              if(profPicUrl!='')
              {
                let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
                farmerInfo['USER_PROF_PIC'] = profPicUrl;
                sessionStorage.removeItem('FFS_SESSION');
                sessionStorage.setItem('FFS_SESSION', JSON.stringify(farmerInfo));
              }

              if(serviceModeId==2 ){
                arrayRedUrl.applicationId = applicationId;
                arrayRedUrl.profPicUrl = profPicUrl;
                let redirectArr = [];
                redirectArr.push(arrayRedUrl);
                let sujogReq ={};
                if(schemeId==environment.sujogPortal){
                  let RequestInfo={['RequestInfo']:sujogArr};
                  let otpdtl={['otp']:arrayRedUrl};
                  sujogReq = {
                    ...RequestInfo,
                    ...otpdtl
                };

                }
                //console.log(arrayRedUrl);//return false;

                if (arrayOfUrl.filter(e => e.key === 'Farmer_ID').length > 0) {
                  this.loading = true;
                  let ind=arrayOfUrl.findIndex(e => e.key === 'Farmer_ID');
                  let indValue=arrayOfUrl[ind]['value'];
                  let txtFarmerId=(document.getElementById('Farmer_ID') as HTMLTextAreaElement).value;
                  if (!this.vldChkLst.blankCheck(txtFarmerId, "Farmer Id.If does not have farmer ID, approach AAO to create Farmer ID")) {
                    return false
                  }
                  let apiParam = {
                    "farmerID":txtFarmerId
                  }
                  this.objProf.getRedirectFarmerAPI(apiParam).subscribe(res => {
                    this.loading = false;
                    if (res.status == 1) {

                        let redirectFrnmName=res.result.resultInfo.farmerName;
                        let frmAadharNo=res.result.resultInfo.frmAadharNo;
                        let FamilyDtls=res.result.resultInfo.FamilyDtls;
                        let a = FuzzySet();
                        a.add(applicantNmP);
                        let fuzzyResults=a.get(redirectFrnmName);
                        //if(fuzzyResults!=null && fuzzyResults[0][0] >environment.constMatchValue)
                        if(FamilyDtls == 1)
                        {
                          Swal.fire({
                            icon: 'error',
                            text: 'Your Farmer ID is inactive. Please contact AAO'
                          });
                          this.loading = false;
                        }
                        else if( (fuzzyResults!=null && fuzzyResults[0][0] >environment.constMatchValue) || (frmAadharNo==aadhaarNoP))
                        {
                          //this.objRedirect.post(redirectArr,redirectURL);
                          Swal.fire({
                            text: environment.redirectMsg,
                            showDenyButton: true,
                            //showCancelButton: true,
                            confirmButtonText: 'Yes',
                            denyButtonText: `No`,
                          }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                              this.objRedirect.post(redirectArr,redirectURL);
                            } else if (result.isDenied) {
                              //Swal.fire('Changes are not saved', '', 'info')
                            }
                          })
                      }else{
                          Swal.fire({
                            icon: 'error',
                            text: 'Update Aadhaar at AAO level before applying again and subsidy to be disbursed in the PFMS validated account against the FID'
                          });
                          this.loading = false;

                        }
                    }
                    else if(res.status==2){
                      Swal.fire({
                        icon: 'error',
                        text: 'Unable to verify the Farmer ID. Please try again.'
                      });
                      this.loading = false;
                    }

                  });

                }else{
                  if(schemeId==environment.sujogPortal){
                    //console.log(111111111);return false;
                    if(regStatus==0){
                      let apiParam = {
                        "name":applicantNmP,
                        "permanentCity":cityId,
                        "mobileNumber":mobileNoP
                      }
                      this.objProf.getRedirectSujogRegAPI(apiParam).subscribe(res => {
                        if (res.status == 1) {
                          let resStatus=res.result.resultInfo;
                          console.log(resStatus);

                          if(resStatus==true){
                            alert("success");
                            this.emailNotification()

                          }else{
                            Swal.fire({
                              icon: 'error',
                              text: resStatus
                            });
                            this.loading = false;

                          }
                        }
                      });
                    }else{
                      let apiParam = {
                        "mobileNo":mobileNoP
                      }
                      this.objProf.getRedirectSujogLoginAPI(apiParam).subscribe(res => {
                        if (res.status == 1) {
                          let resStatus=res.result.resultInfo;
                          //console.log(resStatus);

                          if(resStatus==true){
                            this.emailNotification1()

                          }else{
                            Swal.fire({
                              icon: 'error',
                              text: resStatus
                            });
                            this.loading = false;

                          }
                        }
                      });
                    }

                  }else{
                    Swal.fire({
                      text: environment.redirectMsg,
                      showDenyButton: true,
                      showCancelButton: true,
                      confirmButtonText: 'Yes',
                      denyButtonText: `No`,
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        this.objRedirect.post(redirectArr,redirectURL);
                      } else if (result.isDenied) {
                        //Swal.fire('Changes are not saved', '', 'info')
                      }
                    })

                  //this.objRedirect.post(redirectArr,redirectURL);
                  }
                }
                return false;
              }
              else if (vType == this.saveNxtSts) {
                let docSecAvl   = (this.docSectnSts)?1:0;
                let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId+':'+docSecAvl+':'+this.financeType+':'+this.aadhaarNo+':'+this.onlineProfileId).toString());
                if(this.schemeId == environment.seedDBT)
                {
                  this.router.navigate(['/citizen-portal/seed-apply', encAppCtnId]);
                }
                else
                {
                this.router.navigate(['/citizen-portal/apicol/scheme-apply', encAppCtnId]);
                }

              }
              else {
                Swal.fire({
                  icon: 'success',
                  text: res.msg
                });
              }
            }

          else {
            profSts = 0;
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: res.msg
            });
          }
        },
          error => {
            profSts = 0;
            Swal.fire({
              icon: 'error',
              text: environment.errorMsg
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
    return profSts;
  }

  // profile image upload
  profImgUpld(e:any) {
    let file  = e.target.files;
    let fileToUpload:any='';
    let ext         = file[0].name.substring(file[0].name.lastIndexOf('.') + 1);
    let upFlSiz     = file[0].size;
    let upFlSizCnvs = Math.round((upFlSiz / 1024));
    if(this.imgExtnArr.includes(ext.toLowerCase()) == true){

      if(upFlSizCnvs <= (this.imgFileSize*1024)){
        fileToUpload = file.item(0);
        //Show image preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.profImgUrl = event.target.result;
        }
        reader.readAsDataURL(fileToUpload);
        this.isProfImgUrl = true;
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Upload image should be < ' + this.imgFileSize + ' MB'
        });
        fileToUpload = '';
        this.profImgUrl = '';
        this.isProfImgUrl=false;
      }
    }else{
      Swal.fire({
        icon: 'error',
        text: 'Upload only (jpg, jpeg, png) files'
      });
      fileToUpload = '';
      this.profImgUrl = '';
      this.isProfImgUrl=false;
    }
  }

  // go to that tab section
  goToSectn(sectnType: any) {
    let sectnUrl = '/citizen-portal/apicol/scheme-list';
    let sectnEncStr = this.route.snapshot.paramMap.get('id');
    switch (sectnType) {
      case "1":
        sectnUrl = '/citizen-portal/apicol/profile-update';
        break;
      case "2":

        if(this.schemeId == environment.seedDBT)
        {
          sectnUrl = '/citizen-portal/apicol/seed-apply';
        }
        else
        {
          sectnUrl = '/citizen-portal/apicol/scheme-apply';
        }
        break;
        case "3":

          sectnUrl = '/citizen-portal/apicol/annexure-apply';
        
        break;
      case "4":
        sectnUrl = '/citizen-portal/apicol/scheme-document';
        break;
    }
    this.router.navigate([sectnUrl, sectnEncStr]);
  }

  async emailNotification(){
    const { value: text } = await Swal.fire({
    //position: 'bottom-end',
    title: 'Enter OTP',
    input: 'text',
    inputAttributes: {
      id: "txtOTP",
      name:"txtOTP"
    },
    inputPlaceholder: 'Enter The text'
    })
    //cityId,mobileNoP
    if (text) {
    //Swal.fire(`Entered Text: ${text}`)
    let otpReference=(`${text}`);
   // console.log(otpReference);
    let mobileNoS = this.mobileNo;
    let appName = this.applicantName;
    let cityName = this.cityId;
    let scheme=this.schemeId;
    let apiParam={
      "otpReference":otpReference,
      "mobileNo":mobileNoS,
      "name":appName,
      "permanentCity":cityName,
      "schemeId":scheme
    }
    this.objProf.getRedirectSujogRegOTPAPI(apiParam).subscribe(res => {
      if (res.status == 1) {
        let resStatus=res.result.resultInfo;
       // console.log(resStatus);

        if(resStatus==true){
          alert("success1");
          this.emailNotification1()

        }else{
          Swal.fire({
            icon: 'error',
            text: resStatus
          });
          this.loading = false;

        }
      }
    });

    }
    else{
      Swal.fire(`Please Entered OTP`)
    }
  }

  async emailNotification1(){
    const { value: text } = await Swal.fire({
    //position: 'bottom-end',
    title: 'Enter Login OTP',
    input: 'text',
    inputAttributes: {
      id: "txtOTP",
      name:"txtOTP"
    },
    inputPlaceholder: 'Enter The text'
    })
    //cityId,mobileNoP
    if (text) {
    //Swal.fire(`Entered Text: ${text}`)
    let otpReference=(`${text}`);
  //  console.log(otpReference);
    let mobileNoS = this.mobileNo;
    let appName = this.applicantName;
    let cityName = this.cityId;
    let apiParam={
      "otpReference":otpReference,
      "mobileNo":mobileNoS,
      "name":appName,
      "permanentCity":cityName
    }
    this.objProf.getRedirectSujogLoginOTPAPI(apiParam).subscribe(res => {
      if (res.status == 1) {
        let resStatus=res.result.resultInfo.resStatus;
        localStorage.setItem("sujogLoginDtls", res.result.resultInfo.res);
        //console.log(localStorage.getItem("sujogLoginDtls"));

        if(resStatus==true){
          //this.objRedirect.post('https://www.google.com','');
         // alert('Successfully Login');
        }else{
          Swal.fire({
            icon: 'error',
            text: 'Login Failed'
          });
          this.loading = false;

        }
      }
    });

    }
    else{
      Swal.fire(`Please Entered OTP`)
    }
  }
  verifyKOKyc(){
    this.loading = true;
    let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
    let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let apiParam={
      "aadharId":Adharvalue,
      "processId":this.schemeId,
      "loginUser":loginInfo.USER_ID,
      "applctnId":this.applctnId,
      "onlineProfileId":this.onlineProfileId,
      "VerifyType":1
    }
    if(Adharvalue!=''){
      this.objProf.getAddressDetls(apiParam).subscribe(res=>{
        this.eMsg=res.result.resultInfo.errorMessage;
        if(res.status=='1' && res.result.resultInfo.statusCode=='200'){
          let mobileNo=res.result.resultInfo.mobileno;
          this.KMobile = res.result.resultInfo.mobileno;
          this.CrossMOb=String(this.KMobile).slice(-4);
          let otpParam={
            "mobileNo":mobileNo,
          }
          this.objProf.sendotp(otpParam).subscribe(reslt=>{

            let enctext=reslt.result.enctext;

            //sessionStorage.setItem('USER_SESSION_KO', JSON.stringify(res.result.resultInfo.response));
            this.koOTPValidate(enctext);

          });
          }
          else{
            this.loading = false;
            let msgValue="Please register yourself on <a href='https://krushak.odisha.gov.in'>Krushak Odisha</a> to apply for schemes on GO-SUGAM";
            Swal.fire({
              icon: 'error',
              text: this.eMsg
            });
          }
          this.loading = false;
      });
    }
  }
  verifyAadhaarKyc(){
    this.loading = true;
    let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
    let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let apiParam={
      "aadharNo":Adharvalue,
      "processId":this.schemeId,
      "loginUser":loginInfo.USER_ID,
      "applctnId":this.applctnId,
      "onlineProfileId":this.onlineProfileId,
      "VerifyType":1
    }
    if(Adharvalue!=''){
      this.objProf.getAadharOTPAPICOL(apiParam).subscribe(res => {
        this.loading = false;
        if (res.status == 1) {
          let resStatus=res.result.resultInfo.msgStstus;
          let resStatusMsg=res.result.resultInfo.errMsg;
          let transNo=res.result.resultInfo.transNo;
         
          if(resStatus=='SUCCESS'){
            this.aadharOTPValidate(transNo)
          }else{
            let resData=res.result.resultInfo.resData.table;
            Swal.fire({
              html: resData,
              title: resStatusMsg, // Optional title
              // text: resStatusMsg,
              width: '700px', // Set the width
              padding: '1em', // Optional padding
              customClass: {
                popup: 'custom-popup',// Optional for custom styles
                icon: 'custom-icon' // Custom class for the icon
              }
            }).then((res) => {
              if (res.isConfirmed) {
                // Redirect to a different page (e.g., '/home')
                this.router.navigate(['/citizen-portal/dashboard']);
              }
            });
            this.loading = false;

          }
        }
      });
    }
  }
  async koOTPValidate(enctext){
    const { value: text } = await Swal.fire({
    //position: 'bottom-end',
    //title: 'Your OTP send to Krushak Odisha Mobile No. ******'+this.CrossMOb,
    title: 'Your OTP has been sent to your Primary Mobile Number registered in Krushak Odisha',
    input: 'text',
    inputAttributes: {
      id: "txtOTP",
      name:"txtOTP"
    },
    inputPlaceholder: 'Enter The OTP'
    })
    //cityId,mobileNoP
    if (text) {
    this.loading = true;
    //Swal.fire(`Entered Text: ${text}`)
    let otpReference=(`${text}`);

    let apiParam={
      "otp":otpReference,
      "enctext":enctext
    }

    this.objProf.verifyotp(apiParam).subscribe(res => {
      this.loading = false;
      if (res.status == 1) {
        let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
        let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
        let apiParam={
          "aadharId":Adharvalue,
          "processId":this.schemeId,
          "loginUser":loginInfo.USER_ID,
          "applctnId":this.applctnId,
          "onlineProfileId":this.onlineProfileId,
          "VerifyType":2
        }
        if(Adharvalue!=''){
          this.objProf.getAddressDetls(apiParam).subscribe(res=>{
            this.KprofImgUrl = this._sanitizer.bypassSecurityTrustResourceUrl(res.result.resultInfo.profileImage);
            if(res.result.resultInfo.profileImage==''){
              this.KprofImgUrl= res.result.resultInfo.UIDimage;
              this.isProfImgUrl  = (this.KprofImgUrl!='')?true:false;
            }
            this.districtId = res.result.resultInfo.distLgCode;
            this.blockId = res.result.resultInfo.blockulb_lgdcode;
            this.gpId = res.result.resultInfo.gpLgCode;
            this.villageId = res.result.resultInfo.villageLgCode;
            this.KcastCatgName=res.result.resultInfo.castCatgName;
            this.KName = res.result.resultInfo.name;
            this.KEmail = res.result.resultInfo.emailid;
            this.KMobile = res.result.resultInfo.mobileno;
            this.CrossMOb=String(this.KMobile).slice(-4);
            this.KGender = res.result.resultInfo.gender;
            let  KODob = res.result.resultInfo.dob;
            const dateArr = KODob.split('-');
            let ngUIDDate: NgbDateStruct = {
              year: parseInt(dateArr[2]),
              month: parseInt(dateArr[1]),
              day: parseInt(dateArr[0]),
            }

            this.KDob=ngUIDDate;
            this.KCategory = res.result.resultInfo.category;
            this.KFatherName = res.result.resultInfo.fathername;
            this.KdistrictName = res.result.resultInfo.district;
            this.KblockName = res.result.resultInfo.blockulb;
            this.KgpName = res.result.resultInfo.gp;
            this.KvillageName = res.result.resultInfo.village;
            this.KvillageName = res.result.resultInfo.village;
            this.Kaddress = res.result.resultInfo.address;
            this.onlineServiceId = res.result.resultInfo.onlineServiceId;
            //this.applctnId = res.result.resultInfo.onlineServiceId;
            this.onlineProfileId = res.result.resultInfo.onlineProfileId;


          let profData = res.result.resultInfo.profileImage.replace('data:image/png;base64,','');
          this.profImgUrl = '';
          if(profData != ''){
            this.profImgUrl=this._sanitizer.bypassSecurityTrustResourceUrl(res.result.resultInfo.profileImage);
            this.isProfImgUrl=true;
          }else{
              this.profImgUrl= res.result.resultInfo.UIDimage;
              this.isProfImgUrl  = (this.KprofImgUrl!='')?true:false;
          }
          this.applicantName=res.result.resultInfo.name;
          this.emailId=res.result.resultInfo.emailid;
          this.mobileNo=res.result.resultInfo.mobileno;
          this.gender=res.result.resultInfo.gender;
          this.dob=ngUIDDate;
          this.castCatg=res.result.resultInfo.castCatgName;
          //this.fatherNm= res.result.resultInfo.fathername;
          this.districtName = res.result.resultInfo.district;
          this.blockName = res.result.resultInfo.blockulb;
          this.gpName = res.result.resultInfo.gp;
          this.villageName = res.result.resultInfo.village;
          this.address = res.result.resultInfo.address;
          this.castCatgName = res.result.resultInfo.category;
          this.aadhrMndSts=false;

            sessionStorage.setItem('USER_SESSION_KO_DATA', JSON.stringify(res.result.resultInfo.response_data));
          });
        }
        // this.districtId = res.result.resultInfo.distLgCode;
        // this.blockId = res.result.resultInfo.blockLgCode;
        // this.gpId = res.result.resultInfo.gpLgCode;
        // this.villageId = res.result.resultInfo.villageLgCode;



      }else{
        Swal.fire({
          icon: 'error',
          text: 'Please enter valid OTP'
        });
      }
    });

    }
    else{
      Swal.fire({
        icon: 'error',
        text: 'Please Entered OTP'
      });
      //Swal.fire(`Please Entered OTP`)
    }
  }
  async aadharOTPValidate(transNo){
    const { value: text } = await Swal.fire({
    //position: 'bottom-end',
    title: 'Enter OTP',
    input: 'text',
    inputAttributes: {
      id: "txtOTP",
      name:"txtOTP"
    },
    inputPlaceholder: 'Enter The text'
    })
    //cityId,mobileNoP
    if (text) {
    this.loading = true;
    //Swal.fire(`Entered Text: ${text}`)
    let otpReference=(`${text}`);
    let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
    let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    //let transNo = transNo;

    let apiParam={
      "aadharNo":Adharvalue,
      "otp":otpReference,
      "transNo":transNo,
      "processId":this.schemeId,
      "loginUser":loginInfo.USER_ID,
      "applctnId":this.applctnId,
      "onlineProfileId":this.onlineProfileId,
      "VerifyType":2

    }
    this.objProf.getAadharDetailsAPICOL(apiParam).subscribe(res => {
    
      this.loading = false;
      if (res.status == 1) {
        let resStatus=res.result.resultInfo.msgStstus;
        let errMsg=res.result.resultInfo.errMsg;
        let UIDname=res.result.resultInfo.UIDname;
        let UIDdob=res.result.resultInfo.UIDdob;
        let UIDgender=res.result.resultInfo.UIDgender;
        let UtinCaste=res.result.resultInfo.UtinCaste;
        let UvchFatherName=res.result.resultInfo.UvchFatherName;
        let UintDistrictId=res.result.resultInfo.UintDistrictId;
        let UintBlockId=res.result.resultInfo.UintBlockId;
        let UintGpId=res.result.resultInfo.UintGpId;
        let UintVillageId=res.result.resultInfo.UintVillageId;
        let UvchAddressLn1=res.result.resultInfo.UvchAddressLn1;
        let UIDimage=res.result.resultInfo.UIDimage;
        this.profImgUrl= UIDimage;
        this.isProfImgUrl  = (this.profImgUrl!='')?true:false;
        this.onlineServiceId = res.result.resultInfo.onlineServiceId;
        this.onlineProfileId = res.result.resultInfo.onlineProfileId;
        const dateArr = UIDdob.split('-');
        let ngUIDDate: NgbDateStruct = {
          year: parseInt(dateArr[2]),
          month: parseInt(dateArr[1]),
          day: parseInt(dateArr[0]),
        }
        let totDobLngth=UIDdob.split('-').length;
        if(resStatus=='SUCCESS'){
          this.aadhrMndSts=false;
          this.verifyOTP=false;
          this.applicantName=UIDname;
          this.dob=ngUIDDate;
          this.gender=UIDgender;
          this.castCatg=UtinCaste;
          this.fatherNm=UvchFatherName;
          this.districtId=UintDistrictId;
          this.blockId=UintBlockId;
          this.gpId=UintGpId;
          this.villageId=UintVillageId;
          if(totDobLngth == 3){
            this.verifyDob=true;
            this.dateType=text;
          }else{
            this.verifyDob=false;
            this.dateType='date';
            // this.verifyDob=true;
            // this.dateType='text';
          }
          if(this.districtId>0)
          {
            this.getBlockList(this.districtId,2,this.blockId );
          }
          if (this.blockId > 0) {
            this.getGpList(this.blockId,2);
          }
          if (this.gpId > 0) {
            this.getVlgList(this.gpId,2);
          }
          this.address=UvchAddressLn1;
        }else{
          Swal.fire({
            icon: 'error',
            text: errMsg
          });
          this.loading = false;

        }
      }
    });

    }
    else{
      Swal.fire({
        icon: 'error',
        text: 'Please Entered OTP'
      });
      //Swal.fire(`Please Entered OTP`)
    }
  }

  getDataSPDP(){
    let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
    if(Adharvalue!=''){
      this.loading = true;
      let apiParam={
        "aadharNo":Adharvalue,
      }
      this.objProf.getSPDPDetails(apiParam).subscribe(res => {
        this.loading = false;
        if (res.status == 1) {
          // let resStatus=res.result.resultInfo.msgStstus;
          // let errMsg=res.result.resultInfo.errMsg;
          let spdp_father_name=res.result.resultInfo.father_name;
          let spdp_citizen_name=res.result.resultInfo.citizen_name;
          let spdp_dob=res.result.resultInfo.dob;
          let spdp_id = res.result.resultInfo.spdp_id;
          let district_id = res.result.resultInfo.district_id;
          let block_id = res.result.resultInfo.block_id;
          let gp_id = res.result.resultInfo.gp_id;
          let village_id = res.result.resultInfo.village_id;
          const spdp_dateArr = spdp_dob.split('-');
          // console.log(spdp_dateArr);
          let ngUIDDate: NgbDateStruct = {
            year: parseInt(spdp_dateArr[0]),
            month: parseInt(spdp_dateArr[1]),
            day: parseInt(spdp_dateArr[2]),
          }
          let spdp_gender_name=res.result.resultInfo.gender_name;
          //console.log(ngUIDDate);
          this.applicantName=spdp_citizen_name;
          this.fatherNm=spdp_father_name;
          this.dob=ngUIDDate;
          this.gender=spdp_gender_name;
          this.spdp_id=spdp_id;
          this.districtId = district_id;
          this.blockId = block_id;
          this.gpId = gp_id;
          if(this.districtId>0)
          {
            this.getBlockList(this.districtId,2,this.blockId);
          }
          if (this.blockId > 0) {
            this.getGpList(this.blockId,2);
          }
          if (this.gpId > 0) {
            this.getVlgList(this.gpId,2);
          }
        }
      });
    }else{
      Swal.fire({
        icon: 'error',
        text: 'Please enter Aadhaar No.'
      });

    }
    // this.loading = false;
    // console.log(Adharvalue);
  }

  verifySPDPKyc(){
    this.loading = true;

    let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value.trim();
    // console.log(Adharvalue);
    // this.SPDPOTPValidate()
    let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    // console.log(loginInfo);
    let apiParam={
      "aadharNo":Adharvalue,
      "processId":this.schemeId,
      "loginUser":loginInfo.USER_ID,
      "applctnId":this.applctnId,
      "onlineProfileId":this.onlineProfileId,
      "VerifyType":1
    }
    if(Adharvalue!=''){
      if(!this.vldChkLst.validAadhar(Adharvalue) ){
        this.loading = false;
        Swal.fire({
          icon: 'error',
          text: 'Please Enter a Valid Aadhar No'
        });
        return false;
      }else{
        this.objProf.getAadharSPDPOTP(apiParam).subscribe(res => {
          this.loading = false;
          // console.log(res);
          if (res.status == 1) {
            let resStatus=res.result.resultInfo.msgStstus;
            let resStatusMsg=res.result.resultInfo.errMsg;
            let transNo=res.result.resultInfo.transNo;

            if(resStatus.toUpperCase()=='SUCCESS'){
              this.SPDPOTPValidate(transNo)
            }else{
              Swal.fire({
                icon: 'error',
                text: resStatusMsg
              });
              this.loading = false;

            }
          }
        });
      }
    }else{
      this.loading = false;
      Swal.fire({
        icon: 'error',
        text: 'Enter your Aadhar No'
      });
    }
    //
  }

  async SPDPOTPValidate(transNo:any){
    const { value: text } = await Swal.fire({
      //position: 'bottom-end',
      title: 'Enter OTP',
      input: 'text',
      inputAttributes: {
        id: "txtOTP",
        name:"txtOTP"
      },
      inputPlaceholder: 'Enter The text'
      }) ;
      // console.log(text); return false;
      if (text) {
        this.loading = true;
        //Swal.fire(`Entered Text: ${text}`)
        let otpReference=(`${text}`);
        let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
        let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
        //let transNo = transNo;

        let apiParam={
          "aadharNo":Adharvalue,
          "otp":otpReference,
          "transNo":transNo,
          "processId":this.schemeId,
          "loginUser":loginInfo.USER_ID,
          "applctnId":this.applctnId,
          "onlineProfileId":this.onlineProfileId,
          "VerifyType":2

        }
        this.objProf.getSPDPDetails(apiParam).subscribe(res => {
        //  console.log(res);
          this.loading = false;
        if (res.status == 1) {
          // let resStatus=res.result.resultInfo.msgStstus;
          // let errMsg=res.result.resultInfo.errMsg;
          let spdp_father_name=res.result.resultInfo.father_name;
          let spdp_citizen_name=res.result.resultInfo.citizen_name;
          let spdp_dob=res.result.resultInfo.dob;
          let spdp_id = res.result.resultInfo.spdp_id;
          let district_id = res.result.resultInfo.district_id;
          let block_id = res.result.resultInfo.block_id;
          let gp_id = res.result.resultInfo.gp_id;
          let village_id = res.result.resultInfo.village_id;
          this.onlineServiceId = res.result.resultInfo.onlineServiceId;
          this.onlineProfileId = res.result.resultInfo.onlineProfileId;
          const spdp_dateArr = spdp_dob.split('-');
          // console.log(spdp_dateArr);
          let ngUIDDate: NgbDateStruct = {
            year: parseInt(spdp_dateArr[0]),
            month: parseInt(spdp_dateArr[1]),
            day: parseInt(spdp_dateArr[2]),
          }
          let spdp_gender_name=res.result.resultInfo.gender_name;
          this.applicantName=spdp_citizen_name;
          this.fatherNm=spdp_father_name;
          this.dob=ngUIDDate;
          this.gender=spdp_gender_name;
          this.spdp_id=spdp_id;
          this.districtId = district_id;
          this.blockId = block_id;
          this.gpId = gp_id;
          if(this.districtId>0)
          {
            this.getBlockList(this.districtId,2,this.blockId);
          }
          if (this.blockId > 0) {
            this.getGpList(this.blockId,2);
          }
          if (this.gpId > 0) {
            this.getVlgList(this.gpId,2);
          }
          this.aadhrMndSts=false;
          this.verifyOTP=false;
        }else{
            Swal.fire({
              icon: 'error',
              text: 'Some error occur try after some!'
            });
            this.loading = false;

        }

        //   this.loading = false;
        //   if (res.status == 1) {
        //     let resStatus=res.result.resultInfo.msgStstus;
        //     let errMsg=res.result.resultInfo.errMsg;
        //     let UIDname=res.result.resultInfo.UIDname;
        //     let UIDdob=res.result.resultInfo.UIDdob;
        //     let UIDgender=res.result.resultInfo.UIDgender;
        //     this.onlineServiceId = res.result.resultInfo.onlineServiceId;
        //     this.onlineProfileId = res.result.resultInfo.onlineProfileId;
        //     const dateArr = UIDdob.split('-');
        //     let ngUIDDate: NgbDateStruct = {
        //       year: parseInt(dateArr[2]),
        //       month: parseInt(dateArr[1]),
        //       day: parseInt(dateArr[0]),
        //     }

        //     if(resStatus=='SUCCESS'){
        //       this.aadhrMndSts=false;
        //       this.verifyOTP=false;
        //       this.applicantName=UIDname;
        //       this.dob=ngUIDDate;
        //       this.gender=UIDgender;
        //     }else{
        //       Swal.fire({
        //         icon: 'error',
        //         text: errMsg
        //       });
        //       this.loading = false;

        //     }
        //   }
        });

        }
        else{
          Swal.fire({
            icon: 'error',
            text: 'Please Entered OTP'
          });
          //Swal.fire(`Please Entered OTP`)
        }
  }
  ngAfterViewInit(): void {
    // console.log(123)
    this.isButtonVisible = true; // Show the button after the view is fully initialized
  }
}
