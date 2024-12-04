import { Component, OnInit ,ElementRef, Injectable, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_ASYNC_VALIDATORS, Validators, UntypedFormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { isNumber } from 'util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { empty, of } from 'rxjs';
import { trigger } from '@angular/animations';
import { NgbDateParserFormatter, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ErrorStateMatcher } from '@angular/material/core';
import { inArray } from 'jquery';
import { ApiService } from 'src/app/website/seed-dbt-apply/api.service';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { WebsiteApiService } from 'src/app/website/website-api.service';

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
  selector: 'app-seed-dbt-apply',
  templateUrl: './seed-dbt-apply.component.html',
  styleUrls: ['./seed-dbt-apply.component.css'],
  providers: [ValidatorchklistService, NgbDateCustomParserFormatter]
})
export class SeedDbtApplyComponent implements OnInit {
  
  loading = false;
  schemeDmgForm = new UntypedFormGroup({});
  schemeForm = new UntypedFormGroup({});
  arrBags :any = [];
  schemeId: any;
  totQunatInHect:number =0;
  respSts: any;
  result : any;
  respDynm: any;
  applctnSts: any;
  apprRsmSts: any;
  dynElement: any = [];
  dynAddMoreElement: any = [];
  dynClass: any = [];
  empRadioValue: any[] = [];
  applicantId: any;
  applctnId: any;
  mainSectnId: any;
  controlTypeArr: any = [];
  responseSts: any;
  responseDynm: any;
  responseInfo: any;
  isDraft = false;
  Banks: any[];
  loanBanks: any[];
  BankNames: any;
  ifscForm: any;
  ifscLoanForm: any;
  DistrictNames: any;
  distdataNew: any;
  appDraftSts = environment.constDrftSts;
  appPrevwSts = environment.constPrevwSts;
  ifscSubmitted = false;
  ifscLoanSubmitted = false;
  isIFSCFlag = false;
  isLoanIFSCFlag = false;
  error: any;
  searchform = new UntypedFormGroup({});
  intdirectorate =0;
  schemeName = null;
  schemeType = null;
  apiCropVarietyResult ='';
  districtId = 0;
  blockId = 0;
  gpId = 0;
  villageId = 0;
  tahasilId: any = '';
  ror: any = '';
  vtOfcrId = 0;
  districtList: any[] = [];
  blockList: any[] = [];
  vlgList: any[] = [];
  gpList: any[] = [];
  vtofcrList: any[] = [];
  scmFrmAdmObj: any = {};
  isServcFlg: boolean = false;
  addmoreArr: any[] = [];
  jsnFormulaCalculation: any[] = [];
 dealerArr:any[] = [];
  lang = '';
  marineType = 0;
  distLabel = 'District';
  blockLabel = 'Block / ULB';
  gpLabel = 'GP / Ward';
  schemeTypeId = 0;
  loantype = 0;
  BankId = 0;
  totalQuantValidation =0;
  responseSeedAvailable = '';
  seedPriceList  =''; 
  arrLicenceNo : any=[];
  IsmodelShow  = false;
  removeOption = ["bhulekh_tahasil"];
  typeOfSeedOptions = [];
  typeOfVarietyOptions   = [];
  seedDBTPaddytotalQuantity:number;
  seedDBTNonPaddytotalQuantity:number;
  voucherViewStatus :number;
  selectedOptValue =0;
  beforeAppliedQuantity = 0;
  @ViewChild('someModal') someModalRef: ElementRef;
  @ViewChild('someLoanModal') someLoanModalRef: ElementRef;
  @ViewChild('someSeedDBTModal') someSeedDBTModalRef: ElementRef;
  docSectnSts = false; // document section display/ not
  isMobile = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private objSchmCtrl: CitizenSchemeService,
    private encDec: EncryptDecryptService,
    private apilist: WebsiteApiService,
    public vldChkLst: ValidatorchklistService,
    private el: ElementRef,
    private modalService: NgbModal,
    private objMstr: CitizenMasterService,
    private fb: UntypedFormBuilder,
    private objSeedService:ApiService) { }

  ngOnInit(): void {
    this.isMobile = this.mobileCheck();
    let schmSesnInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    
    this.schemeName = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;
    this.schemeTypeId = schmSesnInfo.FFS_APPLY_SCHEME_TYPE_ID;

    let schmSesnArr = {};
    schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = this.schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = this.schemeType;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = this.schemeTypeId;

    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
     schmSesnInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));

  
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    //console.log(schemeArr);
    this.schemeId = schemeArr[0];
    this.applctnId = schemeArr[1];
    this.getSchmDmgCtrls();
    this.getSchmDynmCtrls();
    this.lang = localStorage.getItem('locale');
    this.getSeedDBTReapplyStatus();
  
    
    setTimeout(() => {
      $('.seedApplydealerName').css("width","200px");
      $('.seed-type,.seed-variety').css("width","150px");
      $('.seed-bagsize').css("width", "60px");
      $('.seed-noofbag').css("width", "50px");
      $('.seed-quantity,.seedFinalTotCost,.seed-total-cost,.payableAmtFarmer').css("width", "100px");
      
     
      let seedSchemeTypeElement = < HTMLElement > document.querySelector(".seedSchemeType");
      var currrrObj = this;
      document.getElementById(seedSchemeTypeElement.id).addEventListener("change", function() { 
        currrrObj.removeRetailer('','','',1);
        });
    }, 1500);
    
  }


  mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
  };

  getSchmDmgCtrls() {
    let scmDmgFrmObj: any = {};
    scmDmgFrmObj["selDistrict"] = new UntypedFormControl('');
    scmDmgFrmObj["selBlock"] = new UntypedFormControl('');
    scmDmgFrmObj["selGp"] = new UntypedFormControl('');
    scmDmgFrmObj["selVillage"] = new UntypedFormControl('');
    scmDmgFrmObj["selVtOfcr"] = new UntypedFormControl('');
    this.schemeDmgForm = new UntypedFormGroup(scmDmgFrmObj);
  }

  getSchmDynmCtrls() {
    let scmFrmObj: any = {};
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applicationId": this.applctnId,
      "mainSectionId": 0
    };
    this.loading = true;
    this.objSchmCtrl.schemeDynCtrls(params).subscribe(res => {
      this.respSts = res.status;
      this.respDynm = res.result['ctrlArr'];
     
      this.applctnSts = res.result['applctnSts'];
      if (res.status > 0) {
        this.getDistList();
        let schmHrDt = res.result['schmSrvArr'];
        this.apprRsmSts = (schmHrDt.hasOwnProperty('apprRsmSts')) ? schmHrDt.apprRsmSts : 0;
        this.districtId = (schmHrDt.hasOwnProperty('districtId')) ? schmHrDt.districtId : 0;
        this.blockId = (schmHrDt.hasOwnProperty('blockId')) ? schmHrDt.blockId : 0;
        this.BankId = (schmHrDt.hasOwnProperty('BankId')) ? schmHrDt.BankId : 0;
        this.gpId = (schmHrDt.hasOwnProperty('gpId')) ? schmHrDt.gpId : 0;
        this.villageId = (schmHrDt.hasOwnProperty('villageId')) ? schmHrDt.villageId : 0;
        this.vtOfcrId = (schmHrDt.hasOwnProperty('vtOfcrId')) ? schmHrDt.vtOfcrId : 0;
        this.marineType = (schmHrDt.hasOwnProperty('marineType')) ? schmHrDt.marineType : 0;
        this.docSectnSts = (schmHrDt.hasOwnProperty('schmServDocSctn')) ? schmHrDt.schmServDocSctn : 0;
        let directorate = (schmHrDt.hasOwnProperty('directorate')) ? schmHrDt.directorate : 0;
        this.intdirectorate = directorate;
        this.apprRsmSts     = (this.schemeId ==  environment.seedDBT) ? 1 :  this.apprRsmSts;
        this.isServcFlg = (this.schemeTypeId == environment.constService && directorate == 2) ? true : false;
        if (schmHrDt.hasOwnProperty('sector')) {
          if (schmHrDt.sector == 1) {
            this.marineType = 1;
            this.distLabel = 'Marine Jurisdiction';
            this.blockLabel = 'Marine Extension';
            this.gpLabel = 'FLC / FH';
          }
          else if (schmHrDt.sector == 3) {
            this.marineType = 2;
            this.distLabel = 'District / Marine Jurisdiction';
            this.blockLabel = 'Block / ULB / Marine Extension';
            this.gpLabel = 'GP / Ward / FLC / FH';
          }

        }
        let distData: any;
        if (this.districtId == 0) {
          distData = '0';
        }
        else {
          distData = { "val": this.districtId, "type": this.marineType };
          distData = JSON.stringify(distData);
        }
        this.distdataNew = distData;
        this.schemeDmgForm.patchValue({
          'selDistrict': distData,
          'selBlock': this.blockId,
          'selGp': this.gpId,
          'selVillage': this.villageId,
          'selVtOfcr': this.vtOfcrId,
        });
        if (this.districtId > 0) {

          this.getBlockList(distData);
        }
        if (this.blockId > 0) {
          this.getVtOfcrList(this.blockId);
          this.getGpList(this.blockId);
        }
        if (this.gpId > 0) {
          this.getVlgList(this.gpId);
        }
        // start get dynamic ctrl value

        for (let sectnInfo in this.respDynm) {

          for (let ctrlInfo in this.respDynm[sectnInfo]['sectionCtrls']) {
            let ctrlArr = this.respDynm[sectnInfo]['sectionCtrls'][ctrlInfo];
            let ctrlNm = ctrlArr['jsnControlArray'][0]['ctrlName'];
            let ctrlClass = ctrlArr['jsnControlArray'][0]['ctrlClass'];
           
            if(ctrlArr['jsnFormulaCalculation']!=''){
              let  calculationArr = ctrlArr['jsnFormulaCalculation']['0']['inputVar'];
              var cnt = 0;
              let newCalArr = [];
              for (let  calculation in calculationArr) {
                newCalArr[cnt] = calculationArr[calculation].selFieldVar
               
                cnt++;
                // console.log(calculationArr[calculation].selFieldVar);
               
              }
              this.jsnFormulaCalculation[ctrlNm] = newCalArr
              //
               //console.log(newCalArr);
            }
            if (ctrlClass == 'bhulekh_tahasil') {
              this.tahasilId = ctrlNm;
            }
            if (ctrlClass == 'bhulekh_ror') {
              this.ror = ctrlNm;
            }
            // this.dynClass[ctrlNm] = ctrlClass;
            // start of ctrl add more type
     
            if (ctrlArr['tinControlType'] == 8 ) {

              let addCtrlVal = ctrlArr['jsnControlArray'][0]['ctrlValue'];
              let addMoreFldVal = ctrlArr['vchFieldValue'] != '' ? ctrlArr['vchFieldValue'] : addCtrlVal != '' ? addCtrlVal : '';
              this.dynAddMoreElement[ctrlNm] = { "val": addMoreFldVal, "ctrlType": ctrlArr['tinControlType'], "dispTagArr": ctrlArr['jsnDispTagArray'][0] };
              let ctrlVal = (ctrlArr['vchFieldValue'] != '') ? ctrlArr['vchFieldValue'] : [];
             
              if (Object.keys(ctrlVal).length > 0 ) {

                let ctrlAddMore = ctrlVal['addMoreData'];
                scmFrmObj[ctrlNm] = new UntypedFormArray([]);
                for (let addMoreInfo in ctrlAddMore) {
                  let addMrowInfo = ctrlAddMore[addMoreInfo];             
                  let addMrObj = this.fb.array([]);
                  for (let addMcolInfo in addMrowInfo) {
                    
                    let addMrVrNm = addMrowInfo[addMcolInfo]['elementId'];
                    let addMrVrVal = addMrowInfo[addMcolInfo]['elementVal'];
                    let addMrVrColTp = addMrowInfo[addMcolInfo]['colType'];
                    addMrObj.controls[addMrVrNm] = new UntypedFormControl('');
                    let ctrlDtAddMore = ctrlArr['jsnControlArray'][0]['ctrlAddMore'][addMcolInfo];
                    let cscdTagArr = { 'tagFieldSts': ctrlDtAddMore['isDependent'], 'tagFieldId': ctrlDtAddMore['parentId'], 'optionArr': ctrlDtAddMore['optionArr'], 'staticDepData': ctrlDtAddMore['staticDepData'] };
                    this.dynElement[addMrVrNm] = { "val": addMrVrVal, "ctrlType": addMrVrColTp, "dispTagArr": [], "cscdTagArr": cscdTagArr, "secCtrlType": ctrlArr['tinControlType'], "addMoreCtrlName": ctrlNm };
                  } 
                  (scmFrmObj[ctrlNm]).push(addMrObj);
                }
              }
              else {
                let ctrlAddMore = ctrlArr['jsnControlArray'][0]['ctrlAddMore'];
                scmFrmObj[ctrlNm] = new UntypedFormArray([]);
                let addMrObj = this.fb.array([]);
                let addMrow = 0;
                let addMcol = 0;
                for (let addMoreInfo in ctrlAddMore) {
                  let addMrVr = ctrlNm + '_' + addMrow + '_' + addMcol;
                  addMrObj.controls[addMrVr] = new UntypedFormControl('');
                  let addMrVrColTp = ctrlAddMore[addMcol]['columnType'];
                  let cscdTagArr = { 'tagFieldSts': ctrlAddMore[addMcol]['isDependent'], 'tagFieldId': ctrlAddMore[addMcol]['parentId'], 'optionArr': ctrlAddMore[addMcol]['optionArr'], 'staticDepData': ctrlAddMore[addMcol]['staticDepData'] };
                  this.dynElement[addMrVr] = { "val": '', "ctrlType": addMrVrColTp, "dispTagArr": [], "cscdTagArr": cscdTagArr, "secCtrlType": ctrlArr['tinControlType'], "addMoreCtrlName": ctrlNm };
                  addMcol++;
                }
                (scmFrmObj[ctrlNm]).push(addMrObj);
            }
            }
            // end of ctrl add more type
            else {
              let ctrlVal = ctrlArr['jsnControlArray'][0]['ctrlValue'];
              
              let finlFldVal = ctrlArr['vchFieldValue'] != '' ? ctrlArr['vchFieldValue'] : ctrlVal != '' ? ctrlVal : '';
              //console.log(finlFldVal);
              //console.log(ctrlArr['vchLabelName']+"===="+finlFldVal);
              this.dynElement[ctrlNm] = { "val": finlFldVal, "ctrlType": ctrlArr['tinControlType'], "dispTagArr": ctrlArr['jsnDispTagArray'][0], "cscdTagArr": ctrlArr['jsnOptionArray'][0], "secCtrlType": ctrlArr['tinControlType'],'vchLabelName':ctrlArr['vchLabelName'] };
              scmFrmObj[ctrlNm] = new UntypedFormControl('');
            }
            this.controlTypeArr[ctrlNm] = ctrlArr;
          }
        }
        //console.log(this.jsnFormulaCalculation);
        // end get dynamic ctrl value
     
        this.scmFrmAdmObj = scmFrmObj;
        this.schemeForm = new UntypedFormGroup(scmFrmObj);
        let curObj = this;
        setTimeout(function () {

          curObj.setDynamicVal();
        }, 1000);
        
       
        setTimeout(function () { 
          $('.dynAddMoreActionTh').hide(); 
          $('.btnDynAdd').remove();
          $('.btnDynMinus').remove();
          $('.dynAddMoreSlTh').remove(); 
          $('.dynTdSlnoAddMoreCls').remove();
          $('.seedApplydealerName').attr('readonly', 'readonly');  
          $('.seed-type').attr('readonly', 'readonly');
          $('.seed-variety').attr('readonly', 'readonly');
          $('.seed-bagsize').attr('readonly', 'readonly');
          $('.seed-quantity').attr('readonly', 'readonly');
	        $('.seed-total-cost').attr('readonly', 'readonly');
          $('.seed-noofbag').attr('readonly', 'readonly');
          $('.seed-total-cost').attr('readonly', 'readonly');
          $('.payableAmtFarmer').attr('readonly', 'readonly');
          $('.seedFinalTotCost').attr('readonly', 'readonly');
          let addmoreSeedElement =  document.querySelector(".seedSchemeType");
          var container = document.createElement("div");
          container.classList.add('col-md-12','col-lg-12','text-right','mb-4'); 
          container.innerHTML = '<input type="button" value="Add seed details" name="btnopenSeedDetails" id="btnopenSeedDetails" class="openSeedDetails btn btn-success " data-toggle="modal" data-target="#someSeedDBTModal" (click)="openSeedDetails()"> ';
         addmoreSeedElement.closest('.col-lg-4').after(container);
         document.getElementById('btnopenSeedDetails').addEventListener("click", function() {
          let districtIdObj: any = ( < HTMLInputElement > document.getElementById('selDistrict')).value;
          if (!curObj.vldChkLst.selectDropdown(districtIdObj, "District")) {
            return false;
          }
          curObj.openSeedDetails()
        });
         
        }, 1000);
      
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
      
     }
   
    });
    }
  setDynamicVal() {
    let dynObjKey = Object.keys(this.dynElement); 

    let addMoreCtrl = [];
    dynObjKey.forEach((field: any) => {
      if (this.dynElement[field].secCtrlType == 8) {
        // console.log(this.dynElement[field].val);
        (<HTMLInputElement>document.getElementById(field)).value = this.dynElement[field].val!=''?this.dynElement[field].val:'';
        if (!addMoreCtrl.includes(this.dynElement[field].addMoreCtrlName)) {
          addMoreCtrl.push(this.dynElement[field].addMoreCtrlName);
        }
      }
    });

    if (this.tahasilId != '' && this.tahasilId != 'undefined') {
      let tahasilVal = this.dynElement[this.tahasilId]["val"];
      if (this.districtId > 0) {
        this.fillTahasil(this.distdataNew, tahasilVal);
      }
    }
    for (let secKey in this.dynAddMoreElement) {
      let dispTagArr = this.dynAddMoreElement[secKey]["dispTagArr"];


      if (Object.keys(dispTagArr).length > 0) {

        let ctrlTagSts = dispTagArr['tagFieldSts'];
        let ctrlTagFldId = dispTagArr['tagFieldId'];
        let ctrlTagFldVlArr = dispTagArr['tagFieldArr'];
        if (ctrlTagSts == 1) {
          let ctrlPrntVal = this.dynElement[ctrlTagFldId]["val"];
          if (ctrlPrntVal != '') {
            this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 1, ctrlPrntVal, 'addMore');
          }
          else {
            this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 0, '', 'addMore');
          }
        }
      }
    }
    for (let secKey in this.dynElement) {


      let elmVal = this.dynElement[secKey]["val"];
      if (this.dynElement[secKey]["ctrlType"] == 9) {
        let dateArr = elmVal.split('-');
        let ngbDate: NgbDateStruct = {
          year: parseInt(dateArr[0]),
          month: parseInt(dateArr[1]),
          day: parseInt(dateArr[2]),
        }
        elmVal = ngbDate;
      }

      this.schemeForm.patchValue({ [secKey]: elmVal });
      //start for dynamic event functionality
      let dispTagArr = this.dynElement[secKey]["dispTagArr"];


      if (Object.keys(dispTagArr).length > 0) {

        let ctrlTagSts = dispTagArr['tagFieldSts'];
        let ctrlTagFldId = dispTagArr['tagFieldId'];
        let ctrlTagFldVlArr = dispTagArr['tagFieldArr'];
        if (ctrlTagSts == 1) {
          let ctrlPrntVal = this.dynElement[ctrlTagFldId]["val"];
          let ctrlTypeId = this.dynElement[ctrlTagFldId]["ctrlType"];
          if (ctrlPrntVal != '') {

            this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 1, ctrlPrntVal, '');
          }
          else {
            this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 0, '', '');
          }
        }
      }
      // end for dynamic event functionality

      //start for cascading event functionality
      let cscdTagArr = this.dynElement[secKey]["cscdTagArr"];
      if (Object.keys(cscdTagArr).length > 0) {
        let ctrlCdTagSts = cscdTagArr['tagFieldSts'];
        let ctrlCdTagFldId = cscdTagArr['tagFieldId'];
        let ctrlCdTagFldVlArr = cscdTagArr['optionArr'];

        if (ctrlCdTagSts == 1) {
          let ctrlPrntSecId = this.dynElement[secKey].secCtrlType;
          let ctrlSelVal = this.dynElement[secKey].val;
          let pSelVal ='0';
          let param = {
            "cscdTagArr": cscdTagArr,
            "value": pSelVal,
            "ctrlSelVal": ctrlSelVal
          }
          let dd = document.getElementById(secKey);
        //  console.log(this.dynElement);
          if (ctrlSelVal != '0' && ctrlSelVal!='' &&  ctrlSelVal!='null') {
            this.objMstr.grapCalDemoBhulekh(param).subscribe(res => {
              let dd = document.getElementById(secKey);
              if (res.status == 1) {
                dd.innerHTML = res.result.optionStr;
              } else {
                let dd = document.getElementById(secKey);
                dd.innerHTML = '<option value="">Select</option>';
              }
            },
              error => {
                let dd = document.getElementById(secKey);
                dd.innerHTML = '<option value="">Select</option>';
              });
          } else {
            dd.innerHTML = '<option value="">Select</option>';
          }
          if (ctrlPrntSecId == 8) {
            let ctrlCdTagPrntFldVlArr = cscdTagArr['staticDepData'];
            this.setAddMrCscdEvnt(ctrlCdTagFldId, secKey, ctrlCdTagFldVlArr, ctrlCdTagPrntFldVlArr, ctrlSelVal);
          }
          else {
            let ctrlPrntTypeId = this.dynElement[ctrlCdTagFldId]["ctrlType"];
            if (ctrlPrntTypeId == 2) {
              this.setDynamicCscdEvnt(ctrlCdTagFldId, secKey, ctrlCdTagFldVlArr, cscdTagArr);
            }
          }
        }
      }
      // end for cascading event functionality

    }
    if (this.ror != '' && this.ror != 'undefined') {
      let rorVal = this.dynElement[this.ror]["val"];
      let btContainer = <HTMLElement>document.querySelector(".bhulekh_tahasil");
      let bhulekh_tahasil_id = btContainer.id;
      let bhulekh_tahasil = this.dynElement[bhulekh_tahasil_id].val;

      let rcContainer = <HTMLElement>document.querySelector(".bhulekh_revenue_circle");
      let bhulekh_revenue_circle_id = rcContainer.id;
      let bhulekh_revenue_circle = this.dynElement[bhulekh_revenue_circle_id].val;

      let rvContainer = <HTMLElement>document.querySelector(".bhulekh_revenue_village");
      let bhulekh_revenue_village_id = rvContainer.id;
      let bhulekh_revenue_village = this.dynElement[bhulekh_revenue_village_id].val;


      let knContainer = <HTMLElement>document.querySelector(".bhulekh_khata_no");
      let bhulekh_khata_no_id = knContainer.id;
      let bhulekh_khata_no = this.dynElement[bhulekh_khata_no_id].val;

      

      let pnContainer = <HTMLElement>document.querySelector(".bhulekh_plot_no");
      let bhulekh_plot_no_id = pnContainer.id;
      let bhulekh_plot_no = this.dynElement[bhulekh_plot_no_id].val;
      if (bhulekh_tahasil > 0 && bhulekh_revenue_circle > 0 && bhulekh_revenue_village > 0 && bhulekh_plot_no > 0) {
        let param = {
          "bhulekh_tahasil": bhulekh_tahasil,
          "bhulekh_revenue_circle": bhulekh_revenue_circle,
          "bhulekh_revenue_village": bhulekh_revenue_village,
          "bhulekh_khata_no": bhulekh_khata_no,
          "bhulekh_plot_no": bhulekh_plot_no,
          "selVal": rorVal
        }
        let bhulekh_ror = <HTMLElement>document.querySelector(".bhulekh_ror");
        this.objMstr.grapCalBhulekh(param).subscribe(res => {
          let bhulekh_ror = <HTMLElement>document.querySelector(".bhulekh_ror");
          let bhulekh_area = <HTMLElement>document.querySelector(".bhulekh_area");
          let bhulekh_area_id = bhulekh_area.id;
          if (res.result.status == 1) {
            bhulekh_ror.innerHTML = res.result.optionStr;
          } else {
            bhulekh_ror.innerHTML = '<option value="">Select</option>';
          }
        },
          error => {
            bhulekh_ror.innerHTML = '<option value="">Select</option>';
          }
        );
      }
    }
    let seedSchemeId ='';
    this.loading = true;
    this.objSeedService.getCropVarietyList({}).subscribe(res => { 
    this.respSts = res.status;
     if(this.respSts == 200)
     {
      this.loading = false;
      this.result = JSON.parse(res.result);
      this.apiCropVarietyResult  = this.result;
      this.typeOfSeedOptions     = Array.from(this.apiCropVarietyResult);
      this.typeOfSeedOptions.sort(function (x, y) {
        let a = x.CROP_NAME.toUpperCase(),
            b = y.CROP_NAME.toUpperCase();
        return a == b ? 0 : a > b ? 1 : -1;
    });

      this.typeOfVarietyOptions  = Array.from(this.apiCropVarietyResult);
      this.typeOfVarietyOptions.sort(function (x, y) {
        let a = x.VARIETY_NAME.toUpperCase(),
            b = y.VARIETY_NAME.toUpperCase();
        return a == b ? 0 : a > b ? 1 : -1;
    });
   

     }
    });


      
      this.objSeedService.getVarietyPriceList({}).subscribe(res => {
      this.respSts = res.status;
     if(this.respSts == 200)
     {
      this.seedPriceList  = JSON.parse(res.result);
     }
    });

          
    let ctrlElement = document.getElementsByClassName('sum_item');
    let sumClassLength = ctrlElement.length;
    for (let i = 0; i < sumClassLength; i++) {
      let sumCtrlId = ctrlElement[i].getAttribute('id');
      let curObj = this;
      document.getElementById(sumCtrlId).addEventListener("keyup", function () { curObj.calculateSum() }, false);
    }
  }
 
  getAllSeedAvailablity()
  {
    let dealerTableElement = < HTMLElement > document.querySelector(".dealerTable");
    let seedSchemeVarietyElement = < HTMLElement > document.querySelector(".seedSchemeVarity");
    if (document.body.contains(dealerTableElement)) {
      dealerTableElement.remove();
    }
  
    var cropCodeValue = $('.seedSchemeCrop').find(':selected').data('val');
    var cropCodeVarietyValue = $('.seedSchemeVarity').find(':selected').data('val');
    let districtIdObj: any = ( < HTMLInputElement > document.getElementById('selDistrict')).value;
    if (!this.vldChkLst.selectDropdown(districtIdObj, "District")) {
      $('.seedSchemeVarity').val(0);
      return false;
    }
    if (!this.vldChkLst.selectDropdown(cropCodeValue, "Crop")) {
      $('.seedSchemeCrop').val(0);
      return false;
    }
    var districtIdApi
    if (districtIdObj != '0') {
      districtIdObj = JSON.parse(districtIdObj);
      districtIdApi = districtIdObj.val;
    }

    let param = {
      "districtId": districtIdApi,
      "cropCode": cropCodeValue,
      "cropCodeVariety":cropCodeVarietyValue
    }
  this.loading = true;
  this.objSeedService.getSeedAvailablity({param}).subscribe(res => {

  this.respSts = res.status;
 
   if(this.respSts == 200)
   { this.loading = false;
    this.responseSeedAvailable =JSON.parse(res.result);
  
    const sorter = (a, b) => {
      return a.PRICE_RECEIVE_UNITCD - b.PRICE_RECEIVE_UNITCD;
   };
   const sortByGovtType = arr => {
      arr.sort(sorter);
   };

  sortByGovtType(this.responseSeedAvailable);

  
 
//    this.typeOfVarietyOptions.sort(function (x, y) {
//     let a = x.VARIETY_NAME.toUpperCase(),
//         b = y.VARIETY_NAME.toUpperCase();
//     return a == b ? 0 : a > b ? 1 : -1;
// });
   this.fillDealerDetails();
   }
  });
}
  calculateSum() {
    let ctrlElement = document.getElementsByClassName('sum_item');
    let totalElement = document.getElementsByClassName('sum_total');
    let sumTotalCtrlId = totalElement[0].getAttribute('id');
    let sumClassLength = ctrlElement.length;
    let totalSum = 0;
    for (let i = 0; i < sumClassLength; i++) {
      let sumCtrlId = ctrlElement[i].getAttribute('id');
      let sumCtr = (<HTMLInputElement>document.getElementById(sumCtrlId)).value;
      totalSum += Number(sumCtr);
    }
    this.schemeForm.patchValue({ [sumTotalCtrlId]: totalSum });
  }
  // start of dynamic event functionality
  setDynamicEvnt(ctrlId: any, chldCtrlId: any, ctrlSelValArr: any, loadFlg: any, ctrlPrntVal: any, type: any) {
    let curObj = this;
    if (loadFlg == 1) {
      setTimeout(function () {
        curObj.onDynamicValChanged(ctrlPrntVal, chldCtrlId, ctrlSelValArr, type);
      }, 1000)
    }

    this.schemeForm.get(ctrlId).valueChanges
      .subscribe(f => {

        this.onDynamicValChanged(f, chldCtrlId, ctrlSelValArr, type);
      })
  }

  onDynamicValChanged(value: any, chldCtrlId: any, ctrlSelValArr: any, type: any) {

    let parntDiv = document.querySelector('.clsDiv_' + chldCtrlId);
    let parntDiv2 = document.querySelector('.test22');
    if (ctrlSelValArr.includes(value)) {
      parntDiv.classList.remove("d-none");
    }
    else {
      parntDiv.classList.add("d-none");
      if (type != 'addMore') {
        this.schemeForm.patchValue({ [chldCtrlId]: '' });
      }

    }
  }
  // end of dynamic event functionality

  // start of cascading event functionality
  setDynamicCscdEvnt(ctrlId: any, chldCtrlId: any, ctrlSelValArr: any, cscdTagArr: any) {
    this.schemeForm.get(ctrlId).valueChanges
      .subscribe(f => {
        this.onDynamicCscdValChanged(f, chldCtrlId, ctrlSelValArr, cscdTagArr);
      })
  }

  onDynamicCscdValChanged(value: any, chldCtrlId: any, ctrlSelValArr: any, cscdTagArr: any) {
    ctrlSelValArr = ctrlSelValArr.filter(item => item.tagFldValue === value);
    this.setDynmTagOpnVal(chldCtrlId, ctrlSelValArr, cscdTagArr, value);
  }
  setDynmTagOpnVal(chldCtrlId: any, optionArr: any, cscdTagArr: any, value: any) {
    let ctrlCdTagSts = cscdTagArr['tagFieldSts'];
    let dataBindType = cscdTagArr['dataBindType'];
    if (ctrlCdTagSts == '1' && chldCtrlId != '' && dataBindType == 2) {
      let param = {
        "cscdTagArr": cscdTagArr,
        "value": value
      }
      let dd = document.getElementById(chldCtrlId);
      if (value != '0' && value!='' &&  value!='null') {
        this.objMstr.grapCalDemoBhulekh(param).subscribe(res => {
          let dd = document.getElementById(chldCtrlId);
          if (res.status == 1) {
            dd.innerHTML = res.result.optionStr;
          } else {
            let dd = document.getElementById(chldCtrlId);
            dd.innerHTML = '<option value="">Select</option>';
          }
        },
          error => {
            let dd = document.getElementById(chldCtrlId);
            dd.innerHTML = '<option value="">Select</option>';
          });
        //let myContainer = <HTMLElement> document.querySelector(".tahasil");
      } else {
        dd.innerHTML = '<option value="">Select</option>';
      }
    } else {
      let dd = document.getElementById(chldCtrlId);
      dd.innerHTML = '';
      dd.appendChild(new Option('Select', ''));
      optionArr.forEach(element => {
        let option = document.createElement("option");
        option.text = element.optionText;
        option.value = element.optionValue;
        dd.appendChild(option);
      });
    }
  }
  // end of cascading event functionality

  // start of addmore cascading event functionality
  setAddMrCscdEvnt(ctrlId: any, chldCtrlId: any, ctrlSelValArr: any, ctrlPrntSelValArr: any, ctrlSelVal: any) {
    let selectElement = document.getElementById(chldCtrlId).closest('tr').querySelector('.' + ctrlId);
    selectElement.addEventListener('change', (event: any) => {
      let prntIndxArr = this.getAddMrAllIndexes(ctrlPrntSelValArr, event.target.value);
      let chldOptnArr = this.getAddMrAllChldArr(ctrlSelValArr, prntIndxArr, ctrlSelVal);
      document.querySelector('#' + chldCtrlId).innerHTML = chldOptnArr;
    });
    selectElement.dispatchEvent(
      new Event("change")
    );
  }
  getAddMrAllIndexes(arr: any, val: any) {
    var indexes = [], i: any;
    for (i = 0; i < arr.length; i++)
      if (arr[i] === val)
        indexes.push(i);
    return indexes;
  }
  getAddMrAllChldArr(chldArr: any, prntIndxArr: any, selectedVal: any) {
    let chldOptnArr = '<option value="">Select</option>';
    for (let i = 0; i < chldArr.length; i++)
      if (prntIndxArr.includes(i)) {
        let selected = (selectedVal == chldArr[i].optionValue) ? 'selected="selected"' : '';
        chldOptnArr += '<option value="' + chldArr[i].optionValue + '" ' + selected + '>' + chldArr[i].optionText + '</option>';
      }
    return chldOptnArr;
  }
  // end of addmore cascading event functionality

  onSaveAsDraftClick() {
    this.isDraft = true;
  }

  onSaveNextClick() {
    this.isDraft = false;
  }

  enableDisable(controlName, className) {
    if (className.includes('loan_bank_branch') || className.includes('loan_bank_name') || className.includes('loan_bank_ifsc') || className.includes('ifsc_code') || className.includes('ifsc_dist') || className.includes('ifsc_branch') || className.includes('ifsc_bank') || className.includes('sum_total')) {

      return true;
    }
    else {
      return false;
    }
  }

 
  
  openSeedDetails() {
    var currOBJ = this;
    let seedSchemeTypeElement = < HTMLElement > document.querySelector(".seedSchemeType");
      var selectedTypeValue = ( < HTMLInputElement > document.getElementById(seedSchemeTypeElement.id)).value;
      let optCrops = '<option value="0">Select</option>';
      if (selectedTypeValue == '0' || selectedTypeValue == "") {
        
        Swal.fire({
          icon: 'error',
          text: "Type of Seed can not be left blank"
        });
        ( < HTMLInputElement > document.getElementById('selseedSchemeCrop')).innerHTML = optCrops;
        // ( < HTMLInputElement > document.getElementById('selseedSchemeType')).innerHTML = optCrops;
        return false;
      }
      this.open(this.someSeedDBTModalRef);
      var selectedCropCode  = '';
      if (selectedTypeValue == 'Paddy') {
        selectedCropCode    = 'C002';
      }
        
      for (let i = 0; i < currOBJ.typeOfSeedOptions.length; i++) {
        if (optCrops.indexOf(currOBJ.typeOfSeedOptions[i]['CROP_CODE']) === -1 && (selectedCropCode == currOBJ.typeOfSeedOptions[i]['CROP_CODE'] || (selectedCropCode == '' && currOBJ.typeOfSeedOptions[i]['CROP_CODE']!='C002'))) {
         
          optCrops += '<option data-val="' + currOBJ.typeOfSeedOptions[i]['CROP_CODE'] + '" value="' + currOBJ.typeOfSeedOptions[i]['CROP_NAME'] + '">' + currOBJ.typeOfSeedOptions[i]['CROP_NAME'] + '</option>'
        }
      }
    
      ( < HTMLInputElement > document.getElementById('selseedSchemeCrop')).innerHTML = optCrops;
  
  
  
  }
  
  fillVariety() {
    var cropCodeValue = $('.seedSchemeCrop').find(':selected').data('val');
    let optVariety = '<option value="0" selected="selected">Select</option>';
    for (let i = 0; i < this.typeOfVarietyOptions.length; i++) {
      if (optVariety.indexOf(this.typeOfVarietyOptions[i]['CROP_CODE']) === -1 && this.typeOfVarietyOptions[i]['CROP_CODE'] == cropCodeValue) {
        optVariety += '<option data-val="' + this.typeOfVarietyOptions[i]['VARIETY_CODE'] + '" value="' + this.typeOfVarietyOptions[i]['VARIETY_NAME'] + '">' + this.typeOfVarietyOptions[i]['VARIETY_NAME'] + '</option>'
      }
    }
    ( < HTMLInputElement > document.getElementById('selseedSchemeVarity')).innerHTML = optVariety;
  }
  
  fillDealerDetails() {
  
    this.IsmodelShow=true;
    var currOBJ = this;
  
  
    let dealerTableElement = < HTMLElement > document.querySelector(".dealerTable");
    let seedSchemeVarietyElement = < HTMLElement > document.querySelector(".seedSchemeVarity");
    if (document.body.contains(dealerTableElement)) {
      dealerTableElement.remove();
    }
  
    var cropCodeValue = $('.seedSchemeCrop').find(':selected').data('val');
    var cropCodeVarietyValue = $('.seedSchemeVarity').find(':selected').data('val');
    let districtIdObj: any = ( < HTMLInputElement > document.getElementById('selDistrict')).value;
    if (!this.vldChkLst.selectDropdown(districtIdObj, "District")) {
      $('.seedSchemeVarity').val(0);
      return false;
    }
    if (!this.vldChkLst.selectDropdown(cropCodeValue, "Crop")) {
      $('.seedSchemeCrop').val(0);
      return false;
    }
    var districtIdApi
    if (districtIdObj != '0') {
      districtIdObj = JSON.parse(districtIdObj);
      districtIdApi = districtIdObj.val;
    }
  
    let container = document.createElement("div");
    var licenceNoSeed = '';
    var i = 0;
    var sum = 0;
    var m = 0;
    var ctr = 0;

    var tableClass = '<table class="table  table-bordered dealerTable"><thead><tr><th scope="col">Sl#</th><th scope="col">Dealer Name</th><th scope="col">Mobile no.</th><th scope="col">Total Available (No. of bags)</th><th scope="col">Action</th></tr></thead><tbody>';

    for (const element of this.responseSeedAvailable) {
      i += 1; 
       //element['LICENCE_NUMBER']

      if (element['CROP'] == cropCodeValue && element['VARIETY'] == cropCodeVarietyValue && element['DISTRICT'] == districtIdApi && licenceNoSeed.indexOf(element['LICENCE_NUMBER']) === -1) {
        ctr += 1;
        licenceNoSeed += element['LICENCE_NUMBER'];
        sum = 0;
        currOBJ.dealerArr[element['LICENCE_NUMBER'] + element['VARIETY']] = [];
        for (const eachValue of this.responseSeedAvailable) {
          m += 1;
          var contactNo =  (element['CONTACT_NUMBER']!='') ? element['CONTACT_NUMBER'] : '--';
          if (eachValue['CROP'] == cropCodeValue && eachValue['VARIETY'] == cropCodeVarietyValue && eachValue['DISTRICT'] == districtIdApi && element['LICENCE_NUMBER'] == eachValue['LICENCE_NUMBER']) {
            sum += eachValue['AVAILABLE'];
            currOBJ.dealerArr[element['LICENCE_NUMBER'] + eachValue['VARIETY']].push(eachValue);
          }
        }
        tableClass += `<tr class="disableTr"><th scope="row">${ctr} </th><td>${element['FARM_NAME'] } </td>
        <td>${contactNo}</td>  
        <td>` + sum + `</td><td><input type="button" class="btn-sm btn btn-primary m-1 clsDealer" data-val="` + element['LICENCE_NUMBER'] + `" value="Select" data-totalavailable="` + sum + `"/></td></tr>`;
      }
    }
    tableClass += '</tbody></table>';
    $('.noDataTxtDanger').remove();
    if (Number(m) == 0) {
      container.innerHTML = "<center class='text-danger noDataTxtDanger'><b>Dealer wise data is not available for this Variety</b></center>";
      seedSchemeVarietyElement.parentElement.parentElement.after(container);
  
    } else {
      container.innerHTML = tableClass;
      seedSchemeVarietyElement.parentElement.parentElement.after(container);
      
    }
    var currentObj = this;
    
    $(".clsDealer").on('click', function() { 
      var selectedSeedSchemeCrop      =  $('.seedSchemeCrop').val();
      var selectedSeedSchemevariety   =  $('.seedSchemeVarity').val();
      if(selectedSeedSchemeCrop =='0')
      {
        Swal.fire({
          icon: 'error',
          text: "Type of crop can not be left blank"
        });
        return false;
      }
     if(selectedSeedSchemevariety == '0')
     {
      Swal.fire({
        icon: 'error',
        text: "Type of variety can not be left blank"
      });
      return false;
     } 
      currentObj.modalService.dismissAll();
      $(this).prop('disabled', true);
      let seedSchemeTypeElement = < HTMLElement > document.querySelector(".seedSchemeType");
      var selectedTypeValue = ( < HTMLInputElement > document.getElementById(seedSchemeTypeElement.id)).value;
      currentObj.selectedOptValue  =   (selectedTypeValue == 'Paddy') ? 1 : 2;

      var totalSumAva = $(this).data('totalavailable');
      let table = < HTMLElement > document.querySelector(".clsAddMoreSeed");
      table.classList.remove("d-none");
      let seedSchemeElement: any = < HTMLElement > document.querySelector(".seedSchemeCrop");
      var selectedSchemeText = seedSchemeElement.options[seedSchemeElement.options.selectedIndex].text
      let seedSchemeVarietyElement: any = < HTMLElement > document.querySelector(".seedSchemeVarity");
      var selectedSchemeVarietyText = seedSchemeVarietyElement.options[seedSchemeVarietyElement.options.selectedIndex].text
      var selectedSchemeVarietyVal = $('.seedSchemeVarity').find(':selected').data('val');
      var selectedLicenceNo = $(this).data('val');
      var resultPriceList: any = '';
     console.log(currOBJ.dealerArr[selectedLicenceNo + selectedSchemeVarietyVal])
      for (const eachValue of currOBJ.dealerArr[selectedLicenceNo + selectedSchemeVarietyVal]) {
        if (typeof(currentObj.arrBags['BAG_' + eachValue['BAG_SIZE'] + '_' + eachValue['LICENCE_NUMBER'] + '_' + eachValue['VARIETY']]) == 'undefined') {
          currentObj.arrBags['BAG_' + eachValue['BAG_SIZE'] + '_' + eachValue['LICENCE_NUMBER'] + '_' + eachValue['VARIETY']] = [];
        }
        resultPriceList = currentObj.getPriceList(eachValue['CROP'], eachValue['VARIETY'] ,eachValue['PRICE_RECEIVE_UNITCD']); 
        let merge = $.extend({}, eachValue, resultPriceList) 
        currentObj.arrBags['BAG_' + eachValue['BAG_SIZE'] + '_' + eachValue['LICENCE_NUMBER'] + '_' + eachValue['VARIETY']].push(merge);
      }
      var arrBagsKeys: any = Object.keys(currentObj.arrBags);
      var tdata = ''
      var ctrl = 0;

      $('.totalClass').addClass('d-none');
      for (const eachValue of arrBagsKeys) { 
        if (currentObj.arrLicenceNo.length > 0 && !currentObj.arrLicenceNo.includes(currentObj.arrBags[eachValue][0].LICENCE_NUMBER + currentObj.arrBags[eachValue][0].VARIETY)) {
          var slNo = Number(currentObj.arrLicenceNo.length) + 1;
          var clneData = $('.dynSeedTbdy').find('tr').last().clone(true);
          clneData.find('.dynTdSlnoAddMoreCls').text(slNo);
          clneData.find('.seedApplydealerName').attr('id', 'seedApplydealerName_' + slNo);
          clneData.find('.seedApplydealerName').val(currentObj.arrBags[eachValue][0].FARM_NAME);
          clneData.find('.seedApplydealerName').attr('data-dealercontactno', currentObj.arrBags[eachValue][0].CONTACT_NUMBER);
          clneData.find('.seedApplydealerName').attr('data-lotno', currentObj.arrBags[eachValue][0].LOT_NUMBER);
          clneData.find('.seedApplydealerName').attr('data-source', currentObj.arrBags[eachValue][0].SOURCE);
          clneData.find('.seedApplydealerName').attr('data-val', currentObj.arrBags[eachValue][0].LICENCE_NUMBER);
          clneData.find('.seedApplydealerName').attr('data-variety', currentObj.arrBags[eachValue][0].VARIETY);
          clneData.find('.seed-type').attr('id', 'seedType_' + slNo);
          clneData.find('.seed-type').val(selectedSchemeText);
          clneData.find('.seed-type').attr('data-cropcode', currentObj.arrBags[eachValue][0].CROP);
          clneData.find('.seed-type').attr('data-seedcode',  currentObj.selectedOptValue);
          

          clneData.find('.seed-variety').attr('id', 'seedVariety_' + slNo);
          clneData.find('.seed-variety').val(selectedSchemeVarietyText);
          clneData.find('.seed-variety').attr('data-varietycode', currentObj.arrBags[eachValue][0].VARIETY);
          clneData.find('.seed-bagsize').attr('id', 'seedBagsize_' + slNo);
          clneData.find('.seed-bagsize').val(currentObj.arrBags[eachValue][0].BAG_SIZE);
  
          clneData.find('.seed-noofbag').attr('id', 'seedNoOfBag_' + slNo);
          clneData.find('.seed-noofbag').val(0);
          clneData.find('.seed-noofbag').addClass('width50');
          clneData.find('.seed-quantity').attr('id', 'seedQuantity_' + slNo);
          clneData.find('.seed-quantity').val(0);
          
          clneData.find('.seed-quantity').addClass('text-right');
          clneData.find('.seedFinalTotCost').addClass('text-right');
          clneData.find('.seedFinalTotCost').attr('id', 'seedFinalTotCost_' + slNo); 
          clneData.find('.seedFinalTotCost').val(0);
          clneData.find('.payableAmtFarmer').attr('id', 'payableAmtFarmer_' + slNo);
          clneData.find('.payableAmtFarmer').addClass('text-right');
          clneData.find('.payableAmtFarmer').val(0);
          clneData.find('.seed-total-cost').attr('id', 'seedTotalCost_' + slNo);
          clneData.find('.seed-total-cost').attr('data-val', currentObj.arrBags[eachValue][0].SP_SUBSIDYQTY);
         
          clneData.find('.seed-total-cost').val(0);
          clneData.find('.seed-total-cost').addClass('text-right');
          clneData.find('.minusbtn').attr('id', 'minusBtn_' + slNo);
          clneData.find('.plusbtn').attr('id', 'plusBtn_' + slNo);
          clneData.find('.removeBtn').attr('id', 'removeBtn_' + slNo);
          $('.dynSeedTbdy').find('tr').last().after(clneData);


          document.getElementById('removeBtn_' + slNo).addEventListener("click", function() {
            currentObj.removeRetailer('BAG_' +currentObj.arrBags[eachValue][0].BAG_SIZE +'_'+ currentObj.arrBags[eachValue][0].LICENCE_NUMBER+'_'+currentObj.arrBags[eachValue][0].VARIETY,'removeBtn_' + slNo , currentObj.arrBags[eachValue][0].LICENCE_NUMBER + currentObj.arrBags[eachValue][0].VARIETY);
          });

          document.getElementById('minusBtn_' + slNo).addEventListener("click", function() {
            currentObj.calcSeed("2", currentObj.arrBags, slNo, currentObj.arrBags[eachValue][0].BAG_SIZE, currentObj.arrBags[eachValue][0].LICENCE_NUMBER, currentObj.arrBags[eachValue][0].VARIETY, totalSumAva)
          });
  
          document.getElementById('seedNoOfBag_' + slNo).addEventListener("keyup", function() {
            currentObj.calcSeed("3", currentObj.arrBags, slNo, currentObj.arrBags[eachValue][0].BAG_SIZE, currentObj.arrBags[eachValue][0].LICENCE_NUMBER, currentObj.arrBags[eachValue][0].VARIETY, totalSumAva)
          });
  
          document.getElementById('plusBtn_' + slNo).addEventListener("click", function() {
            currentObj.calcSeed("1", currentObj.arrBags, slNo, currentObj.arrBags[eachValue][0].BAG_SIZE, currentObj.arrBags[eachValue][0].LICENCE_NUMBER, currentObj.arrBags[eachValue][0].VARIETY, totalSumAva)
          });
  
        } else if (currentObj.arrLicenceNo.length == 0) { 
         
          $('.seedApplydealerName').val(currentObj.arrBags[eachValue][0].FARM_NAME);
          $('.seedApplydealerName').attr('data-val', currentObj.arrBags[eachValue][0].LICENCE_NUMBER);
          $('.seedApplydealerName').attr('data-variety', currentObj.arrBags[eachValue][0].VARIETY);
          $('.seedApplydealerName').attr('data-lotno', currentObj.arrBags[eachValue][0].LOT_NUMBER);
          $('.seedApplydealerName').attr('data-source', currentObj.arrBags[eachValue][0].SOURCE);
          $('.seedApplydealerName').attr('data-dealercontactno', currentObj.arrBags[eachValue][0].CONTACT_NUMBER);
          $('.seed-type').attr('data-cropcode', currentObj.arrBags[eachValue][0].CROP);
          $('.seed-type').attr('data-seedcode',  currentObj.selectedOptValue);
     
          $('.seed-variety').attr('data-varietycode', currentObj.arrBags[eachValue][0].VARIETY);
          $('.seedApplydealerName').attr('readonly', 'readonly');  
          $('.seed-type').val(selectedSchemeText);
          $('.seed-type').attr('readonly', 'readonly');
          $('.seed-variety').val(selectedSchemeVarietyText);
          $('.seed-variety').attr('readonly', 'readonly');
          $('.seed-bagsize').val(currentObj.arrBags[eachValue][0].BAG_SIZE);
          $('.seed-bagsize').attr('readonly', 'readonly');
          $('.seed-noofbag').parents('td').addClass('d-flex');
          $('.seed-noofbag').before('<button class="btn btn-danger minusbtn" type="button" id="minusBtn_1">-</button>');
          $('.seed-noofbag').after('<button class="btn btn-primary plusbtn"  type="button" id="plusBtn_1">+</button>');
          $('.seed-noofbag').val(0);
          $('.seed-noofbag').prop('readonly', false);
          $('.seed-noofbag').addClass('width50');
          $('.seed-quantity').val(0);
          $('.seed-quantity').attr('readonly', 'readonly');
          $('.seed-quantity').addClass('text-right');
          $('.seed-total-cost').val(0);
          $('.seed-total-cost').attr('readonly', 'readonly');
          $('.seed-total-cost').attr('data-val', currentObj.arrBags[eachValue][0].SP_SUBSIDYQTY);
          $('.seed-total-cost').addClass('text-right');
          $('.payableAmtFarmer').attr('readonly', 'readonly');
          $('.payableAmtFarmer').val(0); 
          $('.payableAmtFarmer').addClass('text-right');
          $('.seedFinalTotCost').attr('readonly', 'readonly');
          $('.seedFinalTotCost').val(0);
          $('.seedFinalTotCost').addClass('text-right');
          
          $('.dynAddMoreActionTh').show();
          $('.dynAddMoreActionTh').text('Remove');
          $('.dynAddMoreBtn').show();
          $('.dynAddMoreBtn').removeClass('d-none'); 
          $('.dynAddMoreBtn').html('<button class="btn btn-danger removeBtn" type="button" id="removeBtn_1">-</button>');
          $('#btnopenSeedDetails').val('Add more seed details');

          document.getElementById('removeBtn_1').addEventListener("click", function() {
            currentObj.removeRetailer('BAG_' +currentObj.arrBags[eachValue][0].BAG_SIZE +'_'+ currentObj.arrBags[eachValue][0].LICENCE_NUMBER+'_'+currentObj.arrBags[eachValue][0].VARIETY,'removeBtn_1',currentObj.arrBags[eachValue][0].LICENCE_NUMBER + currentObj.arrBags[eachValue][0].VARIETY);
          });
          let calcSeedMinusElement = < HTMLElement > document.querySelector(".minusbtn")
          let calcSeedMinusId = calcSeedMinusElement.id;
          document.getElementById(calcSeedMinusId).addEventListener("click", function() {

          

            currentObj.calcSeed("2", currentObj.arrBags, 0, currentObj.arrBags[eachValue][0].BAG_SIZE, currentObj.arrBags[eachValue][0].LICENCE_NUMBER, currentObj.arrBags[eachValue][0].VARIETY, totalSumAva);
          });
          let noofbagElement = < HTMLElement > document.querySelector(".seed-noofbag")
          let noofbagElementId = noofbagElement.id;
          document.getElementById(noofbagElementId).addEventListener("keyup", function() {
            currentObj.calcSeed("3", currentObj.arrBags, 0, currentObj.arrBags[eachValue][0].BAG_SIZE, currentObj.arrBags[eachValue][0].LICENCE_NUMBER, currentObj.arrBags[eachValue][0].VARIETY, totalSumAva);
          });
          let calcSeedPlusElement = < HTMLElement > document.querySelector(".plusbtn");
          let calcSeedPlusId = calcSeedPlusElement.id;
          document.getElementById(calcSeedPlusId).addEventListener("click", function() {
          
            currentObj.calcSeed("1", currentObj.arrBags, 0, currentObj.arrBags[eachValue][0].BAG_SIZE, currentObj.arrBags[eachValue][0].LICENCE_NUMBER, currentObj.arrBags[eachValue][0].VARIETY, totalSumAva)
          });
        }
      
        currentObj.arrLicenceNo.push(currentObj.arrBags[eachValue][0].LICENCE_NUMBER + currentObj.arrBags[eachValue][0].VARIETY);
      }
     
    
  
    });
  }
  
  
  getPriceList(paramCropCode, paramVarietyCode ,priceRecivedUnitCd) {
    var arrPriceList = [];
    var arrAssociative = {};
    for (const loopPriceList of this.seedPriceList) {
      if (loopPriceList['CROP_CODE'] == paramCropCode && loopPriceList['VARIETY_CODE'] == paramVarietyCode && loopPriceList['SOURCE_CODE'] == priceRecivedUnitCd) {
        arrPriceList.push(
          arrAssociative = {
            "ALL_IN_COST_PRICE": loopPriceList['ALL_IN_COST_PRICE'],
            "GOI_SUBSIDY": loopPriceList['GOI_SUBSIDY'],
            "SP_SUBSIDY": loopPriceList['SP_SUBSIDY'],
            "TOT_SUBSIDY": loopPriceList['TOT_SUBSIDY'],
            "MAX_SUBSIDYQTY" : loopPriceList['MAX_SUBSIDYQTY'],
            "SP_SUBSIDYQTY" : loopPriceList['SP_SUBSIDYQTY']
          });
      }
    }
    return arrAssociative;
  }

  calcSeed(btnParm, arrBagsParm, cuurSlno, bagSize, dlrLcNo, VarietyCode, totalSumAva) {
  	var arrBagsKeys: any = Object.keys(arrBagsParm);
  	if (cuurSlno == 0) {
  		let calcSeedNoOfBagElement = < HTMLElement > document.querySelector(".seed-noofbag");
  		let calcSeedNoOfBagId = calcSeedNoOfBagElement.id;
  		let noOfBagvalue = ( < HTMLInputElement > document.getElementById(calcSeedNoOfBagId)).value;
  		let newBagValue: any = noOfBagvalue;
  		if ((Number(totalSumAva) < Number(noOfBagvalue) + 1 && (Number(btnParm == 1))) || (Number(totalSumAva) < Number(noOfBagvalue) && (Number(btnParm == 3)))) {
  			Swal.fire({
  				icon: 'error',
  				text: "No. of Bag should not be greater than " + totalSumAva
  			});
  			return false;
  		}
  		if (Number(btnParm == 1)) {
  			newBagValue = Number(noOfBagvalue) + 1;
  		} else if (Number(btnParm == 2)) {
  			newBagValue = Number(noOfBagvalue) - 1;
  			if (newBagValue < 0) {
  				return false;
  			}
  		} else if (Number(btnParm == 3) && noOfBagvalue) {
  			newBagValue = Number(noOfBagvalue);
  			if (newBagValue <= 0) {
  				( < HTMLInputElement > document.getElementById(calcSeedNoOfBagId)).value = '';
  				return false;
  			}
  		}
  		let calcSeedNoOfBagQuantityElement = < HTMLElement > document.querySelector(".seed-quantity");
  		let calcSeedNoOfBagQuantityId = calcSeedNoOfBagQuantityElement.id;
  		var cropQuantityData: any = Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].BAG_SIZE) * newBagValue;
  		var maxQuantity = Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].MAX_SUBSIDYQTY) * 100;
  		var indHactare = Number(cropQuantityData) / (Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].SP_SUBSIDYQTY) * 100);
      var cropVariertyName = $('.seed-variety').val();
  		if (cropQuantityData > maxQuantity) {
  			Swal.fire({
  				icon: 'error',
  				text: "Quantity of seed variety " + (cropVariertyName) + ' can not be greater than ' + maxQuantity + " kg"
  			});
  			return false;
  		}

  		let calcSeedTotCostElement = < HTMLElement > document.querySelector(".seed-total-cost");

  		let calcSeedTotCostId = calcSeedTotCostElement.id;

  		let calcSeedTotFinalCostElement = < HTMLElement > document.querySelector(".seedFinalTotCost");

  		let calcSeedTotFinalCostId = calcSeedTotFinalCostElement.id;

  		let calcSeedpayableAmtFarmerElement = < HTMLElement > document.querySelector(".payableAmtFarmer");

  		let calcSeedpayableAmtFarmerCostId = calcSeedpayableAmtFarmerElement.id;

  		let totSubsKg = Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].TOT_SUBSIDY) / 100;
  		let totCost = Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].ALL_IN_COST_PRICE) / 100;
  		let seedTotCost = ((Number(totSubsKg) * cropQuantityData).toFixed(2));
  		let seedTotFinalCst = (Number(totCost) * cropQuantityData).toFixed(2);
  		let farmerPayAmt = Number(seedTotFinalCst) - Number(seedTotCost);
  		var cuurentArr = {
  			'newBagValue': newBagValue,
  			'seedTotCost': seedTotCost,
  			'seedTotFinalCst': seedTotFinalCst,
  			'cropQuantityData': cropQuantityData,
  			'farmerPayAmt': farmerPayAmt,
  			'indHactare': indHactare,
  		}
  		var arrAllresult = this.totQuantity(cuurentArr, calcSeedNoOfBagId);
  		if (arrAllresult) {

  			( < HTMLInputElement > document.getElementById(calcSeedNoOfBagQuantityId)).value = cropQuantityData.toString();
  			( < HTMLInputElement > document.getElementById(calcSeedNoOfBagId)).value = Number(newBagValue).toString();
  			( < HTMLInputElement > document.getElementById(calcSeedTotCostId)).value = seedTotCost.toString();
  			( < HTMLInputElement > document.getElementById(calcSeedTotFinalCostId)).value = seedTotFinalCst.toString();
  			( < HTMLInputElement > document.getElementById(calcSeedpayableAmtFarmerCostId)).value = ((farmerPayAmt).toFixed(2)).toString();
  			$('#' + calcSeedNoOfBagQuantityId).attr('data-quantityinhect', indHactare);
  			$('.totalClass').removeClass('d-none');
  			$('.totalClass').show();
  			$('.totalQuantity').text(arrAllresult['totalQuantity']);
  			$('.totalVoucherCost').text(arrAllresult['totalVoucherCost'].toFixed(2));
  			$('.payAmtFarmer').text((arrAllresult['payAmtFarmer'].toFixed(2)));
  			$('.totalCost').text(arrAllresult['totalCost'].toFixed(2));
        $('#'+calcSeedpayableAmtFarmerCostId).attr('data-qunatityinhadlwise',arrAllresult['indHactare'].toFixed(2));

  		}
  	} else {
  		let calcSeedNoOfBagId = 'seedNoOfBag_' + cuurSlno;
  		let noOfBagvalue = ( < HTMLInputElement > document.getElementById(calcSeedNoOfBagId)).value;
  		let newBagValue: any = noOfBagvalue;
  		if ((Number(totalSumAva) < Number(noOfBagvalue) + 1 && (Number(btnParm == 1))) || (Number(totalSumAva) < Number(noOfBagvalue) && (Number(btnParm == 3)))) {
  			Swal.fire({
  				icon: 'error',
  				text: "No. of Bag shouldn't be greater than " + totalSumAva
  			});

  			return false;

  		}

  		if (Number(btnParm == 1)) {

  			newBagValue = Number(noOfBagvalue) + 1;

  		} else if (Number(btnParm == 2)) {

  			newBagValue = Number(noOfBagvalue) - 1;

  			if (newBagValue < 0) {

  				return false;

  			}

  		} else if (Number(btnParm == 3)) {

  			newBagValue = Number(noOfBagvalue);

  			if (newBagValue < 0) {

  				( < HTMLInputElement > document.getElementById(calcSeedNoOfBagId)).value = '';
  				return false;
  			}
  		}
  		let calcSeedNoOfBagQuantityId = 'seedQuantity_' + cuurSlno;
  		var cropQuantityData: any = Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].BAG_SIZE) * newBagValue;
  		var maxQuantity = Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].MAX_SUBSIDYQTY) * 100;
  		var indHactare = Number(cropQuantityData) / (Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].SP_SUBSIDYQTY) * 100);
  		var cropVariertyName = $('#seedVariety_' + cuurSlno).val();
  		if (cropQuantityData > maxQuantity) {
  			Swal.fire({
  				icon: 'error',
  				text: "Quantity of seed variety " + (cropVariertyName) + ' can not be greater than ' + maxQuantity + " kg"
  			});
  			return false;
  		}
  		let calcSeedTotCostId = 'seedTotalCost_' + cuurSlno;
  		let totSubsKg = Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].TOT_SUBSIDY) / 100;
  		let totCost = Number(arrBagsParm['BAG_' + bagSize + '_' + dlrLcNo + '_' + VarietyCode][0].ALL_IN_COST_PRICE) / 100;
  		let calcSeedTotFinalCostId = 'seedFinalTotCost_' + cuurSlno;
  		let calcSeedpayableAmtFarmerCostId = 'payableAmtFarmer_' + cuurSlno;
  		let seedTotCost = ((Number(totSubsKg) * cropQuantityData).toFixed(2));
  		let seedTotFinalCst = (Number(totCost) * cropQuantityData).toFixed(2);
  		let farmerPayAmt = Number(seedTotFinalCst) - Number(seedTotCost);
  		var cuurentArr = {
  			'newBagValue': newBagValue,
  			'seedTotCost': seedTotCost,
  			'seedTotFinalCst': seedTotFinalCst,
  			'cropQuantityData': cropQuantityData,
  			'farmerPayAmt': farmerPayAmt,
  			'indHactare': indHactare,
  		}
  		var arrAllresult = this.totQuantity(cuurentArr, calcSeedNoOfBagId);
  		if (arrAllresult) {
  			( < HTMLInputElement > document.getElementById(calcSeedNoOfBagQuantityId)).value = cropQuantityData.toString();
  			( < HTMLInputElement > document.getElementById(calcSeedNoOfBagId)).value = Number(newBagValue).toString();
  			( < HTMLInputElement > document.getElementById(calcSeedTotCostId)).value = seedTotCost.toString();
  			( < HTMLInputElement > document.getElementById(calcSeedTotFinalCostId)).value = seedTotFinalCst.toString();
  			( < HTMLInputElement > document.getElementById(calcSeedpayableAmtFarmerCostId)).value = ((farmerPayAmt).toFixed(2)).toString();
  			$('#' + calcSeedNoOfBagQuantityId).attr('data-quantityinhect', indHactare);
  			$('.totalClass').removeClass('d-none');
  			$('.totalClass').show();
  			$('.totalQuantity').text(arrAllresult['totalQuantity']);
  			$('.totalVoucherCost').text(arrAllresult['totalVoucherCost'].toFixed(2));
  			$('.payAmtFarmer').text((arrAllresult['payAmtFarmer'].toFixed(2)));
  			$('.totalCost').text(arrAllresult['totalCost'].toFixed(2));
        $('#'+calcSeedpayableAmtFarmerCostId).attr('data-qunatityinhadlwise',arrAllresult['indHactare'].toFixed(2));
        
  		}
  	}
  }
    totQuantity(cuurentArr, id) {
      var totSeedQuant: number = (Number(cuurentArr.cropQuantityData) > 0) ? Number(cuurentArr.cropQuantityData) : 0;
      var voucherPrice: number = (Number(cuurentArr.seedTotCost) > 0) ? Number(cuurentArr.seedTotCost) : 0;
      var totalCost: number = (Number(cuurentArr.seedTotFinalCst) > 0) ? Number(cuurentArr.seedTotFinalCst) : 0;
      var payAmtFarmer: number = (Number(cuurentArr.farmerPayAmt) > 0) ? Number(cuurentArr.farmerPayAmt) : 0;
      var indHactare: number = (Number(cuurentArr.indHactare) > 0) ? Number(cuurentArr.indHactare) : 0;
    
      $('.dynSeedTbdy .seed-noofbag').not('#' + id).each(function() {
    
    
        totSeedQuant += Number($(this).parents('tr').find('.seed-quantity').val());
    
        voucherPrice += Number($(this).parents('tr').find('.seed-total-cost').val());
    
        totalCost += Number($(this).parents('tr').find('.seedFinalTotCost').val());
    
        payAmtFarmer += Number($(this).parents('tr').find('.payableAmtFarmer').val());
    
        indHactare += Number($(this).parents('tr').find('.seed-quantity').data('quantityinhect'));
      });
    
      if (this.selectedOptValue == 1)
    
      {
    
        this.beforeAppliedQuantity = this.seedDBTPaddytotalQuantity;
    
      } else if (this.selectedOptValue == 2)
    
      {
    
        this.beforeAppliedQuantity = this.seedDBTNonPaddytotalQuantity;
    
      }
      this.totalQuantValidation = Number(this.beforeAppliedQuantity) + Number(indHactare);
      if (Number(this.beforeAppliedQuantity) + Number(indHactare) > environment.seedDBTTOTHECTValdn) {
       
        Swal.fire({
    
          icon: 'error',
    
          text: "You have reached maximum limit of " + environment.seedDBTTOTHECTValdn + " ha."
    
        });
    
        return false;
      } 
    
    
    
    
      // if ((Number(totSeedQuant) + Number(this.beforeAppliedQuantity) > environment.seedDBTTotQuantityValidation)) {
    
      // this.totalQuantValidation = 1;
    
      // Swal.fire({
    
      // icon: 'error',
    
      // text: "You have reached maximum limit of 3 ha."
    
      // });
    
      // return false;
    
      // } else {
    
      // this.totalQuantValidation = 0;
    
      // }
      this.totQunatInHect = indHactare;
    
      return {
    
        'totalQuantity': totSeedQuant,
        'totalVoucherCost': voucherPrice,
        'payAmtFarmer': payAmtFarmer,
        'totalCost': totalCost,
        'indHactare': indHactare
      }
    
    
    }

  removeRetailer(arrKey,removeBtnId,arrLicencekey,status=0)
  { 

    if(status ==0)
    {
    delete this.arrBags[arrKey];
    this.arrLicenceNo.splice(this.arrLicenceNo.indexOf(arrLicencekey),1)
    var removeBtnLength = document.getElementsByClassName('removeBtn').length;
    if(removeBtnLength == 1)
    {
      $('.seed-type').val('');
      $('.seed-variety').val('');
      $('.seed-bagsize').val('');
      $('.seed-noofbag').val('');
      $('.seed-quantity').val('');
      $('.seed-total-cost').val('');
      $('.seedApplydealerName').val('');
      $('.plusbtn').hide();
      $('.minusbtn').hide();
      $('.dynAddMoreBtn,.dynAddMoreActionTh').hide();
      $('.totalClass').hide();
      $('.seedFinalTotCost').val('');
      $('.payableAmtFarmer').val('');
      $('#btnopenSeedDetails').val('Add seed details');
    }
    else if(removeBtnLength > 1 )
    {
      $('#'+removeBtnId).closest('tr').remove();
      var arrAllresult = this.totQuantity([],removeBtnId);
    $('.totalQuantity').text(arrAllresult['totalQuantity']);
    $('.totalVoucherCost').text( arrAllresult['totalVoucherCost'].toFixed(2));
    $('.payAmtFarmer').text((arrAllresult['payAmtFarmer'].toFixed(2)));
    $('.totalCost').text( arrAllresult['totalCost'].toFixed(2));
    }
  }
  else
  {
      for (var key in this.arrBags) {
        delete this.arrBags[key];
      }

    $('.dynSeedTbdy').find('tr').not('tr:first').remove();
    $('.seed-type').val('');
    $('.seed-variety').val('');
    $('.seed-bagsize').val('');
    $('.seed-noofbag').val('');
    $('.seed-quantity').val('');
    $('.seed-total-cost').val('');
    $('.seedApplydealerName').val('');
    $('.plusbtn').hide();
    $('.minusbtn').hide();
    $('.dynAddMoreBtn,.dynAddMoreActionTh').hide();
    $('.totalClass').hide();
    $('.seedFinalTotCost').val('');
    $('.payableAmtFarmer').val('');
    $('#btnopenSeedDetails').val('Add seed details');  
  }

  }
  // scheme apply
  doSchemeApply() {
    let valSts = true;
    let ctrlParam: any = [];
    let profCnt = 0;

    let districtIdP = 0;
    let blockIdP = 0;
    let gpIdP = 0;
    let vlgIdP = 0;
    let vtOfcrIdP = 0;
    let allBagInputDataParent :any =[]; 

    if (this.schemeDmgForm.status === 'VALID') {
      let districtIdObj: any = (<HTMLInputElement>document.getElementById('selDistrict')).value;
      if (districtIdObj != '0') {
        districtIdObj = JSON.parse(districtIdObj);
        districtIdP = districtIdObj.val;
      }


      blockIdP = this.schemeDmgForm.controls["selBlock"].value;
      gpIdP = this.schemeDmgForm.controls["selGp"].value;
      vlgIdP = this.schemeDmgForm.controls["selVillage"].value;
      vtOfcrIdP = this.schemeDmgForm.controls["selVtOfcr"].value;
      vlgIdP = (vlgIdP > 0) ? vlgIdP : 0;
      if (!this.vldChkLst.selectDropdown(districtIdP, "District")) {
        valSts = false;
      }
      // else if (!this.vldChkLst.selectDropdown(blockIdP, "Block/ ULB")) {
      //   valSts = false;
      // }
      // else if (!this.vldChkLst.selectDropdown(gpIdP, "GP/ Ward")) {
      //   valSts = false;
      // }
      else {
        if (this.marineType == 0) {
          // if (!this.vldChkLst.selectDropdown(vlgIdP, "Village")) {
          //   valSts = false;
          // }
        }

        if (this.isServcFlg) {
          if (!this.vldChkLst.selectDropdown(vtOfcrIdP, "Veterinary Officer")) {
            valSts = false;
          }
        }
      }

    }
    if (valSts) {
      let controlKeys = Object.keys(this.schemeForm.controls);

      for (let key of controlKeys) {
        let elmVal = this.schemeForm.controls[key].value;
        let lblName = this.controlTypeArr[key]['vchLabelName'];
        let secType = this.controlTypeArr[key]['tinSectionType'];
        let frmConfgId = this.controlTypeArr[key]['intFormConfigId'];
        let ctrlType = this.controlTypeArr[key]['tinControlType'];
      
        if (ctrlType == 9) {
          elmVal = NgbDateCustomParserFormatter.formatDateStr(elmVal);
        }
        // for label
        if (ctrlType == 4) {
          elmVal = this.controlTypeArr[key]['jsnControlArray'][0]['labelText'];
        }
        let dispNnSts = false; // for mandatory validation
        // for addmore
        if (ctrlType == 8) {
          let tagFieldSts =this.controlTypeArr[key]['jsnDispTagArray']['0']['tagFieldSts'];
          let addmoreFlagDep = 0;
          if(tagFieldSts=='1'){
            let tagFieldArr =this.controlTypeArr[key]['jsnDispTagArray']['0']['tagFieldArr'];
            let tagFieldId =this.controlTypeArr[key]['jsnDispTagArray']['0']['tagFieldId'];
            let tagFieldIdVal = (<HTMLInputElement>document.getElementById(tagFieldId)).value;
            if(tagFieldArr.includes(tagFieldIdVal)){
              addmoreFlagDep = 1;
            }else{
              addmoreFlagDep = 0;
            }
          }else{
            addmoreFlagDep = 1;
          }
          
          
          let objAddMr = { "addMoreData": [], "columnData": [] };
          let obChldjColAddMr = [];
          let adMrArr = this.schemeForm.controls[key] as UntypedFormArray;
          let AddMoreCount = 0;
          let adMrClmNmame = '';
         
         /*for (let adMrCtrlRw = 0; adMrCtrlRw < adMrArr.controls.length; ++adMrCtrlRw) {
            let adMrClArr = (adMrArr.controls[adMrCtrlRw]) as FormArray;
            let objCtrlKey = Object.keys(adMrClArr.controls);
            let obChldjAddMr = [];
            AddMoreCount++;
            for (let adMrCtrlCl = 0; adMrCtrlCl < objCtrlKey.length; ++adMrCtrlCl) {
             
              let adMrCTrlVal = '';//(<HTMLInputElement>document.getElementById(key + '_' + adMrCtrlRw + '_' + adMrCtrlCl)).value;
              let adMrCTrlType = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnType;
              let adMrClmNm = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnName;
              adMrClmNmame = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnName;
              let adMrClmCls = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnId;
              // for validation
              // console.log($("."+adMrClmCls).length);
              if(addmoreFlagDep==1){
                // let adMrValParam = { "dynDataObj": this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl], "ctrlVal": adMrCTrlVal, "drftSts": this.isDraft, "dispNnSts": dispNnSts, "ctrlType": ctrlType };
                // if (!this.vldChkLst.dynCtrlVal(adMrValParam, this.el)) {
                //   valSts = false;
                //   this.el.nativeElement.querySelector('.' + adMrClmCls).focus();
                //   return false;
                // }
              
                // else {
                //   let arrAddMr = {
                //     "elementId": key + '_' + adMrCtrlRw + '_' + adMrCtrlCl,
                //     "elementVal": adMrCTrlVal,
                //     "colName": adMrClmNm,
                //     "colType": adMrCTrlType,
                //     "slno": (adMrCtrlCl + 1)
                //   };
                //   obChldjAddMr.push(arrAddMr);
                //   if (adMrCtrlRw == 0) {
                //     let arrAddColMr = {
                //       "colName": adMrClmNm,
                //       "colType": adMrCTrlType,
                //       "slno": (adMrCtrlCl + 1)
                //     };
                //     obChldjColAddMr.push(arrAddColMr);
                //   }
                // }
              }
              // end for validation                         
            }
            
            (objAddMr.addMoreData).push(obChldjAddMr);
            
          }*/


    
        
          var allBagInputData : any= [];
          var curObj =this;
          var ctrlTh :any =0;
          var addMoreThData :any = [];
          var ctr : any=0;
          var addMoreChildColumn : any =[];
          let clmnData : any=[];
          var zeroCheckCnt = 0;
          $('.clsAddMoreSeed').find('tr').first().each(function(){
            AddMoreCount++;
            $(this).find('th').not('.dynAddMoreActionTh').each(function(){ 
              addMoreThData.push($(this).find('.dynClnNameTh').text());
               clmnData = {
                "colName": $(this).find('.dynClnNameTh').text(),
                "colType": 6,
                "slno": (ctr + 1)
              };
              (objAddMr.columnData).push(clmnData);
          });
            });
            if (Number(this.totalQuantValidation)> environment.seedDBTTOTHECTValdn) {
       
              Swal.fire({
          
                icon: 'error',
          
                text: "You have reached maximum limit of " + environment.seedDBTTOTHECTValdn + " ha."
          
              });
          
              return false;
            } 
          
          $('.dynSeedTbdy').find('tr').each(function(){
            var addMoreChildData : any =[];
            var ctrAddmore : any =0;
          $(this).find('td').not('.dynAddMoreBtn').each(function(){
              let arrAddMr = {
            "elementId": $(this).find('input[type=text]').attr('id'),
            "elementVal": $(this).find('input[type=text]').val(),
            "colName": addMoreThData[ctrlTh],
            "colType": 6,
            "slno": (ctrAddmore + 1)
          };

          ctrlTh+=1;
          (addMoreChildData).push(arrAddMr);
          });
        
          (objAddMr.addMoreData).push(addMoreChildData);
            var seedTypevalue      = $(this).find('.seed-type').val();
            var seedVarietyvalue   = $(this).find('.seed-variety').val();
            var seedbagSizevalue   = $(this).find('.seed-bagsize').val();
            var seedNoOfBagvalue   = $(this).find('.seed-noofbag').val();
            var seedQuantityvalue  = $(this).find('.seed-quantity').val();
            var seedTotCostvalue   = $(this).find('.seed-total-cost').val();
            var seedFinalTotCost   = $(this).find('.seedFinalTotCost').val();
            var payableAmtFarmer   = $(this).find('.payableAmtFarmer').val(); 
            var dealerName         = $(this).find('.seedApplydealerName').val();
            var dealerLicenceNo    = $(this).find('.seedApplydealerName').data('val');
            var cropCodeValue      = $(this).find('.seed-type').data('cropcode'); 
            var CropCodeId         = $(this).find('.seed-type').data('seedcode'); 
            var varietyCodeValue   = $(this).find('.seed-variety').data('varietycode');
            var lotNo              = $(this).find('.seedApplydealerName').data('lotno');
            var source             = $(this).find('.seedApplydealerName').data('source');
            var vchDealerMobileNo  = $(this).find('.seedApplydealerName').data('dealercontactno');
            var seedDBTFarmerId    = $('.seed_dbt_farmer_id').val();
            var totQuantInHect     = $(this).find('.payableAmtFarmer').data('qunatityinhadlwise');
            var arrAllBagData      = curObj.arrBags['BAG_'+seedbagSizevalue+'_'+dealerLicenceNo+'_'+varietyCodeValue];
        
            //SOURCE -> source , LOT_NUMBER 
            if(Number(seedNoOfBagvalue) == 0 || seedNoOfBagvalue=='')
            {
              zeroCheckCnt ++;
              Swal.fire({
                icon: 'error',
                text: "No. of Bag should be greater than 0"
              });
              return false;
            }

            if(seedTotCostvalue == '')
            {
              zeroCheckCnt ++;
              Swal.fire({
                icon: 'error',
                text: "Total cost of seed cannot be null"
              });
              return false;
            }

            var totQuantity     = $('.totalQuantity').text();
            var totVoucherCost  = $('.totalVoucherCost').text();
            var payAmtFarmer    = $('.payAmtFarmer').text();
            var totalCost       = $('.totalCost').text();
            
         
           var arrjsnTotalDetails = {
            'totQuantity'    : totQuantity,
            'totVoucherCost' : totVoucherCost,
            'totpayAmtFarmer': payAmtFarmer,
            'totalCost'      : totalCost,
            'totQuantInHect' : totQuantInHect,
           };
                allBagInputData   = 
            {
              'dealerName'     :  dealerName,
              'dealerLicenceNo':  dealerLicenceNo, 
              'cropName'       :  seedTypevalue,
              'cropCode'       :  cropCodeValue,
              'cropVariety'    :  seedVarietyvalue,
              'cropVarietyCode':  varietyCodeValue,
              'bagSize'        :  seedbagSizevalue,
              'noOfbag'        :  seedNoOfBagvalue,
              'seedQuantity'   : seedQuantityvalue,
              'seedTotCost'    : seedTotCostvalue,
              'lotNo'          : lotNo,
              'source'         : source,
              'CropCodeId'     : CropCodeId,
              'jsnAllArrData'  : arrAllBagData,
              'jsnTotalDetails': arrjsnTotalDetails,
              'totQuantity'    : totQuantity,
              'totQuantityInHect' : totQuantInHect,
              'vchDealerMobileNo' : vchDealerMobileNo,
              'seedFinalTotCost' : seedFinalTotCost,
              'payableAmtFarmer' : payableAmtFarmer,
              'seedDBTFarmerId'  : seedDBTFarmerId
            }
            allBagInputDataParent.push(allBagInputData);
          });
         
          // ctrlParam[profCnt] = {
          //   "profileId": this.applicantId,
          //   "secTypeId": secType,
          //   "lblName": lblName,
          //   "fldVal": JSON.stringify(objAddMr),
          //   "ctrlDtls": '',
          //   "formConfgId": frmConfgId,
          //   "createdBy": this.applicantId,
          //   "ctrlTypeId": ctrlType
          // }
         if(AddMoreCount > 0)
         {
           elmVal = JSON.stringify(objAddMr);
         }
         
        //  if(AddMoreCount<2 && this.isDraft==false && addmoreFlagDep==1 && this.intdirectorate==environment.APICOL_Directorate){
        //     Swal.fire({
        //       icon: 'error',
        //       text: adMrClmNmame+' should not be less than 2 rows.'
        //     });
        //     return false;
        //   }else if(AddMoreCount>10 && this.isDraft==false && addmoreFlagDep==1 && this.intdirectorate==environment.APICOL_Directorate){
        //     Swal.fire({
        //       icon: 'error',
        //       text: adMrClmNmame+' should not more than 10 rows.'
        //     });
        //     return false;
        //   }
        //   objAddMr.columnData = obChldjColAddMr;
        //   dispNnSts = false;
        //   elmVal = JSON.stringify(objAddMr);
        }
        else {
         // dispNnSts = this.el.nativeElement.querySelector('.clsDiv_' + key).classList.contains('d-none');
        }
         let ctrlDtls = '';
        let ctrlValParam = { "dynDataObj": this.controlTypeArr[key], "ctrlVal": elmVal, "drftSts": this.isDraft, "dispNnSts": dispNnSts, "ctrlType": ctrlType };
       
         let ctrlClass = this.controlTypeArr[key]['jsnControlArray'][0]['ctrlClass'];
  
       if (this.schemeForm.status === 'VALID') {
          if (!this.vldChkLst.dynCtrlVal(ctrlValParam, this.el)) {
            
            valSts = false;
            this.el.nativeElement.querySelector('.cls_' + key).focus();
            break;
          }if(ctrlClass=='valid_aadhar' && this.isDraft==false && !this.vldChkLst.validAadhar(elmVal) ){
            valSts = false;
            Swal.fire({
              icon: 'error',
              text: 'Please Enter a Valid '+lblName
            });
            return false;
          }
          else {
            if (dispNnSts === false) {
              ctrlParam[profCnt] = {
                "profileId": this.applicantId,
                "secTypeId": secType,
                "lblName": lblName,
                "fldVal": elmVal,
                "ctrlDtls": ctrlDtls,
                "formConfgId": frmConfgId,
                "createdBy": this.applicantId,
                "ctrlTypeId": ctrlType
              }
              profCnt++;
            }

          }
        }
      }
    }

    if (valSts) {
      let schemeParam = {
        "profileId": this.applicantId,
        "schemeId": this.schemeId,
        "dynCtrlParm": ctrlParam,
        "drftSts": this.isDraft,
        "districtId": districtIdP,
        "blockId": blockIdP,
        "gpId": gpIdP,
        "vlgId": vlgIdP,
        "vtOfcrId": vtOfcrIdP,
        "BankId":this.BankId,
        "intApplicationId":(this.applctnId !='') ? this.applctnId :0
      }

   var jsnSchemeData = {'schemeParam':schemeParam,'seedDBTParm':allBagInputDataParent};
    if(Number(zeroCheckCnt) == 0 )
    {
        Swal.fire({
          title: 'Proceed to submit.',
          text: "You won't be able to modify further",
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm'
        }).then((result) => {
          if (result.isConfirmed) {
            this.objSeedService.schemeDBTApply(jsnSchemeData).subscribe(res => {
              let encAppCtnId = this.encDec.encText((this.schemeId + ':' + res.appCtnId + ':1' +':DBT').toString())
             this.router.navigate(['/citizen-portal/scheme-preview', encAppCtnId])
            });
          
          }
        });
    // this.objSeedService.schemeDBTApply(jsnSchemeData).subscribe(res => {
    //     if (res.status == 1) {
    //       if (this.isDraft) {
    //         Swal.fire({
    //           icon: 'success',
    //           text: res.msg
    //         });
    //       }
    //       else {
    //         this.applctnId = res.appCtnId;
    //         if (this.docSectnSts) {
    //           let encAppCtnId = this.encDec.encText((this.schemeId + ':' + res.appCtnId + ':' + this.apprRsmSts).toString());
    //           this.router.navigate(['/citizen-portal/scheme-document', encAppCtnId]);
    //         }
          
    //       }
    //     }
    //     else {
    //       Swal.fire({
    //         icon: 'error',
    //         text: res.msg
    //       });
    //     }
    //   },
        // error => {
        //   Swal.fire({
        //     icon: 'error',
        //     text: environment.errorMsg
        //   });
        // });
      }
    }
  }

  goToBack() {
    let docSecAvl = (this.docSectnSts) ? 1 : 0;
    let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId + ':' + docSecAvl).toString());
    this.router.navigate(['/citizen-portal/profile-update', encAppCtnId]);
  }

  keyPressEvt(type: any, evt: any, crtId: any) {

    let sts: any;
    
    // let dashslashnumber = <HTMLElement> document.querySelector(".dashslashnumber");
    let classname = document.getElementById(crtId).className;
    let classnameArr = classname.split(" ");
    if (classnameArr.indexOf("dashslashnumber") > -1) {
      sts = this.vldChkLst.isDashSlashNumeric(evt);
    } else {
      sts = this.vldChkLst.isAlphaNumeric(evt);
      if (type == 1) {
        sts = this.vldChkLst.isNumberKey(evt);
      }
      if (type == 2) {
        sts = this.vldChkLst.isCharKey(evt);
      }
      if (type == 3) {
        sts = this.vldChkLst.isAlphaNumeric(evt);
      }
      if (type == 4) {
        sts = this.vldChkLst.isDecimal(evt);
      }
    }
    
    

    return sts;
  }
  keyPressEvtMob(type: any, evt: any, crtId: any) {
    let sts: any;

    // let dashslashnumber = <HTMLElement> document.querySelector(".dashslashnumber");
    let classname = document.getElementById(crtId).className;
    let fieldVal = ((<HTMLInputElement>document.getElementById(crtId)).value);
    let classnameArr = classname.split(" ");
    if (classnameArr.indexOf("dashslashnumber") > -1) {
      sts = this.vldChkLst.isDashSlashNumericMob(fieldVal);
    } else {
      sts = this.vldChkLst.isAlphaNumeric(evt);
      if (type == 1) {
        sts = this.vldChkLst.isNumberKeyMob(fieldVal);
      }
      if (type == 2) {
        sts = this.vldChkLst.isCharKeyMob(fieldVal);
      }
      if (type == 3) {
        sts = this.vldChkLst.isAlphaNumericMob(evt);
        //sts = this.vldChkLst.isDecimalMob(fieldVal);
      }
      if (type == 4) {
        sts = this.vldChkLst.isDecimalMob(fieldVal);
      }
    }

    if (!sts) {
      fieldVal = fieldVal.slice(0, -1);
      this.schemeForm.patchValue({ [crtId]: fieldVal });

    }

  }
  
  keyUpEvt(type: any, evt: any, crtId: any) {
    if (this.isMobile) {
      this.keyPressEvtMob(type, evt, crtId);
    }
    // console.log(this.jsnFormulaCalculation);
    for(let cal in this.jsnFormulaCalculation){
      // console.log(crtId);
      let calArr = this.jsnFormulaCalculation[cal];
      if(calArr.includes(crtId)){
        let str = '';
        for(let c1 in calArr){
          if(parseInt(c1)%2==0){
            let v1 = (<HTMLInputElement>document.getElementById(calArr[c1])).value!=''?parseFloat((<HTMLInputElement>document.getElementById(calArr[c1])).value):0;
            str = str+v1;
            // console.log(calArr[c1]);
          }else{
             str = str+calArr[c1]
          }
        }
        (<HTMLInputElement>document.getElementById(cal)).value = eval(str);
        this.schemeForm.patchValue({ [cal]: eval(str) });
        document.getElementById(cal).setAttribute("readonly","readonly");
        $('#'+ cal).parents('.form-group').find("small").remove();
        $('#'+ cal).parents('.form-group').append('<small class="d-block mt-1">'+this.vldChkLst.price_in_words((<HTMLInputElement>document.getElementById(cal)).value)+'</small>');
      }
      
    }
    var li = document.getElementById(crtId);
    let cls = li.className;
    if (cls.search("cls_word") > 0) {
      $('#'+ crtId).parents('.form-group').find("small").remove();
      $('#'+ crtId).parents('.form-group').append('<small class="d-block mt-1">'+this.vldChkLst.price_in_words((<HTMLInputElement>document.getElementById(crtId)).value)+'</small>');
    }
    
  }
  // go to that tab section
  goToSectn(sectnType: any) {
    let sectnUrl = '/citizen-portal/scheme-list';
    let sectnEncStr = this.route.snapshot.paramMap.get('id');
    switch (sectnType) {
      case "1":
        sectnUrl = '/citizen-portal/profile-update';
        break;
      case "2":
        sectnUrl = '/citizen-portal/seed-apply';
        break;
      case "3":
        let sectnDecStr = this.encDec.decText(sectnEncStr);
        sectnEncStr = this.encDec.encText((sectnDecStr + ':' + this.apprRsmSts).toString());
        sectnUrl = '/citizen-portal/scheme-document';
        break;
    }
    this.router.navigate([sectnUrl, sectnEncStr]);
  }

  getIFSC() {
    this.Banks = [];
    this.ifscForm = new UntypedFormGroup({
      'vchBankName': new UntypedFormControl('',
        [
          Validators.required,
        ]
      ),
      'vchDistrictName': new UntypedFormControl('',
        [
          Validators.required,
        ]
      )
    });

    let params = {};
    this.apilist.getIfscCode(params).subscribe(res => {

      this.BankNames = res.result['bankDetails'];
      this.DistrictNames = res.result['districtDetails'];
    },
      error => {
        this.error = error
        this.BankNames = []
        this.DistrictNames = []
      }

    );
    this.open(this.someModalRef);


  }
  get j(): { [key: string]: AbstractControl } {
    return this.ifscForm.controls;
  }
  searchIFSC() {
    this.ifscSubmitted = true;
    if (this.ifscForm.invalid) {
      return;
    }
    let params = {
      bankName: this.ifscForm.value.vchBankName,
      distName: this.ifscForm.value.vchDistrictName
    }
    this.apilist.getifscDetails(params)
      .subscribe(
        (data: any) => {
          if (data.status == '1') {
            this.Banks = data.result;
            this.isIFSCFlag = true;
          } else {
            this.isIFSCFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.msg
            });
          }

        },
        error => {
          this.error = error
          this.Banks = [];
          Swal.fire({
            icon: 'error',
            text: 'No Record Found!'
          });
        }

      );
  }
  open(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  selectIFSC(branchName, ifscCode, int_Min_Account_No, int_Max_Account_No) {
    let distName = this.ifscForm.value.vchDistrictName;
    let bankName = this.ifscForm.value.vchBankName;
    if (document.getElementsByClassName("ifsc_dist").length > 0) {
      let ifsc_dist_field: any = document.getElementsByClassName("ifsc_dist")[0];
      let ifsc_dist_name = ifsc_dist_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_dist_name]: distName });
    }
    if (document.getElementsByClassName("ifsc_bank").length > 0) {
      let ifsc_bank_field: any = document.getElementsByClassName("ifsc_bank")[0];
      let ifsc_bank_name = ifsc_bank_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_bank_name]: bankName });
    }
    if (document.getElementsByClassName("ifsc_branch").length > 0) {
      let ifsc_branch_field: any = document.getElementsByClassName("ifsc_branch")[0];
      let ifsc_branch_name = ifsc_branch_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_branch_name]: branchName });
    }
    if (document.getElementsByClassName("ifsc_code").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("ifsc_code")[0];
      let ifsc_code_name = ifsc_code_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_code_name]: ifscCode });
    }
    if (document.getElementsByClassName("ifsc_account").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("ifsc_account")[0];
      ifsc_code_field.setAttribute("minlength", int_Min_Account_No);
      ifsc_code_field.setAttribute("maxlength", int_Max_Account_No);

    }
    this.modalService.dismissAll();
  }

  getDistList() {
    this.blockList = [];
    let param = {
      "parentId": 1,
      "subLevelId": 1,
      "processId": this.schemeId
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

  getBlockList(eVlue: any) {
    if (eVlue != '0') {
      let distData = JSON.parse(eVlue);
      let parentId = distData.val;
      let marType = distData.type;
      if (marType == 0) {
        this.marineType = 0;
      }
      else {
        this.marineType = 1;
      }
      let param = {
        "parentId": parentId,
        "subLevelId": 2,
        "processId": this.schemeId
      }
      this.objMstr.grapCalHirarchy(param).subscribe(res => {
        if (res.status == 1) {
          this.blockList = res.result;
        }
      },
        error => {
          this.blockList = [];
        });
    }
    else {
      this.blockList = [];
    }
  }

  getGpList(eVlue: any) {
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 3,
      "processId": this.schemeId
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.gpList = res.result;
      }
    },
      error => {
        this.gpList = [];
      });
  }

  getVlgList(eVlue: any) {
    if (eVlue > 0) {
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
    }
    else {
      this.vlgList = [];
    }
  }

  getVtOfcrList(eVlue: any) {
    if (this.isServcFlg) {
      let param = {
        "blockId": eVlue
      }
      this.objMstr.getVtOfcrList(param).subscribe(res => {
        if (res.status == 1) {
          this.vtofcrList = res.result;
        }
      },
        error => {
          this.vtofcrList = [];
        });
    }
  }

  // start add/ remove row
  addRow(adMrSctn: any, adMrRow: any, adMrCol: any, adMrArr: any) {
    // for validation
    let valSts = true;
    for (let vrw = 0; vrw <= adMrRow; vrw++) {
      for (let vclm = 0; vclm < adMrCol; vclm++) {
        let adMrCTrlVal = (<HTMLInputElement>document.getElementById(adMrSctn + '_' + vrw + '_' + vclm)).value;
        let adMrClmCls = adMrArr[vclm].columnId;
        let adMrValParam = { "dynDataObj": adMrArr[vclm], "ctrlVal": adMrCTrlVal, "drftSts": this.isDraft, "dispNnSts": false, "ctrlType": 8 };
        if (!this.vldChkLst.dynCtrlVal(adMrValParam, this.el)) {
          valSts = false;
          this.el.nativeElement.querySelector('.' + adMrClmCls).focus();
          break;
        }
      }
    }
    if (valSts) {
      let curObj = this;
      let addMrExObj = this.schemeForm.get(adMrSctn) as UntypedFormArray;
      let addMrObj = this.fb.array([]);
      for (let clm = 0; clm < adMrCol; clm++) {
        let addMrVr = adMrSctn + '_' + (Number(adMrRow) + 1) + '_' + clm;
        addMrObj.controls[addMrVr] = new UntypedFormControl('');
        let addMrVrColTp = adMrArr[clm]['columnType'];
        let cscdTagArr = { 'tagFieldSts': adMrArr[clm]['isDependent'], 'tagFieldId': adMrArr[clm]['parentId'], 'optionArr': adMrArr[clm]['optionArr'], 'staticDepData': adMrArr[clm]['staticDepData'] };
        this.dynElement[addMrVr] = { "val": '', "ctrlType": addMrVrColTp, "dispTagArr": [], "cscdTagArr": cscdTagArr, "secCtrlType": 8 };
      }
      addMrExObj.push(addMrObj);


      for (let clm = 0; clm < adMrCol; clm++) {
        let addMrVr = adMrSctn + '_' + (Number(adMrRow) + 1) + '_' + clm;
        let addPrvMrVr = adMrSctn + '_' + (Number(adMrRow)) + '_' + clm;
        //start for cascading event functionality
        let cscdTagArr = this.dynElement[addPrvMrVr]["cscdTagArr"];
        if (Object.keys(cscdTagArr).length > 0) {
          let ctrlCdTagSts = cscdTagArr['tagFieldSts'];
          let ctrlCdTagFldId = cscdTagArr['tagFieldId'];
          let ctrlCdTagFldVlArr = cscdTagArr['optionArr'];
          if (ctrlCdTagSts == 1) {
            let ctrlPrntSecId = this.dynElement[addPrvMrVr].secCtrlType;
            if (ctrlPrntSecId == 8) {
              let ctrlCdTagPrntFldVlArr = cscdTagArr['staticDepData'];
              setTimeout(function () {
                curObj.setAddMrCscdEvnt(ctrlCdTagFldId, addMrVr, ctrlCdTagFldVlArr, ctrlCdTagPrntFldVlArr, '');
              }, 0);
            }
          }
        }
        // end for cascading event functionality              
      }
    }


  }
  removeRow(adMrSctn: any, adMrRow: any) {
    if (adMrRow > 0) {
      let addMrExObj = this.schemeForm.get(adMrSctn) as UntypedFormArray;
      addMrExObj.removeAt(adMrRow);
    }
    else {
      Swal.fire({
        icon: 'error',
        text: '1st row we cant remove it'
      });
    }
  }
  checkClassExist(cls: any) {
    if (cls.search("bhulekh_tahasil") == 0) {
      return false;
    }
    if (cls.search("bhulekh_ror") == 0) {
      return false;
    }

    return true;
  }

  fillTahasil(eVlue: any, ctrlSelVal: any) {
    let myContainer = <HTMLElement>document.querySelector(".bhulekh_tahasil");
    if (eVlue != '0') {
      let distData = JSON.parse(eVlue);
      let parentId = distData.val;
      let marType = distData.type;
      if (marType == 0) {
        this.marineType = 0;
      }
      else {
        this.marineType = 1;
      }

  
    }
    else {
      myContainer.innerHTML = '<option value="">Select</option>';
    }
  }
  getArea() {
    let valSts = true;
    let btContainer = <HTMLElement>document.querySelector(".bhulekh_tahasil");
    let bhulekh_tahasil_id = btContainer.id;
    let bhulekh_tahasil = (<HTMLInputElement>document.getElementById(bhulekh_tahasil_id)).value;
    if (!this.vldChkLst.selectDropdown(bhulekh_tahasil, "Tahasil")) {
      return false
    }


    let rcContainer = <HTMLElement>document.querySelector(".bhulekh_revenue_circle");
    let bhulekh_revenue_circle_id = rcContainer.id;
    let bhulekh_revenue_circle = (<HTMLInputElement>document.getElementById(bhulekh_revenue_circle_id)).value;
    if (!this.vldChkLst.selectDropdown(bhulekh_revenue_circle, "Revenue Circle")) {
      return false
    }


    let rvContainer = <HTMLElement>document.querySelector(".bhulekh_revenue_village");
    let bhulekh_revenue_village_id = rvContainer.id;
    let bhulekh_revenue_village = (<HTMLInputElement>document.getElementById(bhulekh_revenue_village_id)).value;
    if (!this.vldChkLst.selectDropdown(bhulekh_revenue_village, "Revenue Village")) {
      return false
    }

    let knContainer = <HTMLElement>document.querySelector(".bhulekh_khata_no");
    let bhulekh_khata_no_id = knContainer.id;
    let bhulekh_khata_no = (<HTMLInputElement>document.getElementById(bhulekh_khata_no_id)).value;
    if (!this.vldChkLst.blankCheck(bhulekh_khata_no, "Khata No")) {
      return false
    }


    let pnContainer = <HTMLElement>document.querySelector(".bhulekh_plot_no");
    let bhulekh_plot_no_id = pnContainer.id;
    let bhulekh_plot_no = (<HTMLInputElement>document.getElementById(bhulekh_plot_no_id)).value;
    if (!this.vldChkLst.blankCheck(bhulekh_plot_no, "Plot No")) {
      return false
    }

    let param = {
      "bhulekh_tahasil": bhulekh_tahasil,
      "bhulekh_revenue_circle": bhulekh_revenue_circle,
      "bhulekh_revenue_village": bhulekh_revenue_village,
      "bhulekh_khata_no": bhulekh_khata_no,
      "bhulekh_plot_no": bhulekh_plot_no,
      "selVal": 0
    }
    let bhulekh_ror = <HTMLElement>document.querySelector(".bhulekh_ror");
    let bhulekh_area = <HTMLElement>document.querySelector(".bhulekh_area");
    let bhulekh_area_id = bhulekh_area.id;
    let bhulekh_ror_id = bhulekh_ror.id;
    this.objMstr.grapCalBhulekh(param).subscribe(res => {
      let bhulekh_ror = <HTMLElement>document.querySelector(".bhulekh_ror");
      let bhulekh_area = <HTMLElement>document.querySelector(".bhulekh_area");
      let bhulekh_area_id = bhulekh_area.id;
      if (res.result.status == 1) {
        bhulekh_ror.innerHTML = res.result.optionStr;
        //console.log($("#"+bhulekh_ror_id).val());
        (<HTMLInputElement>document.getElementById(bhulekh_area_id)).value = res.result.Area_Acre;
        this.schemeForm.patchValue({ [bhulekh_area_id]: res.result.Area_Acre });
        this.schemeForm.patchValue({ [bhulekh_ror_id]: $("#"+bhulekh_ror_id).val() });
      } else {
        bhulekh_ror.innerHTML = '<option value="">Select</option>';
        (<HTMLInputElement>document.getElementById(bhulekh_area_id)).value = '';
        this.schemeForm.patchValue({ [bhulekh_area_id]: '' });
      }
    },
      error => {
        bhulekh_ror.innerHTML = '<option value="">Select</option>';
        (<HTMLInputElement>document.getElementById(bhulekh_area_id)).value = '';
        this.schemeForm.patchValue({ [bhulekh_area_id]: '' });
      }
    );
  }
  // end add/ remove row
 


  get k(): { [key: string]: AbstractControl } {
    return this.ifscLoanForm.controls;
  }

  selectLoanIFSC(Ifsc_Id,branchName, ifscCode, int_Min_Account_No, int_Max_Account_No) {
    let distName = this.ifscLoanForm.value.vchDistrictName;
    let bankName = this.ifscLoanForm.value.vchBankName;
    this.BankId = Ifsc_Id;
    if (document.getElementsByClassName("ifsc_dist").length > 0) {
      let ifsc_dist_field: any = document.getElementsByClassName("ifsc_dist")[0];
      let ifsc_dist_name = ifsc_dist_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_dist_name]: distName });
    }
    if (document.getElementsByClassName("loan_bank_name").length > 0) {
      let ifsc_bank_field: any = document.getElementsByClassName("loan_bank_name")[0];
      let ifsc_bank_name = ifsc_bank_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_bank_name]: bankName });
    }
    if (document.getElementsByClassName("loan_bank_branch").length > 0) {
      let ifsc_branch_field: any = document.getElementsByClassName("loan_bank_branch")[0];
      let ifsc_branch_name = ifsc_branch_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_branch_name]: branchName });
    }
    if (document.getElementsByClassName("loan_bank_ifsc").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("loan_bank_ifsc")[0];
      let ifsc_code_name = ifsc_code_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_code_name]: ifscCode });
    }
    if (document.getElementsByClassName("loan_bank_account").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("loan_bank_account")[0];
      ifsc_code_field.setAttribute("minlength", int_Min_Account_No);
      ifsc_code_field.setAttribute("maxlength", int_Max_Account_No);

    }
    this.modalService.dismissAll();
  }
}


