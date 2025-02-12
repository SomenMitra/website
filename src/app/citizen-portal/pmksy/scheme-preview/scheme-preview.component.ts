import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { formatDate } from '@angular/common';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { UntypedFormGroup, UntypedFormControl, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { CitizenSchemeActivityService } from '../service-api/citizen-scheme-activity.service';
import { ApiService } from '../../seed-dbt-apply/api.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OdishaoneRedirectService } from '../../../odishaoneredirect.service';
@Component({
  selector: 'app-scheme-preview',
  templateUrl: './scheme-preview.component.html',
  styleUrls: ['./scheme-preview.component.css'],
  providers: [DatePipe]
})
export class SchemePreviewComponent implements OnInit {
  siteURL=environment.siteURL;
  loading = false;
  finalForm = new UntypedFormGroup({});
  finalSubmitted = false;
  schemeId: any;
  applicantId: any;
  applctnId: any;
  odishaoneIntID: any;
  applicantName: any;
  emailId: any;
  mobileNo: any;
  fatherNm: any;
  aadhaarNo: any;
  gender: any;
  castCatg: any;
  dob: any;
  address: any;
  profImgUrl: any;
  farmInfoSts: any;
  districtNm: any;
  blockNm: any;
  gpNm: any;
  villageNm: any;
  schmSts: any;
  schmData: any;
  schmHrDt: any;
  editSts = 0;
  resDocSts: any;
  resPaySts: any;
  resDocList: any;
  resPayList: any;
  paymentDetails: any;
  qryArr: any[] = [];
  isServcFlg: boolean = false;
  docSectnSts: boolean = false; // document section display/ not
  paySectnSts: boolean = false; // document section display/ not
  apprRsmSts = 0; // resubmit status
  appHistId = 0; // application history id

  marineType = 0;
  distLabel = 'District';
  blockLabel = 'Block / ULB';
  gpLabel = 'GP / Ward';
  sujogPortal=environment.sujogPortal;
  sujogCity='';
  DBTscheme ='';
  voucherDetails:any[]=[];
  seedDBT = environment.seedDBT;
  intApplicationStatus:number;
  schemeName:any;
  schemeType:any;
  schemeTypeId:any;
  voucherPreviewStatus : number;
  voucherModalDetails :any[]=[];
  dtmAppliedOn :'';
  applicationStatus:number;
  odishaone_vchRequest:'';
  odishaone_encData:'';
  arritems: any;
  arritemgroups: any;
  itemGroup: any;
  boqUpdate: any;
  boqDocument: any;
  landareaId: any;
  subsidyDetails:any;
  actualSubsidyDetails:any;
  ActualArea:any;
  ActualSpace:any;
  decTotalAmt: any;
  decFittingCharges: any;
  decTotGst: any;
  decTotMIPrice: any;
  fittingPercentage: any;
  @ViewChild('someSeedDBTVoucherModal') someSeedDBTVoucherModalRef: ElementRef;
  notingId: any;
  farmerType: any;
  constructor(private router: Router, private route: ActivatedRoute, private encDec: EncryptDecryptService, private objProf: CitizenProfileService, private objSchmCtrl: CitizenSchemeService, private objSchmActv: CitizenSchemeActivityService, private objRedirectOdishaone: OdishaoneRedirectService, private datepipe: DatePipe , private objSeedService:ApiService ,  private modalService: NgbModal) { }

  ngOnInit(): void {

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));

    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    console.log(schemeArr);
    this.schemeId = schemeArr[0];
    let APICOL_SCHEME_IDS = environment.APICOL_SCHEME_IDS;
    if(APICOL_SCHEME_IDS.includes(this.schemeId)){
      this.router.navigate(['/citizen-portal/scheme-preview-apicol', encSchemeId]);
    }
    this.applctnId = schemeArr[1];
    this.editSts = (schemeArr[2] === undefined) ? 0 : schemeArr[2];
    this.appHistId = (schemeArr[3] === undefined) ? 0 : schemeArr[3];
    this.DBTscheme = (schemeArr[3] === undefined) ? 0 : schemeArr[3];
    this.voucherPreviewStatus = (schemeArr[4] === undefined) ? 0 : schemeArr[4];
    this.notingId = (schemeArr[5] === undefined) ? 0 : schemeArr[5];
    this.landareaId = (schemeArr[2] === undefined) ? 0 : schemeArr[2];

    
    // console.log(schemeArr);
    setTimeout(() => {
      this.getFarmrInfo();
      this.getSchmDynmCtrls();
      this.getDynmDocs();
      if (this.editSts == 0) {
        this.getSchmQryRlyLst();
      }
      this.getBOQdetail();
      this.getSubsidydetail();
    }, 1000);
    if(this.voucherPreviewStatus == 1)
      {
        $('#collapseOne').removeClass('show');
        $('.farmerInfoAccordian').addClass('collapsed');
      }
    setTimeout(() => {
      if(this.voucherPreviewStatus == 1)
      {
        $('#collapseSeven').addClass('show');
        $('.voucherDetailAccordian').removeClass('collapsed');
      }
    }, 1500);
    if(this.schemeId == environment.seedDBT)
    {
      let params = {
        "profileId": this.applicantId,
        "applicationId": this.applctnId,
      };

      this.objSeedService.getVoucherDetails(params).subscribe(res => {

        if(res.status == 200)
        {
          this.voucherDetails = res.result;
        }

      });



    }


  }

  // get farmer  basic info
  getFarmrInfo() {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.odishaoneIntID = farmerInfo.ODISHAONE_INTEGRATIONID;
    let params = {
      "profileId": this.applicantId,
      "applicationId":this.applctnId,
      "schemeId":this.schemeId,
      "subConstKey":"MKUY_CATEGORY",
      "odishaoneIntID":this.odishaoneIntID
    };
    this.loading = true;
    this.objProf.profileBuild(params).subscribe(res => {
      this.farmInfoSts = res.status;
      if (res.status > 0) {
        let resProfInfo = res.result['profileInfo'];
        // get profile info
        this.applicantId = resProfInfo['applicantId'];
        this.applicantName = resProfInfo['applicantName'];
        this.emailId = resProfInfo['emailId'];
        this.mobileNo = resProfInfo['mobileNo'];
        this.fatherNm = resProfInfo['fatherNm'];
        this.farmerType = environment.farmerType[resProfInfo['farmerType']];
        let aadhaarNoP = resProfInfo['aadhaarNo'];
        this.aadhaarNo = '';
        if (aadhaarNoP != '') {
          this.aadhaarNo = "X".repeat(8) + aadhaarNoP.substr(8, 4);
        }
        this.gender = resProfInfo['genderNm'];
        //this.castCatg = resProfInfo['castCatgNm'];
        this.castCatg = environment.ko_categoryType[resProfInfo['castCatg']]
        let dobV = resProfInfo['dob'];
        if(dobV != ''){
          let dtmDob = new Date(dobV);
          this.dob = formatDate(dtmDob, 'dd-MMM-yyyy', 'en-US');
        }
        this.districtNm = resProfInfo['districtNm'];
        this.blockNm = resProfInfo['blockNm'];
        this.gpNm = resProfInfo['gpNm'];
        this.villageNm = resProfInfo['vlgNm'];
        this.address = resProfInfo['address'];
        this.profImgUrl = resProfInfo['profPic'];
        this.dtmAppliedOn = resProfInfo['dtmAppliedOn'];
        this.applicationStatus = resProfInfo['intApplicationStatus'];
        this.odishaone_vchRequest = resProfInfo['vchRequest'] ?(resProfInfo['vchRequest']):"";
        this.odishaone_encData = resProfInfo['ODISHAONE_encData']?resProfInfo['ODISHAONE_encData']:"";
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

  open(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getVoucherDetailsByID(voucherID :any)
  {
    let params = {
      "profileId": this.applicantId,
      "applicationId": this.applctnId,
      "intVoucherId" : voucherID
    };

    this.objSeedService.getVoucherDetails(params).subscribe(res => {

      if(res.status == 200)
      {
        this.voucherModalDetails =   res.result;
        this.open(this.someSeedDBTVoucherModalRef);
      }

    });


  }

  // get scheme info
  getSchmDynmCtrls() {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applicationId": this.applctnId,
      "mainSectionId": 0,
      "appHistId": this.appHistId,
      "notingId":this.notingId
    };
    this.loading = true;
    this.objSchmCtrl.schemeDynCtrls(params).subscribe(res => {
      if (res.status > 0) {
        this.schmSts = res.status;
        this.schmData = res.result['ctrlArr'];
        this.schmHrDt = res.result['schmSrvArr'];
        //console.log(this.schmHrDt.schmServTypeNm);
        this.intApplicationStatus = this.schmHrDt.intApplicationStatus;

        let marineSec = this.schmHrDt.sector;
        if (marineSec == 1) {
          this.marineType = 1;
          this.distLabel = 'Marine Jurisdiction';
          this.blockLabel = 'Marine Extension';
          this.gpLabel = 'FLC / FH';
        }
        else if (marineSec == 3) {
          this.marineType = 2;
          this.distLabel = 'District / Marine Jurisdiction';
          this.blockLabel = 'Block / ULB / Marine Extension';
          this.gpLabel = 'GP / Ward / FLC / FH';
        }
        if(this.schemeId==environment.sujogPortal){
          this.sujogCity=res.result.schmSrvArr.redirectAPIDetls;
        }else{
          this.sujogCity='';
        }
        let schemeTypeId = this.schmHrDt.schmServType;
        this.isServcFlg = (schemeTypeId == environment.constService) ? true : false;
        this.docSectnSts = (this.schmHrDt.schmServDocSctn == 1) ? true : false;
        this.paySectnSts = (this.schmHrDt.schmServPaySctn == 1) ? true : false;
        if(this.paySectnSts && this.schemeId != environment.seedDBT){
          this.getPaymentDetails();
        }
        this.apprRsmSts = this.schmHrDt.apprRsmSts;
        this.loading = false;
        this.initForm();


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
  // get scheme documents
  getDynmDocs() {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applctnId": this.applctnId,
      "appHistId": this.appHistId
    };
    this.loading = true;
    this.objSchmCtrl.getSchmDocList(params).subscribe(res => {
      if (res.status > 0) {
        this.resDocSts = res.status;
        this.resDocList = res.result['docArr'];
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

  private initForm() {
    if (this.apprRsmSts == 1) {
      this.finalForm = new UntypedFormGroup({
        'resubmitRmrk': new UntypedFormControl('',
          [
            Validators.required,
          ]
        ),
        'terms': new UntypedFormControl('',
          [
            Validators.required,
          ]
        ),
      });
    }
    else {

      this.finalForm = new UntypedFormGroup({
        'terms': new UntypedFormControl('',
          [
            Validators.required,
          ]
        ),
      });
    }
  }


  doSchmModify() {
    let docSectnFlg = (this.docSectnSts == true) ? 1 : 0;
    let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId + ':' + docSectnFlg).toString());
    this.router.navigate(['/citizen-portal/pmksy/scheme-apply', encAppCtnId]);
  }


  get g(): { [key: string]: AbstractControl } {
    return this.finalForm.controls;
  }
  getBOQdetail(){
    let params = {
     "profileId": this.applicantId,
      "applicationId":this.applctnId,
      "schemeId":this.schemeId,
      "notingId":this.notingId,
      "landareaId":this.landareaId
    };
    this.loading = true;
    this.objProf.getBOQdetail(params).subscribe(res=>{
      if(res['status']==200){
        this.decTotalAmt=res.result.decTotalAmt;
        this.decFittingCharges=res.result.decFittingCharges;
        this.fittingPercentage=(res.result.decFittingCharges > 0)?5:0;
        this.decTotGst=res.result.decTotGst;
        this.decTotMIPrice=res.result.decTotMIPrice;
        this.arritems=res.result.arritems;
        this.arritemgroups=res.result.arritemgroups;
        this.itemGroup = res.result;
        this.boqUpdate = res.result.boqUpdate;
        this.boqDocument = res.result.boqDocument;
      }
      else{
        this.loading = true;
      }
      
    });
   }
  getSubsidydetail(){
    let params = {
      "applicationId":this.applctnId,
      "schemeId":this.schemeId,
    };
    this.loading = true;
    this.objProf.getSubsidydetail(params).subscribe(res=>{
      if(res['status']==200){
        this.subsidyDetails=res.result.otherDetails;
        this.actualSubsidyDetails=res.result.actualSubsidy;
        this.ActualArea=res.result.getArea;
        this.ActualSpace=res.result.getSpace;
      }
      else{
        this.loading = true;
      }
      
    });
  }
  onFinalSubmit() {
    this.finalSubmitted = true;

    let alrtMsg = (this.apprRsmSts == 1) ? 'Please enter remark & select declaration' : 'Please select declaration';
    if (this.finalForm.invalid) {
      Swal.fire({
        icon: 'error',
        text: alrtMsg
      });
      return;
    }
    
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));

    // console.log(farmerInfo);
    this.applicantId = farmerInfo.USER_ID;
    
    let resubmitRmrk = (this.apprRsmSts == 1) ? (this.finalForm.controls.resubmitRmrk.value) : '';
    let schemeParam = {
      "profileId": this.applicantId,
      "schemeId": this.schemeId,
      "applctnId": this.applctnId,
      "resubmitRmrk": resubmitRmrk
    }
    if(this.schemeId==environment.sujogPortal || this.schemeId==environment.seedDBT){
      this.loading = true;
      this.objSchmCtrl.schemeFnlSubmitSujog(schemeParam).subscribe(res => {
        if (res.status == 1) {
          this.loading = false;
          let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
          this.router.navigate(['/citizen-portal/pmksy/success', encAppCtnId]);
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
          this.loading = false;
        }
      },
        error => {
          Swal.fire({
            icon: 'error',
            text: environment.errorMsg
          });
        });
    }else{

    if(this.paySectnSts &&  this.resPaySts ==1){
      Swal.fire({
        title: 'Proceed for payment?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Yes',
        // denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.loading = true;
          this.objSchmCtrl.schemePaySubmit(schemeParam).subscribe(res => {
            if (res.status == 1) {
              let result = res.result.resData;
              this.sendPayment(result)
              // let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
              let odishaoneURL = (this.odishaone_vchRequest);

              if (odishaoneURL == undefined || odishaoneURL == null || odishaoneURL =='') {
                let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
                this.router.navigate(['/citizen-portal/pmksy/success', encAppCtnId]);
              }else{
                this.objRedirectOdishaone.post(this.odishaone_encData,odishaoneURL);
              }

              // if(odishaoneURL['SUCCESSURL'] !=''){
              //   this.objRedirectOdishaone.post(this.odishaone_encData,odishaoneURL['SUCCESSURL']);
              // }
              // window.location.href = "https://odishaone.gov.in?p1=v1&SERVICEID=123;ODISHAONEREQUESTIDad12S1wertfgsd23&USERCODE=Odishaone_2020";
            }
            else {
              Swal.fire({
                icon: 'error',
                text: res.msg
              });
              this.loading = false;
            }
          },
          error => {
              Swal.fire({
                icon: 'error',
                text: environment.errorMsg
              });
            });
        }
      })


    }else{
      this.loading = true;
      let odishaoneURL = (this.odishaone_vchRequest);

      this.objSchmCtrl.schemeFnlSubmit(schemeParam).subscribe(res => {
        if (res.status == 1) {
          this.loading = false;
          if (odishaoneURL == undefined || odishaoneURL == null || odishaoneURL =='') {
            let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
            this.router.navigate(['/citizen-portal/pmksy/success', encAppCtnId]);
          }else{
            this.objRedirectOdishaone.post(this.odishaone_encData,odishaoneURL);
          }



          // this.loading = false;
          // if(odishaoneURL['SUCCESSURL'] !=''){
          //   this.objRedirectOdishaone.post(this.odishaone_encData,odishaoneURL['SUCCESSURL']);
          // }else{
          //   let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
          //   this.router.navigate(['/citizen-portal/success', encAppCtnId]);
          // }

        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
          this.loading = false;
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

  }


  // get scheme query details
  getSchmQryRlyLst() {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applctnId": this.applctnId,
      "appHistId": this.appHistId
    };
    this.loading = true;
    this.objSchmActv.getSchmQryRlyList(params).subscribe(res => {
      if (res.status > 0) {
        this.loading = false;
        this.qryArr = res.result['qryInfoArr'];
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
  // get addmore value
  getAddMoreVal(elmV: any, colT: any) {
    if (elmV != '') {
      if (colT == 9) {
        let dateArr = elmV.split('/');
        let dateString1 = dateArr['2'] + '-' + dateArr['1'] + '-' + dateArr['0'];
        let newDate = new Date(dateString1);
        elmV = this.getFormatedDate(newDate, 'dd-MMM-yyyy');
      }
      if (colT == 10) {
        let newDate = new Date('1970-01-01T' + elmV);
        elmV = this.getFormatedDate(newDate, 'h:mm a');
      }
      if (colT == 11) {
        let newDate = new Date(elmV);
        elmV = this.getFormatedDate(newDate, 'dd-MMM-yyyy h:mm a');
      }
    }
    else {
      elmV = '--';
    }
    return elmV;
  }
  printPage() {
    window.print();
  }

  printSeedDBTVoucherPage()
  {
    var divToPrint     =   document.getElementById("printSeedDBTVoucher");
    var newWin = window.open('', 'Print-Window');

    newWin.document.open();

    newWin.document.write(`<html>
    <head>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../src/styles.css" rel="stylesheet" />
    </head>
    <body onload="window.print()">
    <div class="print-header " style="padding-bottom:10px;margin-bottom:15px;border-bottom:1px solid #000">
   <img src="${this.siteURL}assets/images/slogo.png" alt=" Government of Odisha" style="height:40px" class="dark-logo">
</div>
<h5 class="mb-3 text-success">Voucher Details</h5>
    ${divToPrint.innerHTML}</body></html>`);

    newWin.document.close();

    setTimeout(function() {
        newWin.close();
    }, 500);
  }




  // format date in typescript
  getFormatedDate(date: any, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  goBack() {
    window.history.back();
  }

  getPaymentDetails(){
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applctnId": this.applctnId,
      "appHistId": this.appHistId
    };
    this.loading = true;
    this.objSchmCtrl.getSchmPayList(params).subscribe(res => {
      if (res.result.applctnSts > 0) {
        this.resPaySts = res.result.applctnSts;
         console.log(this.resPaySts);
        this.resPayList = res.result['payArr'];
        this.paymentDetails = res.result['paymentDetails'];
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


  sendPayment(result:any){

    this.loading = true;
      var mapForm = document.createElement("form");
      mapForm.method = "POST"; // or "post" if appropriate
      mapForm.action = result.action;
      var hdn_qs = document.createElement("input");
      hdn_qs.type = "hidden";
      hdn_qs.name = "hdn_qs";
      hdn_qs.setAttribute("value","");
      mapForm.appendChild(hdn_qs);

      var actionUrl = document.createElement("input");
      actionUrl.type = "hidden";
      actionUrl.name = "actionUrl";
      actionUrl.setAttribute("value", result.action);
      mapForm.appendChild(actionUrl);


      document.body.appendChild(mapForm);
      // console.log(mapForm);
      mapForm.submit();

      // this.loading = false;
    }
    onCheckboxChange(e) {
      if (e.target.checked) {
        this.finalForm.patchValue({terms:1});
      } else {
         this.finalForm.patchValue({terms:""});
      }

    }
}
