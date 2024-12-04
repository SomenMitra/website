import { Component, OnInit, NgModule, ElementRef, ViewChild,Injectable } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from '../../../encrypt-decrypt.service';
import { Location } from '@angular/common';
import { AbstractControl,UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray,UntypedFormControl } from '@angular/forms'
import { CitizenSchemeService } from '../../service-api/citizen-scheme.service';
import Swal from 'sweetalert2';
import { NgbModal, NgbDateStruct,NgbDateParserFormatter, NgbDate, } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { CitizenProfileService } from '../../service-api/citizen-profile.service';
import { CitizenMasterService } from '../../service-api/citizen-master.service';
import { WebsiteApiService } from '../../../website/website-api.service';


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
  selector: 'app-updateschemestatus',
  templateUrl: './updateschemestatus.component.html',
  styleUrls: ['./updateschemestatus.component.css'],
  providers: [CitizenProfileService, ValidatorchklistService, NgbDateCustomParserFormatter]
})


export class UpdateschemestatusComponent implements OnInit {

  submitted = false;

  options: any;
  activityList: any;
  updateForm = new UntypedFormGroup({});
  schemeForm = new UntypedFormGroup({});

  schemeDmgForm = new UntypedFormGroup({});
  arr: UntypedFormArray;
  schemeStr: any;
  schemeId: any;
  applicantId: any;
  applicationId: any;
  public loading = false;
  resDocSts: any;
  resDocList: any;
  lastUpd: any;
  docResFlg: any;
  docResFlNm: any;
  docResUpFlNm: any;
  applctnSts: any;
  updStatus: any;
  fileAttributes: any[] = [];
  ngElements: any[] = [];
  subsidyCtr: any;
  totalfile: number = 3;
  imageURL: any;
  authUpdateSts = false;
  farmerUpdateSts = false;
  subsidyAmt: number;
  subsidySts: any;
  subsidy:any;
  subsidyStsId:number;
  curDate = new Date();
  totalItem :number =0;
  completeItem :number =0;
  previousActivity : any;
  pastActivities : any;
  farmerPastActivities : any;
  timeStampKey:any;
  elementKey: any[] = [];
  pastActivitiesLength : any;
  completionDocument:any;
  paymentconfiguration:any;
  farmerphoto:any;
  farmerphotoarr:any[]=[];
  intimationDocument:any;
  editPhaseActivity:number;
  progress:number;
  respDynm: any;
  jsnFormulaCalculation: any[] = [];
  tahasilId: any = '';
  ror: any = '';
  mkuyProjectId:any='';
  dynAddMoreElement: any = [];
  dynElement: any = [];
  controlTypeArr: any = [];
  scmFrmAdmObj: any = {};
  applctnId: any;
  BankId = 0;
  intdirectorate =0;
  isMobile = false;
  onlineCompletionData:any=0;
  completionuurl:any='';
  Banks: any[];
  loanBanks: any[];
  ifscForm: any;
  ifscLoanForm: any;
  BankNames: any;
  DistrictNames: any;
  ifscSubmitted = false;
  ifscLoanSubmitted = false;
  isIFSCFlag = false;
  isLoanIFSCFlag = false;
  error: any;

  @ViewChild('someModal') someModalRef: ElementRef;

  @ViewChild('someSaveModal') someSaveRef: ElementRef;
  @ViewChild('someLoanModal') someLoanRef: ElementRef;
  @ViewChild('apponlineCompletionModal') apponlineCompletionModalRef: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    private location: Location,
    private uf: UntypedFormBuilder,
    private schemeApi: CitizenSchemeService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    public vldChkLst: ValidatorchklistService,
    private el: ElementRef,
    private objMstr: CitizenMasterService,
    private apilist: WebsiteApiService,

  ) {

  }
  mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
  };

  ngOnInit(): void {

    this.options = "true";

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;

    this.isMobile = this.mobileCheck();
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    this.schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = this.schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.applicationId = schemeArr[1];
    this.subsidyCtr = schemeArr[2];
    this.updStatus = schemeArr[3];
    this.editPhaseActivity = schemeArr[4];


    //this.getDynmDocs();
    let params = {
      "applctnId": this.applicationId,
      "schemeId": this.schemeId,
      "profId": this.applicantId,
      "updStatusFarmer": this.updStatus,
      "subsidyCtr": this.subsidyCtr,
    };

    this.loading = true;
    let curObj = this;
    let scmFrmObj: any = {};
    this.schemeApi.getApplicationActivityStatus(params).subscribe(res => {
      this.resDocSts = res.status;
      this.resDocList = res.result;
      this.respDynm = res.results['ctrlArr'];
      let lastUpdArr = res.lastUpd;
      this.lastUpd = (lastUpdArr.length !== 0)?lastUpdArr:this.resDocList;
      let docRes = res.docRes;
      let subsidy = res.subsidyDetails;
      this.pastActivities = res.previousActivity;
      this.pastActivitiesLength = Object.keys(this.pastActivities).length;
      let curDate = this.curDate;
      this.completionDocument = res.completionDocument;
      this.paymentconfiguration = res.paymentconfiguration;
      let txtSubsidyItems= this.paymentconfiguration[0].txtSubsidyItems;
      txtSubsidyItems=JSON.parse(txtSubsidyItems);
      this.farmerphoto=parseInt(txtSubsidyItems[0].farmerphoto);
      this.intimationDocument = res.intimationDocument;
      this.onlineCompletionData=res.onlineCompletionData;
      this.completionuurl=res.strGeneratedDocNameurl;

      for(let i=0;i<this.farmerphoto;i++){
        this.farmerphotoarr.push(i);
      }
      this.totalfile= this.farmerphoto;
      if(subsidy){
        this.subsidyAmt = subsidy.subsidyAmt;
        this.subsidySts = subsidy.subsidySts;
        this.subsidyStsId = subsidy.subsidyStsId;
      }
      if (docRes) {
        this.docResFlg = docRes.intmnDocSts;
        this.docResFlNm = docRes.intmnDoc;
        this.docResUpFlNm = docRes.upIntmnDoc;
      }


      this.loading = false;
      let arr = {};
      let c = 0;

      for (let item of this.resDocList) {
        this.totalItem++;
        arr[item.activityActnId] = ['', Validators.required];
        this.fileAttributes[item.activityActnId] = item;
        for (let i = 0; i < this.totalfile; i++) {
          arr[item.activityActnId + '_' + i + '_file'] = ['', Validators.required];
          this.fileAttributes[item.activityActnId + '_' + i + '_file'] = item;
        }
        arr[item.activityActnId + '_date'] = ['', Validators.required];
        this.fileAttributes[item.activityActnId + '_date'] = item;
        arr[item.activityActnId + '_remark'] = ['', Validators.required];
        this.fileAttributes[item.activityActnId + '_remark'] = item;
        this.ngElements[item.activityActnId + '_1'] = true;
        if(item.authUpdate == 1)
        {
          this.authUpdateSts = true;
        }
        if(item.farmerUpdate == 1)
        {
          this.farmerUpdateSts = true;
        }
        c++
      }
      if (c == this.resDocList.length) {
        this.updateForm = this.uf.group(arr);
      }

      for(let activity in this.pastActivities){
        this.elementKey.push(activity);
        this.farmerPastActivities = this.pastActivities[activity];
      }
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


            }
            this.jsnFormulaCalculation[ctrlNm] = newCalArr

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

            let addCtrlVal = ctrlArr['jsnControlArray'][0]['ctrlValue'];
            let addMoreFldVal = ctrlArr['vchFieldValue'] != '' ? ctrlArr['vchFieldValue'] : addCtrlVal != '' ? addCtrlVal : '';
            this.dynAddMoreElement[ctrlNm] = { "val": addMoreFldVal, "ctrlType": ctrlArr['tinControlType'], "dispTagArr": ctrlArr['jsnDispTagArray'][0] };


            let ctrlVal = (ctrlArr['vchFieldValue'] != '') ? ctrlArr['vchFieldValue'] : [];
            if (Object.keys(ctrlVal).length > 0) {

              let ctrlAddMore = ctrlVal['addMoreData'];
              let columnData = ctrlVal['columnData'];


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

            this.dynElement[ctrlNm] = { "val": finlFldVal, "ctrlType": ctrlArr['tinControlType'], "dispTagArr": ctrlArr['jsnDispTagArray'][0], "cscdTagArr": ctrlArr['jsnOptionArray'][0], "secCtrlType": ctrlArr['tinControlType'],'vchLabelName':ctrlArr['vchLabelName'] };
            scmFrmObj[ctrlNm] = new UntypedFormControl([]);
          }
          this.controlTypeArr[ctrlNm] = ctrlArr;
        }
      }
      this.scmFrmAdmObj = scmFrmObj;
        this.schemeForm = new UntypedFormGroup(scmFrmObj);
        let curObj = this;
        setTimeout(function () {
          curObj.setDynamicVal();
        }, 1000);
        this.loading = false;


    });

    this.loading = true;
    setTimeout(() => {
      this.ischecked();
      this.loading = false;
    }, 4000);

  }
  setDynamicVal() {

    let dynObjKey = Object.keys(this.dynElement);
    let addMoreCtrl = [];
    dynObjKey.forEach((field: any) => {
      if (this.dynElement[field].secCtrlType == 8) {

        (<HTMLInputElement>document.getElementById(field)).value = this.dynElement[field].val!=''?this.dynElement[field].val:'';
        if (!addMoreCtrl.includes(this.dynElement[field].addMoreCtrlName)) {
          addMoreCtrl.push(this.dynElement[field].addMoreCtrlName);
        }
      }
    });

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
    //console.log(this.dynElement);
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
  backClicked() {
    this.location.back();
  }

  chooseAction(activityId, flag) {

    if (flag == 1) {
        const inprog = document.getElementById(activityId + "_inprog") as HTMLInputElement;
        inprog.checked = false;
        const compl = document.getElementById(activityId + "_compl") as HTMLInputElement;
        compl.checked = true;
      this.ngElements[activityId + '_1'] = true;
      this.ngElements[activityId + '_2'] = false;
      this.progress=1;

    }else {
      const inprog = document.getElementById(activityId + "_inprog") as HTMLInputElement;
      inprog.checked = true;
      const compl = document.getElementById(activityId + "_compl") as HTMLInputElement;
      compl.checked = false;
      this.ngElements[activityId + '_2'] = true;
      this.ngElements[activityId + '_1'] = false;
      this.progress=0;
    }
    this.completeItem =0;
    for (let item of this.lastUpd) {
        const ele = document.getElementById(item.activityActnId + "_compl") as HTMLInputElement;
       if (ele.checked){
         this.completeItem++;
       }
  }

  }


  enableDisable(controlName, className) {
    if (className.includes('loan_bank_branch') || className.includes('loan_bank_name') || className.includes('loan_bank_ifsc') || className.includes('ifsc_save_code') || className.includes('ifsc_dist') || className.includes('ifsc_branch') || className.includes('ifsc_bank') || className.includes('sum_total')|| className.includes('ifsc_loan_code')) {

      return true;
    }
    else {
      return false;
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
  // start get dynamic documents
  getDynmDocs() {

    let params = {
      "applctnId": this.applicationId,
      "schemeId": this.schemeId,
      "profId": this.applicantId,
      "updStatusFarmer": this.updStatus,
      "subsidyCtr": this.subsidyCtr,
    };

    this.loading = true;
    this.schemeApi.getApplicationActivityStatus(params).subscribe(res => {
      this.resDocSts = res.status;
      this.resDocList = res.result;
      let docRes = res.docRes;
      this.previousActivity = res.previousActivity;
      if (docRes) {
        this.docResFlg = docRes.intmnDocSts;
        this.docResFlNm = docRes.intmnDoc;
        this.docResUpFlNm = docRes.upIntmnDoc;
      }

      this.loading = false;
      let arr = {};
      let c = 0;

      for (let item of this.resDocList) {

        arr[item.activityActnId] = ['', Validators.required];
        this.fileAttributes[item.activityActnId] = item;
        for (let i = 0; i < this.totalfile; i++) {
          arr[item.activityActnId + '_' + i + '_file'] = ['', Validators.required];
          this.fileAttributes[item.activityActnId + '_' + i + '_file'] = item;
        }
        arr[item.activityActnId + '_date'] = ['', Validators.required];
        this.fileAttributes[item.activityActnId + '_date'] = item;
        arr[item.activityActnId + '_remark'] = ['', Validators.required];
        this.fileAttributes[item.activityActnId + '_remark'] = item;
        this.ngElements[item.activityActnId + '_1'] = true;
        if(item.authUpdate == 1)
        {
          this.authUpdateSts = true;
        }
        c++
      }
      if (c == this.resDocList.length) {
        this.updateForm = this.uf.group(arr);
      }
    });
  }

  updateStatus() {


    let arr = this.resDocList;
    const formData = new FormData();
    let fileNames = '';
    let hdnFile = '';
    let retVal = true;
    let errFlag = true;
    const statusId = [];
    const activityStatusId = [];
    let applctnId = this.applicationId;
    let schemeId = this.schemeId;
    let profId = this.applicantId;
    for (let i = 0; i < arr.length; i++) {
      let activityId = arr[i]['activityActnId'];
      let taskId = this.updateForm.controls[activityId].value;
      statusId.push(i);

      if (taskId == '') {
        Swal.fire({
          icon: 'error',
          text: 'Select Activity Status ' + taskId
        });
        return false;

      }
      else if (taskId > 0) {
        formData.append('taskStatus' + i, taskId);
        formData.append('activityId' + i, activityId);
        formData.append('masterItemId' + i, arr[i]['masterItemId']);
        if (taskId == '2') {
          // console.log(this.onlineCompletionData);
          // return
          if(this.onlineCompletionData<=0){
            Swal.fire({
              icon: 'error',
              text: 'Please fill up the online completion form'
            });
            return false;

          }
          for (let j = 0; j < this.totalfile; j++) {
            let fileName = activityId + '_' + j + '_file';
            let selectedFileList = (<HTMLInputElement>document.getElementById(fileName));
            let file: any = selectedFileList.files.item(0);
            const extension = selectedFileList.value.split('.').pop();
            if(this.editPhaseActivity==0){

              var hdnfileName = activityId + '_' + j + '_hdnfile';
              var hdnselectedFileList = (<HTMLInputElement>document.getElementById(hdnfileName));
              var  hdnfile=hdnselectedFileList.value;
              if(file==null && hdnfile!=''){
                hdnfile = (hdnfile) ? hdnfile : '';
                formData.append('hdnfileName_' + i + '_' + j, hdnfile);
                fileNames += hdnfileName + ",";
              }
              else if(file){
                let fileType = 'png,jpg,jpeg';
                let fileFileSize = 1;
                let uploadedFileType = file.type;
                let uploadedFileSize = file.size;

                let UploadFileConvesion = Math.round((uploadedFileSize / 1024));
                let acceptableTypes = fileType.split(',');
                const accepteableLowercase = acceptableTypes.map(acceptableTypes => acceptableTypes.toLowerCase());
                if (accepteableLowercase.includes(extension.toLowerCase()) == false) {
                  Swal.fire({
                    icon: 'error',
                    text: 'Upload only ' + fileType + ' files '
                  });

                  return false;
                }

                else if (UploadFileConvesion > fileFileSize * 1024) {
                  Swal.fire({
                    icon: 'error',
                    text: 'Upload document should be < ' + fileFileSize + ' MB'
                  });

                  return false;
                }
                else {
                  file = (file) ? file : '';
                  formData.append('fileName_' + i + '_' + j, file);
                  fileNames += fileName + ",";
                }
              }
              else {
                Swal.fire({
                  icon: 'error',
                  text: 'Upload file for activity'
                });
                return false;
              };
            }
            else{
              if(file){
                let fileType = 'png,jpg,jpeg';
                let fileFileSize = 1;
                let uploadedFileType = file.type;
                let uploadedFileSize = file.size;

                let UploadFileConvesion = Math.round((uploadedFileSize / 1024));
                let acceptableTypes = fileType.split(',');
                const accepteableLowercase = acceptableTypes.map(acceptableTypes => acceptableTypes.toLowerCase());
                if (accepteableLowercase.includes(extension.toLowerCase()) == false) {
                  Swal.fire({
                    icon: 'error',
                    text: 'Upload only ' + fileType + ' files '
                  });

                  return false;
                }

                else if (UploadFileConvesion > fileFileSize * 1024) {
                  Swal.fire({
                    icon: 'error',
                    text: 'Upload document should be < ' + fileFileSize + ' MB'
                  });

                  return false;
                }
                else {
                  file = (file) ? file : '';
                  formData.append('fileName_' + i + '_' + j, file);
                  fileNames += fileName + ",";
                }
              }
              else {

                Swal.fire({
                  icon: 'error',
                  text: 'Upload file for activity'
                });
                return false;
              };
            }

          }
        }
        else {
          let completeDate = this.updateForm.controls[activityId + '_date'].value;

          formData.append('taskDate' + i, completeDate);

          if (completeDate == '' || completeDate=='-Nov-30') {

            Swal.fire({
              icon: 'error',
              text: 'Please select the date'
            });
            return false;
          }
        }

        let selectedremarkList = this.updateForm.controls[activityId + '_remark'].value;
        formData.append('taskRemark' + i, selectedremarkList);
        // if (selectedremarkList == '') {
        //   Swal.fire({
        //     icon: 'error',
        //     text: 'Please enter remark'
        //   });
        //   return false;
        // }
      }
    }

    // Start Intimation Document
    if (this.docResFlg == 1 && this.totalItem == this.completeItem) {
      for(let i=0;i<this.completionDocument.length;i++){
      let intmnFileName = this.completionDocument[i].intDocumentId+'_intmnFile';
      let intmnLabelNameId = this.completionDocument[i].intDocumentId+'_label';
      let intmnLabelNameList = (<HTMLInputElement>document.getElementById(intmnLabelNameId));
      let selectedintmnFileList = (<HTMLInputElement>document.getElementById(intmnFileName));
      let intmnFile: any = selectedintmnFileList.files.item(0);
      const intmnExtension = selectedintmnFileList.value.split('.').pop();
      let intmnLabelName = intmnLabelNameList.textContent;
      if(this.editPhaseActivity==0){
        let hdnintmnFileName = this.completionDocument[i].intDocumentId+'_hdnintmnFile';
        let hdnselectedintmnFileList = (<HTMLInputElement>document.getElementById(hdnintmnFileName));
        let hdnintmnFileNameDoc = hdnselectedintmnFileList.value;
        if (intmnFile==null && hdnintmnFileNameDoc!=''){
          hdnintmnFileNameDoc = (hdnintmnFileNameDoc) ? hdnintmnFileNameDoc : '';
          formData.append('hdnintmnFile'+i, hdnintmnFileNameDoc);
          formData.append('label'+i, intmnLabelName);
        }
      else if (intmnFile) {
        let intmnFileType = 'jpeg,jpg,gif,pdf,zip';
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
          formData.append('intmnFile'+i, intmnFile);
          formData.append('label'+i, intmnLabelName);
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Upload file for '+this.completionDocument[i].vchDocumentName+' Document'
        });
        return false;
      }
      }

      else{
      if (intmnFile) {
        let intmnFileType = 'jpeg,jpg,gif,pdf,zip';
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
          formData.append('intmnFile'+i, intmnFile);
          formData.append('label'+i, intmnLabelName);
        }
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Upload file for '+this.completionDocument[i].vchDocumentName+' Document'
        });
        return false;
      }
    }
    }
    }
    //End Intimation Document

    formData.append('intmnFileSts', this.docResFlg);
    formData.append('statusIds', JSON.stringify(statusId));
    formData.append('applctnId', this.applicationId);
    formData.append('schemeId', this.schemeId);
    formData.append('profId', this.applicantId);
    formData.append('subsidyCtr', this.subsidyCtr);

    this.updateData(formData);
  }

  // to update data in server
  updateData(formDataObj: FormData) {
    this.loading = true;
    this.schemeApi.updateSchmActivitySts(formDataObj).subscribe(res => {
      let upSts = res.status;
      let upMsg = res.msg;
      // start after uploaded
      if (upSts == 1) {
        this.loading = false;
        let encSchemeStr = this.encDec.encText(this.schemeStr.toString());
        this.loading = false;
        var thisObj = this;
          Swal.fire({
            icon: 'success',
            text: "Activity updated successfully."
          }).then(function() {
            thisObj.router.navigate(['/citizen-portal/apicol/scheme-applied', encSchemeStr]);
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
    });
  }


  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.updateForm.invalid) {
      return;
    }
    else {

      this.updateStatus();
    }

    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.updateForm.value, null, 4));
  }
  get f() { return this.updateForm.controls; }

  onReset() {
    let encSchemeStr = this.encDec.encText(this.schemeStr.toString());
    //this.submitted = false;
    //this.updateForm.reset();
    this.router.navigate(['/citizen-portal/apicol/scheme-applied', encSchemeStr]);
  }
  open(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getPhoto(imgUlr: any) {
    this.imageURL = imgUlr;
    this.open(this.someModalRef);
  }
  isDisabled() {
    return false
  }
  ischecked() {
    for (let item of this.lastUpd) {

      if (item.farmerActionStatus != null) {
        let actId = item.activityActnId;
        this.updateForm.patchValue({ [actId]: item.farmerActionStatus });
        if (item.farmerActionStatus == 1) {
          const ele = document.getElementById(item.activityActnId + "_inprog") as HTMLInputElement;
          ele.checked = true;
          ele.click();
          const dateFArr = item.farmerUpdateDateN.split("-");
          let farmerUpdateDateN = dateFArr['2'] + '-' + dateFArr['1'] + '-' + dateFArr['0'];
          this.updateForm.patchValue({ [actId + '_date']: farmerUpdateDateN });
        } else if (item.farmerActionStatus == 2) {
          // this.completeItem++;
          const ele = document.getElementById(item.activityActnId + "_compl") as HTMLInputElement;
          ele.checked = true;
          ele.click();
        }

        this.updateForm.patchValue({ [actId + '_remark']: item.farmerRemark });
      } else {
        let actId = item.activityActnId;
        this.updateForm.patchValue({ [actId]: 2 });
        const ele = document.getElementById(item.activityActnId + "_compl") as HTMLInputElement;
        ele.checked = true;
        ele.click();
      }
    }
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
  keyUpEvt(type: any, evt: any, crtId: any) {
    if (this.isMobile) {
      this.keyPressEvtMob(type, evt, crtId);
    }

    for(let cal in this.jsnFormulaCalculation){

      let calArr = this.jsnFormulaCalculation[cal];
      if(calArr.includes(crtId)){
        let str = '';
        for(let c1 in calArr){
          if(parseInt(c1)%2==0){
            let v1 = (<HTMLInputElement>document.getElementById(calArr[c1])).value!=''?parseFloat((<HTMLInputElement>document.getElementById(calArr[c1])).value):0;
            str = str+v1;

          }else{
             str = str+calArr[c1]
          }
        }
        let className = (<HTMLInputElement>document.getElementById(cal)).className;
        if(className.includes('average')){
          let newT = eval(str);
          let no_of_net_profit:any = environment.NO_NET_PROFIT_YEAR;

          let newVal:any = parseFloat(newT)/parseInt(no_of_net_profit);
          $('#'+ cal).val(parseFloat(newVal).toFixed(2));
          this.schemeForm.patchValue({ [cal]: parseFloat(newVal).toFixed(2) });
        }else{
          (<HTMLInputElement>document.getElementById(cal)).value = eval(str);
          this.schemeForm.patchValue({ [cal]: eval(str) });
        }


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
  getDynamicSelect(e){
    let classAttr = e.target.attributes.class;
    let classVal = classAttr.nodeValue;
    if(classVal.includes('mkuy_project')){
      let idAttr = e.target.attributes.id;
      let id = idAttr.nodeValue;
     // this.mkuy_project_key = id;
      let val = (<HTMLInputElement>document.getElementById(id)).value;
      if(parseInt(val)==environment.APICOL_CAGE_CULTURE){
        $("#"+environment.APICOL_CAGE_CULTURE_LAND_INFO).css('display','block');
        $("#"+environment.APICOL_BHULKEH_LAND_INFO).css('display','none');
       // this.APICOL_LAND_INFO=environment.APICOL_CAGE_CULTURE_LAND_INFO;
       // this.mkuy_project_id=parseInt(val);
      }else{
        $("#"+environment.APICOL_CAGE_CULTURE_LAND_INFO).css('display','none');
        $("#"+environment.APICOL_BHULKEH_LAND_INFO).css('display','block');
       // this.APICOL_LAND_INFO=environment.APICOL_BHULKEH_LAND_INFO;
        //this.mkuy_project_id=0;
      }
    }

  }
  doCompletion() {

    let valSts = true;
    let ctrlParam: any = [];
    let profCnt = 0;
    if (valSts) {
      let controlKeys = Object.keys(this.schemeForm.controls);
      for (let key of controlKeys) {
        let elmVal = this.schemeForm.controls[key].value;
        let lblName = this.controlTypeArr[key]['vchLabelName'];
        let secType = this.controlTypeArr[key]['tinSectionType'];
        let frmConfgId = this.controlTypeArr[key]['intDocumentId'];
        let intLabelConfigId = this.controlTypeArr[key]['intLabelConfigId'];
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

          let classCheckFlag = false;
          let objAddMr = { "addMoreData": [], "columnData": [] };
          let obChldjColAddMr = [];
          let adMrArr = this.schemeForm.controls[key] as UntypedFormArray;
          let AddMoreCount = 0;
          let adMrClmNmame = '';

          for (let adMrCtrlRw = 0; adMrCtrlRw < adMrArr.controls.length; ++adMrCtrlRw) {

            let adMrClArr = (adMrArr.controls[adMrCtrlRw]) as UntypedFormArray;
            let objCtrlKey = Object.keys(adMrClArr.controls);
            let obChldjAddMr = [];
            AddMoreCount++;

            for (let adMrCtrlCl = 0; adMrCtrlCl < objCtrlKey.length; ++adMrCtrlCl) {

              let adMrCTrlVal = (<HTMLInputElement>document.getElementById(key + '_' + adMrCtrlRw + '_' + adMrCtrlCl)).value;

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
                if($('#'+this.controlTypeArr[key]['vchLabelName']).css('display') == 'block'){
                  let adMrValParam = { "dynDataObj": this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl], "ctrlVal": adMrCTrlVal, "dispNnSts": dispNnSts, "ctrlType": ctrlType };

                  if (!this.vldChkLst.dynCtrlVal(adMrValParam, this.el)) {
                    valSts = false;
                    this.el.nativeElement.querySelector('.' + adMrClmCls).focus();
                    return false;
                  }

                  else {

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

            }
            (objAddMr.addMoreData).push(obChldjAddMr);
          }

          if(AddMoreCount<2 &&   addmoreFlagDep==1 && this.intdirectorate==environment.APICOL_Directorate && classCheckFlag){
            Swal.fire({
              icon: 'error',
              text: ' Minimum 2 group member details required'
            });
            return false;
          }else if(AddMoreCount>20 &&  addmoreFlagDep==1 && this.intdirectorate==environment.APICOL_Directorate && classCheckFlag){
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
        let ctrlValParam = { "dynDataObj": this.controlTypeArr[key], "ctrlVal": elmVal, "dispNnSts": dispNnSts, "ctrlType": ctrlType };
        let ctrlClass = this.controlTypeArr[key]['jsnControlArray'][0]['ctrlClass'];

       // if (this.schemeForm.status === 'VALID') {

          if (!this.vldChkLst.dynCtrlVal(ctrlValParam, this.el)) {
           // console.log(ctrlValParam);
            valSts = false;
            this.el.nativeElement.querySelector('.cls_' + key).focus();
            break;
          }if(ctrlClass=='valid_aadhar'  && !this.vldChkLst.validAadhar(elmVal) ){
            valSts = false;
            Swal.fire({
              icon: 'error',
              text: 'Please Enter a Valid '+lblName
            });
            return false;
          }
          else {
            //console.log(dispNnSts);
            if (dispNnSts === false) {
              if(elmVal==''){
                Swal.fire({
                  icon: 'error',
                  text: 'Enter ' + lblName
                   });
                   valSts=false;
                   return false;
              }
              ctrlParam[profCnt] = {
                "profileId": this.applicantId,
                "secTypeId": secType,
                "lblName": lblName,
                "fldVal": elmVal,
                "ctrlDtls": ctrlDtls,
                "formConfgId": frmConfgId,
                "createdBy": this.applicantId,
                "ctrlTypeId": ctrlType,
                "intLabelConfigId": intLabelConfigId
              }
              profCnt++;
            }

          }
       // }
      }
    }
   // console.log(ctrlParam);
    if(ctrlParam.length==0){
      Swal.fire({
        icon: 'error',
        text: 'Fille up the required field'
         });
         valSts=false;
    }
    ctrlParam.forEach(function (value) {
      if(value.fldVal==''){
        Swal.fire({
          icon: 'error',
          text: 'Fille up ' +value.lblName
           });
           valSts=false;
      }
    });

    if (valSts) {
      let schemeParam = {
        "profileId": this.applicantId,
        "schemeId": this.schemeId,
        "dynCtrlParm": ctrlParam,
        "onlineServiceId":this.applicationId
      }
      //console.log(schemeParam);return false;
      this.schemeApi.completion(schemeParam).subscribe(res => {
        if (res.status == 1) {
          this.onlineCompletionData=res.status;
          this.completionuurl=res.strGeneratedDocNameurl;
           console.log(res);
          Swal.fire({
            icon: 'success',
            text: 'Completion Given'
          });
          $("#apponlineCompletionClose").click();
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
  getSavingIFSC() {

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
    this.open(this.someSaveRef);


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
  // open(content: any) {

  //   this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     //this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }
  selectIFSC(branchName, ifscCode, int_Min_Account_No, int_Max_Account_No) {
    let distName = this.ifscForm.value.vchDistrictName;
    let bankName = this.ifscForm.value.vchBankName;
    if (document.getElementsByClassName("ifsc_dist").length > 0) {
      let ifsc_dist_field: any = document.getElementsByClassName("ifsc_dist")[0];
      let ifsc_dist_name = ifsc_dist_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_dist_name]: distName });
    }
    if (document.getElementsByClassName("ifsc_save_bank").length > 0) {
      let ifsc_bank_field: any = document.getElementsByClassName("ifsc_save_bank")[0];
      let ifsc_bank_name = ifsc_bank_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_bank_name]: bankName });
    }
    if (document.getElementsByClassName("ifsc_save_branch").length > 0) {
      let ifsc_branch_field: any = document.getElementsByClassName("ifsc_save_branch")[0];
      let ifsc_branch_name = ifsc_branch_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_branch_name]: branchName });
    }
    if (document.getElementsByClassName("ifsc_save_code").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("ifsc_save_code")[0];
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
    this.open(this.someLoanRef);


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

      this.schemeForm.patchValue({ [ifsc_bank_name]: bankName });
    }
    if (document.getElementsByClassName("loan_bank_branch").length > 0) {
      let ifsc_branch_field: any = document.getElementsByClassName("loan_bank_branch")[0];
      let ifsc_branch_name = ifsc_branch_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_branch_name]: branchName });
    }
    if (document.getElementsByClassName("ifsc_loan_code").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("ifsc_loan_code")[0];
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
