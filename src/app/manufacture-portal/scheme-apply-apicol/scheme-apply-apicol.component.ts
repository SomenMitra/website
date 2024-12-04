import { Component, OnInit, ElementRef, Injectable, ViewChild } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, NG_ASYNC_VALIDATORS, Validators, UntypedFormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import Swal from 'sweetalert2';
import { isNumber } from 'util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebsiteApiService } from '../../website/website-api.service';
import { empty, of } from 'rxjs';
import { trigger } from '@angular/animations';
import { NgbDateParserFormatter, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-scheme-apply-apicol',
  templateUrl: './scheme-apply-apicol.component.html',
  styleUrls: ['./scheme-apply-apicol.component.css'],
  providers: [CitizenProfileService, ValidatorchklistService, NgbDateCustomParserFormatter]

})
export class SchemeApplyApicolComponent implements OnInit {
  loading = false;
  schemeDmgForm = new UntypedFormGroup({});
  schemeForm = new UntypedFormGroup({});
  txtDisclaimer: any;
  schemeId: any;
  respSts: any;
  respDynm: any;
  applctnSts: any;
  apprRsmSts: any;
  dynElement: any = [];
  dynAddMoreElement: any = [];
  dynClass: any = [];
  empRadioValue: any[] = [];
  applicantId: any;
  applctnId: any;
  currentRow: any =0;
  currentClusterRow: any =0;
  mainSectnId: any;
  controlTypeArr: any = [];
  responseSts: any;
  responseDynm: any;
  BhulekhLandInfo: any;
  ClusterLandInfo: any;
  responseInfo: any;
  isDraft = false;
  Banks: any[];
  loanBanks: any[];
  bhulekhLands: any[];
  clusterLands: any[];
  BankNames: any;
  TahasilNames: any;
  ClusterZoneNames:any;
  RevenueCircleNames: any;
  ClusterSubZoneNames: any;
  RevenueVillageNames: any;
  ifscForm: any;
  ifscLoanForm: any;
  bhulekhLandForm: any;
  clusterLandForm: any;
  DistrictNames: any;
  distdataNew: any;
  appDraftSts = environment.constDrftSts;
  appPrevwSts = environment.constPrevwSts;
  sujogPortal = environment.sujogPortal;
  ifscSubmitted = false;
  ifscLoanSubmitted = false;
  bhulekhLandSubmitted = false;
  clusterLandSubmitted = false;
  isIFSCFlag = false;
  isBhulekhLandFlag = false;
  isClusterLandFlag = false;
  isLoanIFSCFlag = false;
  error: any;
  searchform = new UntypedFormGroup({});
  intdirectorate =0;
  schemeName = null;
  schemeType = null;

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
  lang = '';
  marineType = 0;
  distLabel = 'District';
  blockLabel = 'Block / ULB';
  gpLabel = 'GP / Ward';
  schemeTypeId = 0;
  loantype = 0;
  BankId = 0;
  removeOption = ["bhulekh_tahasil"];
  @ViewChild('someModal') someModalRef: ElementRef;
  @ViewChild('someLoanModal') someLoanModalRef: ElementRef;
  @ViewChild('someBhulekhModal') someBhulekhModalRef: ElementRef;
  @ViewChild('someClusterModal') someClusterModalRef: ElementRef;
  docSectnSts = false; // document section display/ not
  isMobile = false;
  verifySts=0;
  verifyFinalSubmit=1;
  schmServType=0;
  regStatus=0;
  cityList: any[] = [];
  intBlockUlb =1;
  APICOL_LAND_INFO :any=environment.APICOL_BHULKEH_LAND_INFO;
  mkuy_project_id = 0;
  mkuy_project_key = '';
  mkuyProjectId :any ='';
  intOnlineProfileId:any;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private objSchmCtrl: CitizenSchemeService,
    private encDec: EncryptDecryptService,
    private apilist: WebsiteApiService,
    public vldChkLst: ValidatorchklistService,
    private el: ElementRef,
    private modalService: NgbModal,
    private objMstr: CitizenMasterService,
    private objProf: CitizenProfileService,
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.isMobile = this.mobileCheck();
    let schmSesnInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    this.schemeName = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;
    this.schemeTypeId = schmSesnInfo.FFS_APPLY_SCHEME_TYPE_ID;


    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    // console.log(schmSesnInfo);
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.applctnId = schemeArr[1];
    this.getSchmDmgCtrls();
    this.getSchmDynmCtrls();
    this.lang = localStorage.getItem('locale');
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
        this.schmServType = (schmHrDt.hasOwnProperty('schmServType')) ? schmHrDt.schmServType : 0;
        this.regStatus = (schmHrDt.hasOwnProperty('regStatus')) ? schmHrDt.regStatus : 0;
        this.apprRsmSts = (schmHrDt.hasOwnProperty('apprRsmSts')) ? schmHrDt.apprRsmSts : 0;
        this.districtId = (schmHrDt.hasOwnProperty('districtId')) ? schmHrDt.districtId : 0;
        this.blockId = (schmHrDt.hasOwnProperty('blockId')) ? schmHrDt.blockId : 0;
        this.intOnlineProfileId = (schmHrDt.hasOwnProperty('intOnlineProfileId')) ? schmHrDt.intOnlineProfileId : 0;
        this.BankId = (schmHrDt.hasOwnProperty('BankId')) ? schmHrDt.BankId : 0;
        this.gpId = (schmHrDt.hasOwnProperty('gpId')) ? schmHrDt.gpId : 0;
        this.villageId = (schmHrDt.hasOwnProperty('villageId')) ? schmHrDt.villageId : 0;
        this.vtOfcrId = (schmHrDt.hasOwnProperty('vtOfcrId')) ? schmHrDt.vtOfcrId : 0;
        this.marineType = (schmHrDt.hasOwnProperty('marineType')) ? schmHrDt.marineType : 0;
        this.docSectnSts = (schmHrDt.hasOwnProperty('schmServDocSctn')) ? schmHrDt.schmServDocSctn : 0;
        let directorate = (schmHrDt.hasOwnProperty('directorate')) ? schmHrDt.directorate : 0;
        this.intdirectorate = directorate;
        this.isServcFlg = (this.schemeTypeId == environment.constService && directorate == 2) ? true : false;
        this.txtDisclaimer = (schmHrDt.hasOwnProperty('txtDisclaimer')) ? schmHrDt.txtDisclaimer : '';
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

          this.getBlockList(distData,this.blockId);
        }
        if (this.blockId > 0) {
          this.getVtOfcrList(this.blockId);
          this.getGpList(this.blockId);
        }
        if (this.gpId > 0) {
          this.getVlgList(this.gpId);
        }
        if(this.schemeId==environment.sujogPortal){
          //this.loading=true;
          let apiParam = {
            "schemeId":this.schemeId
          }
          this.objProf.getRedirectCityAPI(apiParam).subscribe(res => {
            if (res.status == 1) {
              //this.loading=false;
              this.cityList = res.result.resultInfo;
              //console.log(this.cityList);
            }
          });
        }else{
          this.cityList   = [];
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
            if (ctrlClass == 'mkuy_project') {
              this.mkuyProjectId = ctrlNm;
            }
            if (ctrlClass == 'bhulekh_ror') {
              this.ror = ctrlNm;
            }
            // this.dynClass[ctrlNm] = ctrlClass;
            // start of ctrl add more type
            if (ctrlArr['tinControlType'] == 8) {
              //console.log(ctrlArr['vchLabelName']);
              let addCtrlVal = ctrlArr['jsnControlArray'][0]['ctrlValue'];
              let addMoreFldVal = ctrlArr['vchFieldValue'] != '' ? ctrlArr['vchFieldValue'] : addCtrlVal != '' ? addCtrlVal : '';
              this.dynAddMoreElement[ctrlNm] = { "val": addMoreFldVal, "ctrlType": ctrlArr['tinControlType'], "dispTagArr": ctrlArr['jsnDispTagArray'][0] };


              let ctrlVal = (ctrlArr['vchFieldValue'] != '') ? ctrlArr['vchFieldValue'] : [];
              if (Object.keys(ctrlVal).length > 0) {

                let ctrlAddMore = ctrlVal['addMoreData'];
                let columnData = ctrlVal['columnData'];
                //console.log(ctrlAddMore); return false
                scmFrmObj[ctrlNm] = new UntypedFormArray([]);
                for (let addMoreInfo in ctrlAddMore) {
                  let addMrowInfo = ctrlAddMore[addMoreInfo];
                  let addMrObj = this.fb.array([]);
                  for (let addMcolInfo in addMrowInfo) {
                    let addMrVrNm = addMrowInfo[addMcolInfo]['elementId'];
                    let addMrVrVal = addMrowInfo[addMcolInfo]['elementVal'];
                    let addMrVrColTp = addMrowInfo[addMcolInfo]['colType'];
                    addMrObj.controls[addMrVrNm] = new UntypedFormControl([]);
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
                  addMrObj.controls[addMrVr] = new UntypedFormControl([]);
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
              scmFrmObj[ctrlNm] = new UntypedFormControl([]);
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
        this.loading = false;
      }
    });
  }

  setDynamicVal() {
    let dynObjKey = Object.keys(this.dynElement); //console.log(this.dynElement); console.log(this.dynAddMoreElement);

    let addMoreCtrl = [];
    dynObjKey.forEach((field: any) => {
      if (this.dynElement[field].secCtrlType == 8) {
        //console.log(field);
        (<HTMLInputElement>document.getElementById(field)).value = this.dynElement[field].val!=''?this.dynElement[field].val:'';
        if (!addMoreCtrl.includes(this.dynElement[field].addMoreCtrlName)) {
          addMoreCtrl.push(this.dynElement[field].addMoreCtrlName);
        }
      }
    });

    // if (this.tahasilId != '' && this.tahasilId != 'undefined') {
    //   let tahasilVal = this.dynElement[this.tahasilId]["val"];
    //   if (this.districtId > 0) {
    //     this.fillTahasil(this.distdataNew, tahasilVal);
    //   }
    // }
     if (this.mkuyProjectId != '' && this.mkuyProjectId != 'undefined') {
      let tahasilVal = this.dynElement[this.mkuyProjectId]["val"];
      if(parseInt(tahasilVal)==environment.APICOL_CAGE_CULTURE){
        $("#"+environment.APICOL_CAGE_CULTURE_LAND_INFO).css('display','block');
        $("#"+environment.APICOL_BHULKEH_LAND_INFO).css('display','none');
        this.APICOL_LAND_INFO=environment.APICOL_CAGE_CULTURE_LAND_INFO;
        this.mkuy_project_id=parseInt(tahasilVal);
      }else{
        $("#"+environment.APICOL_CAGE_CULTURE_LAND_INFO).css('display','none');
        $("#"+environment.APICOL_BHULKEH_LAND_INFO).css('display','block');
        this.APICOL_LAND_INFO=environment.APICOL_BHULKEH_LAND_INFO;
        this.mkuy_project_id=0;
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
    let cls_declaration = <HTMLElement>document.querySelector(".cls_declaration");
    // console.log(cls_declaration);
    if(cls_declaration!=null ){
      let cls_declaration_id = cls_declaration.getAttribute('name');
      $('label[for="'+cls_declaration_id+'"]').html('');
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
    let ctrlElement = document.getElementsByClassName('sum_item');
    let sumClassLength = ctrlElement.length;
    for (let i = 0; i < sumClassLength; i++) {
      let sumCtrlId = ctrlElement[i].getAttribute('id');
      let curObj = this;
      document.getElementById(sumCtrlId).addEventListener("keyup", function () { curObj.calculateSum() }, false);
    }
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
    let cityId='';
    if (this.schemeDmgForm.status === 'VALID' && this.schemeId!=environment.sujogPortal) {
      let districtIdObj: any = (<HTMLInputElement>document.getElementById('selDistrict')).value;
      // console.log(districtIdObj);
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
      else if (!this.vldChkLst.selectDropdown(blockIdP, "Block/ ULB")) {
        valSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(gpIdP, "GP/ Ward")) {
        valSts = false;
      }
      else {
        if (this.marineType == 0 &&  this.intBlockUlb==1) {
          if (!this.vldChkLst.selectDropdown(vlgIdP, "Village")) {
            valSts = false;
          }
        }

        if (this.isServcFlg) {
          if (!this.vldChkLst.selectDropdown(vtOfcrIdP, "Veterinary Officer")) {
            valSts = false;
          }
        }
      }

    }else if(this.schemeId==environment.sujogPortal){
      cityId=(document.getElementById('cityId') as HTMLTextAreaElement).value;
      if (!this.vldChkLst.blankCheck(cityId, "City")) {
        return false
      }
      let label11=document.getElementsByClassName("sujog_locality");
      let labelId11 = label11[0].getAttribute('id');
      let locality=(document.getElementById(labelId11) as HTMLTextAreaElement).value;
      if (!this.vldChkLst.blankCheck(locality, "Locality")) {
        return false
      }
      let label12=document.getElementsByClassName("sujog_ward");
      let labelId12 = label12[0].getAttribute('id');
      let ward=(document.getElementById(labelId12) as HTMLTextAreaElement).value;
      if (!this.vldChkLst.blankCheck(ward, "Ward")) {
        return false
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
        // console.log(this.schemeForm.controls);
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
          // console.log(this.controlTypeArr[key]['vchLabelName']);
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
          // console.log(addmoreFlagDep);
          let classCheckFlag = false;
          let objAddMr = { "addMoreData": [], "columnData": [] };
          let obChldjColAddMr = [];
          let adMrArr = this.schemeForm.controls[key] as UntypedFormArray;
          let AddMoreCount = 0;
          let adMrClmNmame = '';
          // console.log(adMrArr);
          for (let adMrCtrlRw = 0; adMrCtrlRw < adMrArr.controls.length; ++adMrCtrlRw) {

            let adMrClArr = (adMrArr.controls[adMrCtrlRw]) as UntypedFormArray;
            let objCtrlKey = Object.keys(adMrClArr.controls);
            let obChldjAddMr = [];
            AddMoreCount++;
            //console.log(objCtrlKey);
            for (let adMrCtrlCl = 0; adMrCtrlCl < objCtrlKey.length; ++adMrCtrlCl) {

              let adMrCTrlVal = (<HTMLInputElement>document.getElementById(key + '_' + adMrCtrlRw + '_' + adMrCtrlCl)).value;
              // console.log(key + '_' + adMrCtrlRw + '_' + adMrCtrlCl);
              // console.log(adMrCTrlVal);
              let adMrCTrlType = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnType;
              let adMrClmNm = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnName;
              adMrClmNmame = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnName;
              let adMrClmCls = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnId;
              let columnCls = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnCls;
              if(columnCls =='cls_group_enterprise'){
                classCheckFlag = true;
              }

              // for validation

              if(addmoreFlagDep==1){
                // console.log($('#'+this.controlTypeArr[key]['vchLabelName']).css('display'));
                if($('#'+this.controlTypeArr[key]['vchLabelName']).css('display') == 'block'){
                  let adMrValParam = { "dynDataObj": this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl], "ctrlVal": adMrCTrlVal, "drftSts": this.isDraft, "dispNnSts": dispNnSts, "ctrlType": ctrlType };

                  if (!this.vldChkLst.dynCtrlVal(adMrValParam, this.el)) {
                    valSts = false;
                    this.el.nativeElement.querySelector('.' + adMrClmCls).focus();
                    return false;
                  }

                  else {
                    // console.log("adMrCTrlVal");
                    // console.log( key + '_' + adMrCtrlRw + '_' + adMrCtrlCl);
                    let arrAddMr = {
                      "elementId": key + '_' + adMrCtrlRw + '_' + adMrCtrlCl,
                      "elementVal": adMrCTrlVal,
                      "colName": adMrClmNm,
                      "colType": adMrCTrlType,
                      "slno": (adMrCtrlCl + 1)
                    };

                    obChldjAddMr.push(arrAddMr);
                    if (adMrCtrlRw == 0) {
                      let arrAddColMr = {
                        "colName": adMrClmNm,
                        "colType": adMrCTrlType,
                        "slno": (adMrCtrlCl + 1)
                      };
                      obChldjColAddMr.push(arrAddColMr);
                    }
                  }
                }
              }
              // end for validation
              // adMrClArr.clear();
            }
            //  adMrArr.clear();
           ///console.log(obChldjAddMr);
            (objAddMr.addMoreData).push(obChldjAddMr);

            // return false;
          }

          if(AddMoreCount<2 && this.isDraft==false && addmoreFlagDep==1 && this.intdirectorate==environment.APICOL_Directorate && classCheckFlag){
            Swal.fire({
              icon: 'error',
              text: ' Minimum 2 group member details required'
            });
            return false;
          }else if(AddMoreCount>20 && this.isDraft==false && addmoreFlagDep==1 && this.intdirectorate==environment.APICOL_Directorate && classCheckFlag){
            Swal.fire({
              icon: 'error',
              text: 'Maximum 20 group member details required'
            });
            return false;
          }
          if(this.controlTypeArr[key]['vchLabelName']==environment.APICOL_CAGE_CULTURE_LAND_INFO){
            if(AddMoreCount>2){
              Swal.fire({
                icon: 'error',
                text: 'Maximum 2 land details are allowed!'
              });
              return false;
            }
          }
          objAddMr.columnData = obChldjColAddMr;
          dispNnSts = false;
          elmVal = JSON.stringify(objAddMr);
        }
        else {
          dispNnSts = this.el.nativeElement.querySelector('.clsDiv_' + key).classList.contains('d-none');
        }
        let ctrlDtls = '';
        let ctrlValParam = { "dynDataObj": this.controlTypeArr[key], "ctrlVal": elmVal, "drftSts": this.isDraft, "dispNnSts": dispNnSts, "ctrlType": ctrlType };

        let ctrlClass = this.controlTypeArr[key]['jsnControlArray'][0]['ctrlClass'];
        //  console.log(ctrlClass);
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
    // console.log(ctrlParam);
    //return false;
    var intMkuyProjectSector = $(".sector_of_project").val();
    var vchmeanoffinance = $(".means_of_finance").val();
    var intMkuyProjectType = $(".mkuy_project").val();
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
        "connectionCat":'',
        "connectionType":'',
        "usageType": '',
        "holderMob": '',
        "holderName": '',
        "holderGender": '',
        "holderGName": '',
        "holderRelation": '',
        "holderAddress": '',
        "holderCat":'',
        "access_token":'',
        "connectionCity":'',
        "locality":'',
        "ward":'',
        "BankId":this.BankId,
        "onlineServiceId":this.applctnId,
        "intMkuyProjectSector":intMkuyProjectSector,
        "intMkuyProjectType":intMkuyProjectType,
        "vchmeanoffinance":vchmeanoffinance

      }

      if(this.schemeId==environment.sujogPortal){
        let connectionCity=(document.getElementById('cityId') as HTMLTextAreaElement).value;
        let label=document.getElementsByClassName("sujog_connCat");
        let labelId = label[0].getAttribute('id');
        let connectionCat=(document.getElementById(labelId) as HTMLTextAreaElement).value;

        let label2=document.getElementsByClassName("sujog_connType");
        let labelId2 = label2[0].getAttribute('id');
        let connectionType=(document.getElementById(labelId2) as HTMLTextAreaElement).value;

        let label3=document.getElementsByClassName("sujog_usageType");
        let labelId3 = label3[0].getAttribute('id');
        let usageType=(document.getElementById(labelId3) as HTMLTextAreaElement).value;

        let label4=document.getElementsByClassName("sujog_holderMob");
        let labelId4 = label4[0].getAttribute('id');
        let holderMob=(document.getElementById(labelId4) as HTMLTextAreaElement).value;

        let label5=document.getElementsByClassName("sujog_holderName");
        let labelId5 = label5[0].getAttribute('id');
        let holderName=(document.getElementById(labelId5) as HTMLTextAreaElement).value;

        let label6=document.getElementsByClassName("sujog_holderGender");
        let labelId6 = label6[0].getAttribute('id');
        let holderGender=(document.getElementById(labelId6) as HTMLTextAreaElement).value;

        let label7=document.getElementsByClassName("sujog_holderGName");
        let labelId7 = label7[0].getAttribute('id');
        let holderGName=(document.getElementById(labelId7) as HTMLTextAreaElement).value;

        let label8=document.getElementsByClassName("sujog_holderRelation");
        let labelId8 = label8[0].getAttribute('id');
        let holderRelation=(document.getElementById(labelId8) as HTMLTextAreaElement).value;

        let label9=document.getElementsByClassName("sujog_holderAddress");
        let labelId9 = label9[0].getAttribute('id');
        let holderAddress=(document.getElementById(labelId9) as HTMLTextAreaElement).value;

        let label10=document.getElementsByClassName("sujog_holderCat");
        let labelId10 = label10[0].getAttribute('id');
        let holderCat=(document.getElementById(labelId10) as HTMLTextAreaElement).value;

        let label11=document.getElementsByClassName("sujog_locality");
        let labelId11 = label11[0].getAttribute('id');
        let locality=(document.getElementById(labelId11) as HTMLTextAreaElement).value;

        let label12=document.getElementsByClassName("sujog_ward");
        let labelId12 = label12[0].getAttribute('id');
        let ward=(document.getElementById(labelId12) as HTMLTextAreaElement).value;

        schemeParam = {
          "profileId": this.applicantId,
          "schemeId": this.schemeId,
          "dynCtrlParm": ctrlParam,
          "drftSts": this.isDraft,
          "districtId": districtIdP,
          "blockId": blockIdP,
          "gpId": gpIdP,
          "vlgId": vlgIdP,
          "vtOfcrId": vtOfcrIdP,
          "connectionCat": connectionCat,
          "connectionType": connectionType,
          "usageType": usageType,
          "holderMob": holderMob,
          "holderName": holderName,
          "holderGender": holderGender,
          "holderGName": holderGName,
          "holderRelation": holderRelation,
          "holderAddress": holderAddress,
          "holderCat":holderCat,
          "access_token":localStorage.getItem("sujogaccess_token"),
          "connectionCity":connectionCity,
          "locality":locality,
          "ward":ward,
          "BankId":this.BankId,
          "onlineServiceId":this.applctnId,
          "intMkuyProjectSector":intMkuyProjectSector,
          "intMkuyProjectType":intMkuyProjectType,
          "vchmeanoffinance":vchmeanoffinance
      }
    }

      this.objSchmCtrl.schemeApply(schemeParam).subscribe(res => {
        if (res.status == 1) {
          if (this.isDraft) {
            Swal.fire({
              icon: 'success',
              text: res.msg
            });
          }
          else {
            this.applctnId = res.appCtnId;
            if (this.docSectnSts) {
              let encAppCtnId = this.encDec.encText((this.schemeId + ':' + res.appCtnId + ':' + this.apprRsmSts).toString());
              this.router.navigate(['/citizen-portal/scheme-document-apicol', encAppCtnId]);
            }
            else {
              let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId + ':1').toString());
              this.router.navigate(['/citizen-portal/scheme-preview-apicol', encAppCtnId]);
            }
          }
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      },
        error => {
          Swal.fire({
            icon: 'error',
            text: environment.errorMsg
          });
        });
    }

  }
  goToBack() {
    let docSecAvl = (this.docSectnSts) ? 1 : 0;
    let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId + ':' + docSecAvl).toString());
    this.router.navigate(['/citizen-portal/profile-update', encAppCtnId]);
  }

  keyPressEvt(type: any, evt: any, crtId: any) {

    let sts: any;
    // console.log(crtId)
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

    this.schemeForm.patchValue({ [crtId]: sts });

  }

  keyUpEvt(type: any, evt: any, crtId: any) {
    if (this.isMobile) {
      this.keyPressEvtMob(type, evt, crtId);
    }
    // console.log(this.jsnFormulaCalculation);
    for(let cal in this.jsnFormulaCalculation){

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
        let className = (<HTMLInputElement>document.getElementById(cal)).className;
        if(className.includes('average')){
          let newT = eval(str);
          let no_of_net_profit:any = environment.NO_NET_PROFIT_YEAR;
          console.log(no_of_net_profit);
          let newVal:any = parseFloat(newT)/parseInt(no_of_net_profit);
          $('#'+ cal).val(parseFloat(newVal).toFixed(2));
          this.schemeForm.patchValue({ [cal]: parseFloat(newVal).toFixed(2) });
        }else{
          (<HTMLInputElement>document.getElementById(cal)).value = eval(str);
          this.schemeForm.patchValue({ [cal]: eval(str) });
        }
        //console.log( (<HTMLInputElement>document.getElementById(cal)).className);

        document.getElementById(cal).setAttribute("readonly","readonly");
        $('#'+ cal).parents('.form-group').find("small").remove();
        $('#'+ cal).parents('.form-group').append('<small class="d-block mt-1">'+this.vldChkLst.price_in_words((<HTMLInputElement>document.getElementById(cal)).value)+'</small>');

      }

    }
    var li = document.getElementById(crtId);
    let cls = li.className;
    if (cls.search("cls_word") > 0) {
      $('#'+ crtId).parents('.form-group').find("small").remove();
      var price=(<HTMLInputElement>document.getElementById(crtId)).value;
      if(price!=''){
        var splitprice=price.split('.');
        var whole=this.vldChkLst.price_in_words(splitprice[0]);
        var str='';
        if(splitprice.length==2){
          if(splitprice[1].length>2){
            str='Enter only two digit after decimal';
          }
          else{
            var fraction=this.vldChkLst.price_in_words(splitprice[1]);
            str=whole +'Rupees and ' +fraction +'Paisa Only';
          }

        }
        else{
          str=whole +'Rupees Only';
        }
        $('#'+ crtId).parents('.form-group').append('<small class="d-block mt-1">'+str+'</small>');
      }

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
        sectnUrl = '/citizen-portal/scheme-apply-apicol';
        break;
      case "3":
        let sectnDecStr = this.encDec.decText(sectnEncStr);
        sectnEncStr = this.encDec.encText((sectnDecStr + ':' + this.apprRsmSts).toString());
        sectnUrl = '/citizen-portal/scheme-document-apicol';
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

  getBlockList(eVlue: any,block:any) {
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


  getGpListNew(event: any) {
    let eVlue = event.value;
    this.intBlockUlb = event.options[event.selectedIndex].getAttribute('data-val');
    // console.log(this.intBlockUlb);
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
  addRow(adMrSctn: any, adMrRow: any, adMrCol: any, adMrArr: any,cls:any) {
     console.log(adMrCol);
    if(cls.includes('cage_culture_zone')){
      let len = $(".cage_culture_zone").length;
      if(len>=2){
        Swal.fire({
          icon: 'error',
          text: 'Maximum 2 land details are allowed!'
        });
        return false;
      }
    }
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
        // console.log(addMrVr+'============================');
        // console.log( this.dynElement[addMrVr]);
      }
      addMrExObj.push(addMrObj);


      for (let clm = 0; clm < adMrCol; clm++) {
        let addMrVr = adMrSctn + '_' + (Number(adMrRow) + 1) + '_' + clm;
        let addPrvMrVr = adMrSctn + '_' + (Number(adMrRow)) + '_' + clm;
        // console.log(addMrVr+'===PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP')
        // console.log(addPrvMrVr+'============================');
        //start for cascading event functionality
        let cscdTagArr = this.dynElement[addMrVr]["cscdTagArr"];
        if (Object.keys(cscdTagArr).length > 0) {
          let ctrlCdTagSts = cscdTagArr['tagFieldSts'];
          let ctrlCdTagFldId = cscdTagArr['tagFieldId'];
          let ctrlCdTagFldVlArr = cscdTagArr['optionArr'];
          if (ctrlCdTagSts == 1) {
            // console.log(addMrVr+'===PPPPPPPPPPPPPPPPPPPPPPPPPPPPPP')
            let ctrlPrntSecId = this.dynElement[addMrVr].secCtrlType;
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

      // myContainer.innerHTML = '<option value="1">1</option><option value="2">2</option>';
      let param = {
        "parentId": parentId,
        "processId": this.schemeId,
        "ctrlSelVal": ctrlSelVal,
      }
      this.objMstr.grapCalTahasil(param).subscribe(res => {
        // console.log(res);
        let myContainer = <HTMLElement>document.querySelector(".bhulekh_tahasil");
        if (res.status == 1) {
          myContainer.innerHTML = res.result.optionStr;
        } else {
          myContainer.innerHTML = '<option value="">Select</option>';
        }
      },
        error => {
          myContainer.innerHTML = '<option value="">Select</option>';
        });
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
        Swal.fire({
          icon: 'error',
          text: 'Invalid Land Details'
        });
      }
    },
      error => {
        bhulekh_ror.innerHTML = '<option value="">Select</option>';
        (<HTMLInputElement>document.getElementById(bhulekh_area_id)).value = '';
        this.schemeForm.patchValue({ [bhulekh_area_id]: '' });
        Swal.fire({
          icon: 'error',
          text: 'Invalid Land Details'
        });
      }
    );
  }
  // end add/ remove row
  getLoanIFSC() {
    //this.loantype=1;
    this.loanBanks = [];
    this.ifscLoanForm = new UntypedFormGroup({
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

    let params = {
      loantype :1
    };
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
    this.open(this.someLoanModalRef);


  }

  searchLoanIFSC() {
    this.ifscLoanSubmitted = true;
    if (this.ifscLoanForm.invalid) {
      return;
    }
    let params = {
      bankName: this.ifscLoanForm.value.vchBankName,
      distName: this.ifscLoanForm.value.vchDistrictName
    }
    this.apilist.getifscDetails(params)
      .subscribe(
        (data: any) => {
          if (data.status == '1') {
            this.loanBanks = data.result;
            this.isLoanIFSCFlag = true;
          } else {
            this.isLoanIFSCFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.msg
            });
          }

        },
        error => {
          this.error = error
          this.loanBanks = [];
          Swal.fire({
            icon: 'error',
            text: 'No Record Found!'
          });
        }

      );
  }
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

      let ifsc_bank_name = ifsc_bank_field.getAttribute('name');
      // console.log(ifsc_bank_field);
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

  verifySujog(){
    //let cityId=document.getElementById('cityId');
    let cityId=(document.getElementById('cityId') as HTMLTextAreaElement).value;
    if (!this.vldChkLst.blankCheck(cityId, "City")) {
      return false
    }
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let applicantName = farmerInfo.USER_FULL_NAME;
    let applicantMob = farmerInfo.USER_MOBILE;
    let regStatus=this.regStatus;
    if(regStatus==0){
      let apiParam = {
        "name":applicantName,
        "permanentCity":cityId,
        "mobileNumber":applicantMob
      }
      this.objProf.getRedirectSujogRegAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          let resStatus=res.result.resultInfo;

          if(resStatus==true){
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
        "mobileNo":applicantMob
      }
      this.objProf.getRedirectSujogLoginAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          let resStatus=res.result.resultInfo;
          //console.log(res);

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
    let cityId=(document.getElementById('cityId') as HTMLTextAreaElement).value;
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let applicantName = farmerInfo.USER_FULL_NAME;
    let applicantMob = farmerInfo.USER_MOBILE;
    let mobileNoS = applicantMob;
    let appName = applicantName;
    let cityName = cityId;
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
        let resStatus=res.result.resultInfo.resStatus;
        let access_token=res.result.resultInfo.access_token;
        localStorage.setItem("sujogaccess_token", access_token);
        //console.log(localStorage.getItem("sujogaccess_token"));

        if(resStatus==true){
          this.verifySts=1;
          this.verifyFinalSubmit=0;
          //this.emailNotification1()
          let apiParam = {
            "cityId":cityName,
            "acces_token":localStorage.getItem("sujogaccess_token")
          }
          this.objProf.getRedirectLocationAPI(apiParam).subscribe(res => {
            let localityOPT = <HTMLElement> document.querySelector(".sujog_locality");
            if (res.status == 1) {
              let localityList=res.result.resultInfo;
              localityOPT.innerHTML = localityList;
            }
          });
          this.objProf.getRedirectWardAPI(apiParam).subscribe(res => {
            let wardOPT = <HTMLElement> document.querySelector(".sujog_ward");
            if (res.status == 1) {
              let wardList=res.result.resultInfo;
              wardOPT.innerHTML = wardList;
            }
          });

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
      Swal.fire({
        icon: 'error',
        text: '`Please Entered OTP'
      });
      //Swal.fire(`Please Entered OTP`)
    }
  }

  async emailNotification1(){
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
    let cityId=(document.getElementById('cityId') as HTMLTextAreaElement).value;
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let applicantName = farmerInfo.USER_FULL_NAME;
    let applicantMob = farmerInfo.USER_MOBILE;
    let mobileNoS = applicantMob;
    let appName = applicantName;
    let cityName = cityId;
    let apiParam={
      "otpReference":otpReference,
      "mobileNo":mobileNoS,
      "name":appName,
      "permanentCity":cityName
    }
    this.objProf.getRedirectSujogLoginOTPAPI(apiParam).subscribe(res => {
      if (res.status == 1) {
        let resStatus=res.result.resultInfo.resStatus;
        let access_token=res.result.resultInfo.access_token;
        localStorage.setItem("sujogaccess_token", access_token);
        //console.log(localStorage.getItem("sujogaccess_token"));

        if(resStatus==true){
          this.verifySts=1;
          this.verifyFinalSubmit=0;
            let apiParam = {
              "cityId":cityName,
              "acces_token":localStorage.getItem("sujogaccess_token")
            }
            this.objProf.getRedirectLocationAPI(apiParam).subscribe(res => {
              let localityOPT = <HTMLElement> document.querySelector(".sujog_locality");
              if (res.status == 1) {
                let localityList=res.result.resultInfo;
                localityOPT.innerHTML = localityList;
              }
            });
            this.objProf.getRedirectWardAPI(apiParam).subscribe(res => {
              let wardOPT = <HTMLElement> document.querySelector(".sujog_ward");
              if (res.status == 1) {
                let wardList=res.result.resultInfo;
                wardOPT.innerHTML = wardList;
              }
            });

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
        // Swal.showValidationMessage(
        //   `Please Entered OTP`
        // )

    }
  }

  enableAddMoreDisable(controlName, className) {
    // console.log(className);
    if(typeof className!=='undefined'){
      if (className.includes('bhulekh_readonly') ) {

        return true;
      }
      else if(className.includes('cage_culture_readonly')){
        return true;
      }
      else {
        return false;
      }
    }
  }

  getBhulekhArea(adRowCtr:any){
    this.isBhulekhLandFlag = false;
    this.bhulekhLandSubmitted = false;
    this.currentRow =adRowCtr;
    let districtIdP = 0;
    let districtIdObj: any = (<HTMLInputElement>document.getElementById('selDistrict')).value;
    if (districtIdObj != '0') {
      districtIdObj = JSON.parse(districtIdObj);
      districtIdP = districtIdObj.val;
    }
    if(districtIdP==0){
      Swal.fire({
        icon: 'error',
        text: 'Select district'
      });
      return false;
    }

    // console.log(districtIdP);
    this.bhulekhLands = [];
    this.bhulekhLandForm = new UntypedFormGroup({
      'vchBhulekhTahasil': new UntypedFormControl('',
        [
          Validators.required,
        ]
      ),
      'vchBhulekhRevenueCircle': new UntypedFormControl('',
        [
          Validators.required,
        ]
      ),
      'vchBhulekhRevenueVillage': new UntypedFormControl('',
        [
          Validators.required,
        ]
      ),
      'vchBhulekhKhataNo': new UntypedFormControl('',
        [
          Validators.required,
        ]
      ),
      'vchBhulekhPlotNo': new UntypedFormControl('',
        [
          Validators.required,
        ]
      )
    });

    let params = {
      "parentId": districtIdP
    }
    this.apilist.getTahasil(params).subscribe(res => {

      this.TahasilNames = res.result['tahasilDetails'];
      // console.log(this.TahasilNames);
    },
      error => {
        this.error = error
        this.TahasilNames = []
      }

    );
    this.open(this.someBhulekhModalRef);

  }

  get l(): { [key: string]: AbstractControl } {
    return this.bhulekhLandForm.controls;
  }

  getRevenueCircle(eVlue: any) {
    let params = {
      "parentId": eVlue
    }
    this.apilist.getRevenueCircle(params).subscribe(res => {
      this.RevenueCircleNames = res.result['RevenueCircleDetails'];
      // console.log(this.RevenueCircleNames);
    },
      error => {
        this.error = error
        this.RevenueCircleNames = []
      }

    );
  }

  getRevenueVillage(eVlue: any) {
    let params = {
      "parentId": eVlue
    }
    this.apilist.getRevenueVillage(params).subscribe(res => {
      this.RevenueVillageNames = res.result['RevenueVillageDetails'];
    },
      error => {
        this.error = error
        this.RevenueVillageNames = []
      }

    );
  }

  searchBhulekhLand() {
    this.bhulekhLandSubmitted = true;
    if (this.bhulekhLandForm.invalid) {
      return;
    }
    let params = {
      bhulekh_tahasil: this.bhulekhLandForm.value.vchBhulekhTahasil,
      bhulekh_revenue_circle: this.bhulekhLandForm.value.vchBhulekhRevenueCircle,
      bhulekh_revenue_village: this.bhulekhLandForm.value.vchBhulekhRevenueVillage,
      bhulekh_khata_no: this.bhulekhLandForm.value.vchBhulekhKhataNo,
      bhulekh_plot_no: this.bhulekhLandForm.value.vchBhulekhPlotNo,
    }
    this.apilist.searchBhulekhLand(params)
      .subscribe(
        (data: any) => {
          // console.log(data)
          if (data.result.status == '1') {
            this.BhulekhLandInfo= data.result.landInfo;
            this.isBhulekhLandFlag = true;
          } else {
            this.isBhulekhLandFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.result.message
            });
          }

        },
        error => {
          this.isBhulekhLandFlag = false;
          this.error = error
          this.BhulekhLandInfo = [];
          Swal.fire({
            icon: 'error',
            text: 'No Record Found!'
          });
        }

      );
  }
  selectBhulekhLand(BhulekhLandData:any){
    // console.log(BhulekhLandData);
    let CurRow = this.currentRow
    var bhulekh_more_tahasil = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_tahasil').attr('id');
    $("#"+bhulekh_more_tahasil).val(BhulekhLandData.vch_tahsil);
    this.schemeForm.patchValue({ [bhulekh_more_tahasil]:BhulekhLandData.vch_tahsil });

    var bhulekh_more_revenue_circle = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_revenue_circle ').attr('id');
    $("#"+bhulekh_more_revenue_circle).val(BhulekhLandData.vch_revenue_circle);
    this.schemeForm.patchValue({ [bhulekh_more_revenue_circle]:BhulekhLandData.vch_revenue_circle });

    var bhulekh_more_revenue_village  = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_revenue_village').attr('id');
    $("#"+bhulekh_more_revenue_village).val(BhulekhLandData.vch_village);
    this.schemeForm.patchValue({ [bhulekh_more_revenue_village]:BhulekhLandData.vch_village });

    var bhulekh_more_khata_no   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_khata_no').attr('id');
    $("#"+bhulekh_more_khata_no).val(BhulekhLandData.khata_no);
    this.schemeForm.patchValue({ [bhulekh_more_khata_no]:BhulekhLandData.khata_no });

    var bhulekh_more_plot_no   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_plot_no').attr('id');
    $("#"+bhulekh_more_plot_no ).val(BhulekhLandData.plot_no);
    this.schemeForm.patchValue({ [bhulekh_more_plot_no]:BhulekhLandData.plot_no});

    var bhulekh_more_area_acre   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_area_acre').attr('id');
    $("#"+bhulekh_more_area_acre).val(BhulekhLandData.Area_Acre);
    this.schemeForm.patchValue({ [bhulekh_more_area_acre]:BhulekhLandData.Area_Acre});

    var bhulekh_more_area   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_area').attr('id');
    $("#"+bhulekh_more_area).val(BhulekhLandData.Area_Hect);
    this.schemeForm.patchValue({ [bhulekh_more_area]:BhulekhLandData.Area_Hect});

    var bhulekh_more_ror   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_ror').attr('id');
    $("#"+bhulekh_more_ror).val(BhulekhLandData.TenantName);
    this.schemeForm.patchValue({ [bhulekh_more_ror]:BhulekhLandData.TenantName});

    this.modalService.dismissAll();
  }

  getClusterArea(adRowCtr:any){
    this.isClusterLandFlag = false;
    this.clusterLandSubmitted = false;
    this.currentClusterRow =adRowCtr;
    let districtIdP = 0;
    let districtIdObj: any = (<HTMLInputElement>document.getElementById('selDistrict')).value;
    if (districtIdObj != '0') {
      districtIdObj = JSON.parse(districtIdObj);
      districtIdP = districtIdObj.val;
    }
    if(districtIdP==0){
      Swal.fire({
        icon: 'error',
        text: 'Select district'
      });
      return false;
    }

    let blockP: any = (<HTMLInputElement>document.getElementById('selBlock')).value;
    if(blockP==0){
      Swal.fire({
        icon: 'error',
        text: 'Select block'
      });
      return false;
    }
    this.clusterLands = [];
    this.clusterLandForm = new UntypedFormGroup({
      'vchClusterZone': new UntypedFormControl('',
        [
          Validators.required,
        ]
      ),
      'vchClusterSubZone': new UntypedFormControl('',
        [
          Validators.required,
        ]
      )
    });

    let params = {
      "districtId": districtIdP,
      "blockId":blockP
    }
    this.apilist.getClusterZone(params).subscribe(res => {

      this.ClusterZoneNames = res.result['ClusterZoneDetails'];
      // console.log(this.TahasilNames);
    },
      error => {
        this.error = error
        this.ClusterZoneNames = []
      }

    );
    this.open(this.someClusterModalRef);
  }

  searchClusterLand(){
    this.clusterLandSubmitted = true;
    if (this.clusterLandForm.invalid) {
      return;
    }
    let params = {
      cluster_zone: this.clusterLandForm.value.vchClusterZone,
      cluster_sub_zone: this.clusterLandForm.value.vchClusterSubZone
    }
    this.apilist.searchClusterLand(params)
      .subscribe(
        (data: any) => {
          // console.log(data)
          if (data.result.status == '1') {
            this.ClusterLandInfo= data.result.landInfo;
            this.isClusterLandFlag = true;
          } else {
            this.isClusterLandFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.result.message
            });
          }

        },
        error => {
          this.isClusterLandFlag = false;
          this.error = error
          this.ClusterLandInfo = [];
          Swal.fire({
            icon: 'error',
            text: 'No Record Found!'
          });
        }

      );
  }

  getClusterSubZone(eVlue: any) {
    let params = {
      "parentId": eVlue
    }
    this.apilist.getClusterSubZone(params).subscribe(res => {
      this.ClusterSubZoneNames = res.result['ClusterSubZoneDetails'];
      // console.log(this.RevenueCircleNames);
    },
      error => {
        this.error = error
        this.ClusterSubZoneNames = []
      }

    );
  }
  selectClusterLand(ClusterLanddata:any){
    // console.log(ClusterLanddata);
    let CurRow = this.currentClusterRow
    var cage_culture_zone  = $("#btnClusterArea"+CurRow).closest('tr').find('.cage_culture_zone').attr('id');
    $("#"+cage_culture_zone).val('Zone-'+ClusterLanddata.intZoneId);
    this.schemeForm.patchValue({[cage_culture_zone]: 'Zone-'+ClusterLanddata.intZoneId});

    var cage_culture_sub_zone   = $("#btnClusterArea"+CurRow).closest('tr').find('.cage_culture_sub_zone').attr('id');
    $("#"+cage_culture_sub_zone).val(ClusterLanddata.vchSubzoneName);
    this.schemeForm.patchValue({[cage_culture_sub_zone]: ClusterLanddata.vchSubzoneName});

    var cage_culture_latitude    = $("#btnClusterArea"+CurRow).closest('tr').find('.cage_culture_latitude').attr('id');
    $("#"+cage_culture_latitude).val(ClusterLanddata.vchBuoyMakerLat);
    this.schemeForm.patchValue({[cage_culture_latitude]: ClusterLanddata.vchBuoyMakerLat});

    var cage_culture_longitude    = $("#btnClusterArea"+CurRow).closest('tr').find('.cage_culture_longitude').attr('id');
    $("#"+cage_culture_longitude).val(ClusterLanddata.vchBuoyMarkerLon);
    this.schemeForm.patchValue({[cage_culture_longitude]: ClusterLanddata.vchBuoyMarkerLon});
    this.modalService.dismissAll();
  }
  get m(): { [key: string]: AbstractControl } {
    return this.clusterLandForm.controls;
  }
  getDynamicSelect(e){
    let classAttr = e.target.attributes.class;
    let classVal = classAttr.nodeValue;
    if(classVal.includes('mkuy_project')){
      let idAttr = e.target.attributes.id;
      let id = idAttr.nodeValue;
      this.mkuy_project_key = id;
      let val = (<HTMLInputElement>document.getElementById(id)).value;
      if(parseInt(val)==environment.APICOL_CAGE_CULTURE){
        $("#"+environment.APICOL_CAGE_CULTURE_LAND_INFO).css('display','block');
        $("#"+environment.APICOL_BHULKEH_LAND_INFO).css('display','none');
        this.APICOL_LAND_INFO=environment.APICOL_CAGE_CULTURE_LAND_INFO;
        this.mkuy_project_id=parseInt(val);
      }else{
        $("#"+environment.APICOL_CAGE_CULTURE_LAND_INFO).css('display','none');
        $("#"+environment.APICOL_BHULKEH_LAND_INFO).css('display','block');
        this.APICOL_LAND_INFO=environment.APICOL_BHULKEH_LAND_INFO;
        this.mkuy_project_id=0;
      }
    }

  }
  resetBhulekhaData(){
    let formthis = this;
    $('.bhulekh_readonly').each(function(){
      let bhulekh_id = $(this).attr('id');
      $("#"+bhulekh_id).val('');
      formthis.schemeForm.patchValue({ [bhulekh_id]:'' });
    });
  }

}
