import { Component, OnInit, Injectable, ElementRef,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { CitizenProfileService } from '../../service-api/citizen-profile.service';
import { PmksyService } from '../../pmksy/service-api/pmksy.service';
import { ValidatorchklistService } from '../../../validatorchklist.service';
import { RedirectService } from '../../../redirect.service';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { CitizenMasterService } from '../../service-api/citizen-master.service';
import { NgbDateParserFormatter, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { formatDate } from '@angular/common';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import FuzzySet from 'fuzzyset';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from "moment";
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_ASYNC_VALIDATORS, Validators, UntypedFormArray } from '@angular/forms';

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
export class ProfileUpdateComponent implements OnInit {

  dob: NgbDateStruct;
  DateOfB: NgbDateStruct;
  loading = false;
  responseSts: any;
  responseProfile: any;
  schemeId: any;
  applicantId: any;
  applctnId: any;
  applicantName = '';
  institutionName = '';
  spdp_id = '';
  emailId = '';
  emailIdSts = false;
  mobileNo = '';
  aadhaarNo = '';
  gender = '';
  physicalDisabled = '';
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
  physicalList: any[] = [];
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
  @ViewChild('someAppliedModal') someAppliedModal: ElementRef;
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
  verifyDob = true;
  dateType = 'text';
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
  PMKSY_SCHEME=environment.PMKSY_SCHEME;
  AADHAAR_BASED_LOGIN_SCHEME=environment.AADHAAR_BASED_LOGIN_SCHEME;
  physical:any = '';
  farmerType=environment.farmerType;
  farmerTypeDetails=environment.farmerTypeDetails;
  clusterType=environment.clusterType;
  castFarmerType  = '';
  clusterFarmerType  = '';
  pmFarmerType : any = '';
  pmClusterType : any = '';
  castLandArea = '';
  landArea=environment.landArea;
  landAreaa : any = '';
  fTypeId:any='';
  clusterDiv = false;
  institutionDiv = false;
  koAadharLogin = 0;
  textOTP = '';
  farmerTypeName = '';
  farmerTypeArea='';
  KOaccountholderrelation :any= '';
  accountholderrelationId :number=0;
  getExistPMKSYDate:any='';
  allowAppliedArea=0;
  sendKOmobIfAreaExist='';
  schemeForm = new UntypedFormGroup({});
  constructor(
    private router: Router, private route: ActivatedRoute, private encDec: EncryptDecryptService, private objMstr: CitizenMasterService, private objProf: CitizenProfileService, public vldChkLst: ValidatorchklistService, private el: ElementRef, private objRedirect: RedirectService,private _sanitizer: DomSanitizer, private objPMKSY:PmksyService,private modalService: NgbModal
  ) { }

  //constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit(): void { 
    let schmSesnInfo  = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    this.schemeName   = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType   = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;
    this.schemeTypeId = schmSesnInfo.FFS_APPLY_SCHEME_TYPE_ID;
    this.intSPDPStatus = schmSesnInfo.FFS_APPLY_SPDP;

    this.aadhrMndSts  = (this.schemeTypeId==environment.constScheme) ? true : false;
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    
    if(farmerInfo['LOGIN_THROUGH'] == 1){ 
      this.koAadharLogin = 1;
    }

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
    // this.intSPDPStatus = (schemeArr[5] != undefined && schemeArr[5] == 1) ? true : false;
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
    setTimeout(()=>{
      this.getFarmrInfo();
 }, 1000);

this.time1 = {hour: 15, minute: 58, second: 55};

const currentObj = this;

    const currentYear = new Date();
    const pastDate = new Date(currentYear.getFullYear() - 18, currentYear.getMonth()+1, currentYear.getDate());
    this.minDate =  { year: 1900, month: 1, day: 1 }
    this.maxDate =  { year: pastDate.getFullYear(), month: pastDate.getMonth()+1, day: pastDate.getDate() }
   
  }
  goToBack() {
    // let bckUrl = '/citizen-portal/scheme-list';
    // this.router.navigate([bckUrl]);
    window.history.back();
  }
  open(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getFarmerType(fTypeId:any){
    if(fTypeId==4){
      this.clusterDiv=true;
      this.institutionDiv=false;
      this.institutionName=''
    }else if(fTypeId==5){
      this.clusterDiv=false;
      this.institutionDiv=true;
      this.clusterFarmerType = '';
    }else{
      this.clusterDiv=false;
      this.institutionDiv=false;
      this.clusterFarmerType = '';
      this.institutionName=''
    }

    
    if(this.koAadharLogin==1){
      this.getExistApplicationDetls();      
    }
  }
  getExistApplicationDetls(){
    this.loading=true;
    let adharVal=$('.clsKoAadhaarNo').val();
    // if(this.koAadharLogin==1){
    //   let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    //   let adharVal=loginInfo['USER_AADHAAR'];
    // }else{
    //   console.log($('.clsKoAadhaarNo').val()); 
    // }
      let fTypeId = $('.selFarmerTypes').val(); 
      let param = {
        "fTypeId": fTypeId,
        "aadhaar":adharVal
      }
      this.objPMKSY.getExistApplicationDetls(param).subscribe(res=>{
        this.loading=false;
        if(res.result.resultInfo.statusCode=='404'){
          this.open(this.someAppliedModal);
          this.getExistPMKSYDate=res.result.resultInfo.getExistPMKSYDate;
          this.farmerTypeName=(fTypeId==1)?'Small/Marginal Farmer':'Big Farmer';
          this.farmerTypeArea=(fTypeId==1)?'2':'5';
          this.allowAppliedArea=res.result.resultInfo.totApplicableArea;
          //this.sendKOmobIfAreaExist=res.result.resultInfo.mobileno;
          this.sendKOmobIfAreaExist=this.mobileNo;
          if(res.result.resultInfo.totApplicableArea==0){
            this.aadhrMndSts=true;
          }
        }        
      });
  }
  getGenderList(constKey: any) {
    let currObj = this;
    this.getMasterList(constKey);
    this.mstrDt.subscribe(resp => {
      currObj.genderList = resp;      
    })
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

    let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    
    let checkAadhaarLoginScheme = this.AADHAAR_BASED_LOGIN_SCHEME.includes(this.schemeId);
    if(loginInfo['LOGIN_THROUGH'] == 1 && checkAadhaarLoginScheme == true){
          let apiParam = {
            "aadharId":loginInfo['USER_AADHAAR']
          }
          this.objPMKSY.getKOAddressDetlseditApp(apiParam).subscribe(res=>{
            this.verifyOTP=false;
            this.aadhrMndSts=false; 
            if(res.result.resultInfo.response_data){
              sessionStorage.setItem('USER_SESSION_KO_DATA', JSON.stringify(res.result.resultInfo.response_data));              
              // this.profImgUrl = res.result.resultInfo.response_data.profile_image;
              // console.log(this.profImgUrl);
            }else{
              this.loading = false;
              Swal.fire({
                icon: 'error',
                text: 'Some error happened. Please try again'
              });
            }
            
          });
          //End///
        } 
    //  console.log(JSON.parse(sessionStorage.getItem('USER_SESSION_KO_DATA')));

    let params = {
      "profileId": this.applicantId != null ? this.applicantId : (checkAadhaarLoginScheme == true ? loginInfo['USER_ID'] : ''),
      "applicationId":this.applctnId,
      "schemeId":this.schemeId,
      "subConstKey":"MKUY_CATEGORY",
      "tinLoginThroughSts" : loginInfo['LOGIN_THROUGH'] == 1 ? loginInfo['LOGIN_THROUGH'] : 0,
      "aadhaarNo": loginInfo['USER_AADHAAR'] != '' ? loginInfo['USER_AADHAAR'] : ''
    };
    this.loading = true;

    this.getGenderList('GENDER_LIST');
    this.getPhysicalDisableData('PHYSICALLY_DISABLED');
    this.getCatgList('CASTE_CATEGORY');
    this.getDistList();

    this.objProf.profileBuild(params).subscribe(res => {
      this.responseProfile=res;
      this.responseSts = res.status; 
      if (res.status > 0 && res.result.profileInfo.applicantId>0) {
        this.loadProfile(this.responseProfile);
        /*let accInfo = JSON.parse(sessionStorage.getItem('USER_SESSION_KO_DATA'));
        this.accountholderrelationId=(accInfo)?accInfo.accountholderrelationId:0;
        if(this.accountholderrelationId == 5){
          this.loadProfile(this.responseProfile);
        }else{
          this.loading = false;
          let msgValue="Dear User,<br> Your self bank details have not been registered in KO. Please provide your own bank details to avail the PDMC facility. Do you want to proceed?";
          Swal.fire({
              icon: 'error',
              html: msgValue,
              showDenyButton: true,
              confirmButtonText: "Yes",
              denyButtonText: "No"
            }).then((result) => {                
                if (result.isConfirmed) {
                  this.loadProfile(this.responseProfile);
                }else{
                  this.router.navigate(['/citizen-portal/dashboard']);
                }
            });         
          
        }*/        
      }else{
        this.loading = false;
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
  loadProfile(res:any){
      let resProfInfo = res.result['profileInfo'];
      // get profile info 
      this.applicantId = resProfInfo['applicantId'];
      this.castFarmerType = resProfInfo['farmerType']?resProfInfo['farmerType']:'';
      this.institutionName = resProfInfo['vchInstitutionName']?resProfInfo['vchInstitutionName']:'';
      this.clusterFarmerType = resProfInfo['intClusterType']?resProfInfo['intClusterType']:'';
      this.applicantName = resProfInfo['applicantName'];
      this.emailId = resProfInfo['emailId'];
      this.emailIdSts = (resProfInfo['emailId'] != '') ? true : false;
      this.mobileNo   = resProfInfo['mobileNo'];
      this.aadhaarNo  = (resProfInfo['aadhaarNo'])?resProfInfo['aadhaarNo']:this.odishaoneaadhar;
      this.castLandArea = resProfInfo['landArea']?resProfInfo['landArea']:0;
      if(this.aadhaarNo != ''){
      this.verifyOTP = false;
        this.aadhrMndSts=false;
        //get KO details when edit mode of the application
        let apiParam = {
          "aadharId":this.aadhaarNo
        }
        this.objPMKSY.getKOAddressDetlseditApp(apiParam).subscribe(res=>{
          this.verifyOTP=false;
          if(res.result.resultInfo.response_data){
            sessionStorage.setItem('USER_SESSION_KO_DATA', JSON.stringify(res.result.resultInfo.response_data));
            this.getExistApplicationDetls(); 
          }else{
            this.loading = false;
            Swal.fire({
              icon: 'error',
              text: 'Some error happened. Please try again'
            });
          }
          
        });
        //End///
      }
      if(this.castFarmerType){
        if(this.castFarmerType == '4'){
          this.clusterDiv=true;
          this.institutionDiv=false;
        }else if(this.castFarmerType == '5'){
          this.clusterDiv=false;
          this.institutionDiv=true;
        }else{
          this.clusterDiv=false;
          this.institutionDiv=false;
        }
      }
      this.fatherNm   = resProfInfo['fatherNm'];
      this.gender = resProfInfo['gender'];
      this.physical = resProfInfo['physicalDisabled'];
      this.castCatg   = resProfInfo['castCatg'];
      //this.castCatgName   = resProfInfo['castCatgName'];
      this.castCatgName   = environment.ko_categoryType[this.castCatg];
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
      let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      let checkAadhaarLoginScheme = this.AADHAAR_BASED_LOGIN_SCHEME.includes(this.schemeId);
      if(loginInfo['LOGIN_THROUGH'] == 1 && checkAadhaarLoginScheme == true){
        let aadhaarInfo = JSON.parse(sessionStorage.getItem('USER_SESSION_KO_DATA'));
        let profData  =  resProfInfo['profPic'].replace('data:image/png;base64,','');
        this.isProfImgUrl  = (profData!='')?true:false;
        this.profDefImgUrl = aadhaarInfo['profile_image'];
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
      this.loading = false;
  }
  // update farmer basic info
  updFarmerInfo(vType: any) {
    let pmFarmerType = this.castFarmerType;
    let pmClusterType = this.clusterFarmerType;
    let profIdP = this.applicantId;
    let applicantNmP = this.applicantName;
    let institutionNmP = this.institutionName;
    let emailIdP = this.emailId;
    let mobileNoP = (this.mobileNo)?this.mobileNo:this.aadherMob;
    let genderP = this.gender;
    let checkAadhaarLoginScheme = this.AADHAAR_BASED_LOGIN_SCHEME.includes(this.schemeId);
    // let dobP:any='';
    // if(this.dateType=='date'){
    //   dobP = this.dob;
    // }else{      
    //   dobP = NgbDateCustomParserFormatter.formatDateStr(this.dob);
    // }
    //console.log('sasasa'+this.castCatg);
    let dobP = NgbDateCustomParserFormatter.formatDateStr(this.dob);
    let castCatgP = this.castCatg;
    let fatherNmP = this.fatherNm;
    let physicalD = this.physical;
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
    let replaceArr = { "[farmerType]": pmFarmerType,"[frmname]": applicantNmP, "[frmmob]": mobileNoP, "[frmmail]": emailIdP, "[frmfather]": fatherNmP, "[frmaadhar]": aadhaarNoP, "[frmgender]": genderP, "[frmdob]": dobP, "[frmcity]": cityId };
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
    if(this.PMKSY_SCHEME.includes(this.schemeId)){
      if (!this.vldChkLst.selectDropdown(pmFarmerType, "Farmer Type") && koValidation===true) {
        vSts = false;
      }
      if(this.castFarmerType == '4'){
        if (!this.vldChkLst.selectDropdown(pmClusterType, "Cluster Type") && koValidation===true) {
          vSts = false;
        }
      }
      if(this.castFarmerType == '5'){
        if (!this.vldChkLst.blankCheck(institutionNmP, "Institution Name") && koValidation===true) {
          vSts = false;
        }
      }
    }
    else if (!this.vldChkLst.blankCheck(applicantNmP, "Applicant Name") && koValidation===false) {
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
    // else if (!this.vldChkLst.blankCheck(physicalD, "Physically Disabled")) {
    //   vSts = false;
    // }
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
    const year = parseInt(dobArray[0]);
    const month = parseInt(dobArray[1]);
    const day = parseInt(dobArray[2]);
    var end  = moment([year,month,day]);
    const yearsDiff = now.diff(end, 'years');

    if (yearsDiff < 18) {
      Swal.fire({
        icon: 'error',
        text: 'Your date of birth should be more 18 years'
      });
      vSts = false;
    }
    if (!vSts) {
      return vSts;
    }
    else {
      this.loading = true;
      let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      let profImg=(this.profImgUrl['changingThisBreaksApplicationSecurity'])?this.profImgUrl['changingThisBreaksApplicationSecurity']:this.profImgUrl;
      let profParam = {
        "profId": loginInfo.USER_ID,
        "farmerType":pmFarmerType,
        "fullName": applicantNmP,
        "institutionName": institutionNmP,
        "clusterType": pmClusterType,
        "mobNo":mobileNoP,
        "emailId": emailIdP,
        "gender": genderP,
        "dob": dobP,
        "castCatg": castCatgP,
        "aadhaarNo": aadhaarNoP,
        "aadhrMndSts":this.aadhrMndSts,
        "fatherNm": fatherNmP,
        "physicalD": physicalD,
        "districtId": districtIdP,
        "blockId": blockIdP,
        "gpId": gpIdP,
        "villageId": villageIdP,
        "address": addressP,
        "profImgUrl": profImg,
        "draftSts": vType,
        "redirectURL": redirectURL,
        "serviceModeId": serviceModeId,
        "arrayOfUrl":arrayRedUrl,
        "schemeId":schemeId,
        "onlineProfileId":this.onlineProfileId,
        "applctnId":this.applctnId,
        "schemeTypeId":(loginInfo['LOGIN_THROUGH'] == 1 && checkAadhaarLoginScheme == true ? 0 :this.schemeTypeId),
        "spdp_id":this.spdp_id,
        "tinLoginThroughSts":(loginInfo['LOGIN_THROUGH'] == 1 && checkAadhaarLoginScheme == true ? 1  :0 )
      };
      // console.log(profParam);
      //return false;
      // update(searchInput: string) {
      //   setTimeout(() => {
      //     this.myService.search(searchInput)
      //     .subscribe((res) => {
      //       this.myArray.content = res;
      //     });
      //   }, 400);
      // }
      this.objProf.profileUpdate(profParam).subscribe(res => {
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
              if(applicationId == 0 ){
                Swal.fire({
                  icon: 'error',
                  text: 'Unable to proceed. Please try again.'
                });
                this.loading = false;
                return false;
              }
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
              let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId+':'+docSecAvl).toString());
              if(this.schemeId == environment.seedDBT)
              {
                this.router.navigate(['/citizen-portal/seed-apply', encAppCtnId]);
              }
              else
              {
              this.router.navigate(['/citizen-portal/pmksy/scheme-apply', encAppCtnId]);
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
    let sectnUrl = '/citizen-portal/scheme-list';
    let sectnEncStr = this.route.snapshot.paramMap.get('id');
    switch (sectnType) {
      case "1":
        sectnUrl = '/citizen-portal/pmksy/profile-update';
        break;
      case "2":

        if(this.schemeId == environment.seedDBT)
        {
          sectnUrl = '/citizen-portal/seed-apply';
        }
        else
        {
          sectnUrl = '/citizen-portal/pmksy/scheme-apply';
        }
        break;
      case "3":
        sectnUrl = '/citizen-portal/pmksy/scheme-document';
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
    if(this.PMKSY_SCHEME.includes(this.schemeId)){
      this.fTypeId = (document.getElementById('farmer_type_id') as HTMLTextAreaElement).value;
      if(this.fTypeId <=0){
        Swal.fire({
          icon: 'error',
          text: 'Select Farmer Type'
        });
        this.loading = false;
        return false;
      }
    }else{
      this.fTypeId =0;
    }
    if(Adharvalue==''){
      Swal.fire({
        icon: 'error',
        text: 'Enter Aadhaar No'
      });
      this.loading = false;
      return false;
    }
    
    let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let apiParam={
      "aadharId":Adharvalue,
      "processId":this.schemeId,
      "loginUser":loginInfo.USER_ID,
      "applctnId":this.applctnId,
      "onlineProfileId":this.onlineProfileId,
      "VerifyType":1,
      "fTypeId":this.fTypeId
    }
    if(Adharvalue!=''){
      this.objProf.getAddressDetls(apiParam).subscribe(res=>{
        this.eMsg=res.result.resultInfo.errorMessage;
        this.KOaccountholderrelation=res.result.resultInfo.accountholderrelationId;
        if(res.status=='1' && res.result.resultInfo.statusCode=='200'){
          let mobileNo=res.result.resultInfo.mobileno;
          this.KMobile = res.result.resultInfo.mobileno;
          this.CrossMOb=String(this.KMobile).slice(-4);
          let otpParam={
            "mobileNo":mobileNo,
          }
          this.objProf.sendotp(otpParam).subscribe(reslt=>{
            let enctext=reslt.result.enctext;
            let otp =  reslt.result.otp;
            this.textOTP = reslt.result.otp;
            //console.log(reslt.result.otp);
            //sessionStorage.setItem('USER_SESSION_KO', JSON.stringify(res.result.resultInfo.response));
            this.koOTPValidate(enctext,otp);
          });
          }else if(res.result.resultInfo.statusCode=='404'){
            this.open(this.someAppliedModal);
            this.getExistPMKSYDate=res.result.resultInfo.getExistPMKSYDate;
            this.farmerTypeName=(this.fTypeId==1)?'Small/Marginal Farmer':'Big Farmer';
            this.farmerTypeArea=(this.fTypeId==1)?'2':'5';
            this.allowAppliedArea=res.result.resultInfo.totApplicableArea;
            this.sendKOmobIfAreaExist=res.result.resultInfo.mobileno;
          }
          /*else if(res.status=='1' && res.result.resultInfo.statusCode=='200' && this.KOaccountholderrelation!=5){
            let mobileNo=res.result.resultInfo.mobileno;
            let msgValue="Dear User,<br> Your self bank details have not been registered in KO. Please provide your own bank details to avail the PDMC facility. Do you want to proceed?";
            Swal.fire({
              icon: 'error',
              html: msgValue,
              showDenyButton: true,
              confirmButtonText: "Yes",
              denyButtonText: "No"
            }).then((result) => {
                if (result.isConfirmed) {
                  this.loading = true;
                  let otpParam={
                    "mobileNo":mobileNo,
                  }
                  this.objProf.sendotp(otpParam).subscribe(reslt=>{
                    this.loading = false;
                    let enctext=reslt.result.enctext;
                    let otp =  reslt.result.otp;
                    this.textOTP = reslt.result.otp;
                    this.koOTPValidate(enctext,otp);
                  });
                } else if (result.isDenied) {
                }
            });
          }*/
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
    }else{
      Swal.fire({
        icon: 'error',
        text: 'Enter Aadhaar No'
      });
      this.loading = false;
    }
  }
  verifyKOKyc2No(){
    this.modalService.dismissAll();
  }
  verifyKOKyc2(mobileNo){
    this.loading = true;
      this.KMobile =mobileNo ;
      this.CrossMOb=String(this.KMobile).slice(-4);
      let otpParam={
        "mobileNo":mobileNo,
      }
      this.objProf.sendotp(otpParam).subscribe(reslt=>{
        let enctext=reslt.result.enctext;
        let otp =  reslt.result.otp;
        this.textOTP = reslt.result.otp;
        this.modalService.dismissAll();
        this.loading = false;
        this.koOTPValidate(enctext,otp);
      });
  }
  verifyAadhaarKyc(){
    this.loading = true;
    let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
    if(this.PMKSY_SCHEME.includes(this.schemeId)){
      this.fTypeId = (document.getElementById('farmer_type_id') as HTMLTextAreaElement).value;
    }else{
      this.fTypeId =0;
    }
    
    let loginInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let apiParam={
      "aadharNo":Adharvalue,
      "processId":this.schemeId,
      "loginUser":loginInfo.USER_ID,
      "applctnId":this.applctnId,
      "onlineProfileId":this.onlineProfileId,
      "VerifyType":1,
      "fTypeId":this.fTypeId
    }
    if(Adharvalue!=''){
      this.objProf.getAadharOTP(apiParam).subscribe(res => {
        this.loading = false;
        if (res.status == 1) {
          let resStatus=res.result.resultInfo.msgStstus;
          let resStatusMsg=res.result.resultInfo.errMsg;
          let transNo=res.result.resultInfo.transNo;

          if(resStatus=='SUCCESS'){
            this.aadharOTPValidate(transNo)
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
  }
  async koOTPValidate(enctext,otp){
   
    const { value: text } = await Swal.fire({
    //position: 'bottom-end',
    //title: 'Your OTP send to Krushak Odisha Mobile No. ******'+this.CrossMOb,
    title: 'Your OTP has been sent to your Primary Mobile Number registered in Krushak Odisha',
    input: 'text',
    inputValue: otp,
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
    this.textOTP = otp;
    let ifscCodeKoId ='txtOTP';
    ( < HTMLInputElement > document.getElementById(ifscCodeKoId)).value = otp;
    this.schemeForm.patchValue({ [ifscCodeKoId]: otp});

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
          this.fatherNm= res.result.resultInfo.fathername;
          this.districtName = res.result.resultInfo.district;
          this.blockName = res.result.resultInfo.blockulb;
          this.gpName = res.result.resultInfo.gp;
          this.villageName = res.result.resultInfo.village;
          this.address = res.result.resultInfo.address;
          //this.castCatgName = res.result.resultInfo.category;
          this.castCatgName = environment.ko_categoryType[res.result.resultInfo.castCatgName];
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
    this.objProf.getAadharDetails(apiParam).subscribe(res => {
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
        let email = res.result.resultInfo.UEmailId;
        this.spdp_id=res.result.resultInfo.spdp_id;
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
          this.emailId = email;
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
}
