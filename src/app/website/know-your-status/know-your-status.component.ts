import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { WebsiteApiService } from '../website-api.service';
import Swal from 'sweetalert2';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
@Component({
  selector: 'app-know-your-status',
  templateUrl: './know-your-status.component.html',
  styleUrls: ['./know-your-status.component.css']
})
export class KnowYourStatusComponent implements OnInit {
  @ViewChild('someSeedDBTVoucherModal') someSeedDBTVoucherModalRef: ElementRef;
  voucherModalDetails :any[]=[];
  seedDBT = environment.seedDBT;
  seedDBTPre = environment.seedDBTPre;
  respSts: any;
  groupedDirectorate: any;
  mixDirectorate:any=[];
  @ViewChild('ApplicationModal') ApplicationModal:ElementRef;
  statusform =new UntypedFormGroup({});
  submitted = false;
  isSubmitted = false;
  applications: any;
  public loading = false;
  bodyData: any;
  applicationDetails: any;
  isDataFlag = false;
  siteURL = environment.siteURL;
  dtApplication = '--';
  SchemePrev: any;
  error: any;
  farmerInfo:any;
applicationNo:any;
  otherDetails: any;
  rtnSts: any;
  p: number = 1;
  enctext = '';
  constructor(
    private formBuilder:UntypedFormBuilder,
    private api: WebsiteApiService,
    private modalService: NgbModal,
    private el: ElementRef,
    private encDec: EncryptDecryptService) { }

  ngOnInit(): void {
    this.initForm();
    this.getDirectorates();
  }

getKeyByValue(object:any, value:any) {
    for (var type in object) {
      if(value == type){
        return object[type];
      }
    }
  }

  private initForm() {
    // this.loading=true;
      this.statusform = this.formBuilder.group({
        'selDirectorate': new UntypedFormControl('',
                  [
                    Validators.required,
                  ]
        ),
        'txtapplicationId': new UntypedFormControl('',
                  [
                    Validators.required,
                  ]
      )
    });
  }


getApplicationDetails(){
    this.submitted=true;
    // console.log(this.loginForm);
    if (this.statusform.invalid) {
      return;
    }


    this.loading = true;
    this.farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let params = {
      "applicationId": this.statusform.value.txtapplicationId,
      "directorateId":this.statusform.value.selDirectorate
    };

    this.api.getApplicationTrack(params)
    .subscribe(
      // error => console.log(error)
      (res: any)=> {
        this.isSubmitted = true;
          this.applicationDetails = res.result;

          if(this.applicationDetails.length > 0){
            this.isDataFlag = true;
            this.loading = false;
          }
          else{
            this.isDataFlag = false;
           this.loading = false;
           this.applicationDetails="";
           }

      },
      error => {
        this.isSubmitted = true;
        this.error = error
        this.applicationDetails = []
      }

    );
 }



  get f(): { [key: string]: AbstractControl } {
    return this.statusform.controls;
  }

  getDirectorates(){
    let params = {

    };
    this.loading = true;
    this.api.getDirectorates(params).subscribe(res=>{
      if(res['status']==200){

        this.respSts  = res.status;


        this.respSts  = res.status;
        this.groupedDirectorate =res.result['schemService'];
        let other = res.result['other'];
        this.mixDirectorate =this.groupedDirectorate
        // this.groupedDirectorate.push(this.otherDirectorate)
        for(var i=0; i<other.length; ++i) {
          this.groupedDirectorate.push(other[i])
        }
        // this.searchForm.patchValue({'vchSector':this.directorateId});
        //   this.loading = false;
        //console.log(this.groupedDirectorate);
        this.loading = false;
      }
      else{
        this.loading = true;
      }

    });
   }

   open(content:any) {

    this.modalService.open(content, {size: 'lg',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getVoucherDetailsByID(voucherID :any, applicationId :any)
  {
    let params = {
      "profileId": 0,
      "applicationId": applicationId,
      "intVoucherId" : voucherID
    };

    this.api.getVoucherDetails(params).subscribe(res => {
      if(res.status == 200)
      {
        this.voucherModalDetails =   res.result;
        this.open(this.someSeedDBTVoucherModalRef);
      }
    });
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

  bookingCancel(appData:any){
    let params = {
      "intOnlineServiceId": appData.intAppltnId,
      "mobileNo": appData.voucherData[0].vchMobileNo,
    };
    Swal.fire({
      title: 'The OTP will Send to Registered Mobile Number, Proceed to Cancel?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((res) => {
      if (res.isConfirmed) {
        this.api.sendotp(params).subscribe(res => {
          console.log(res);
          if (res.status == 1) {
            let result = res.result;
            this.enctext = result['enctext'];
          }
          else {
            this.loading = false;

          }
        });
        this.cancelOTPValidate(params.mobileNo, this.enctext, appData);
      } else {
        console.log(122);
      }
    });
  }

  async cancelOTPValidate(mobileNo, enctext, appData:any) {
    let params = {
      "intOnlineServiceId": appData.intAppltnId,
      "mobileNo": appData.voucherData[0].vchMobileNo,
    };
     await Swal.fire({
      //position: 'bottom-end',
      title: 'Enter OTP',
      input: 'text',
      inputAttributes: {
        id: "txtOTP",
        name: "txtOTP"
       },
      inputPlaceholder: 'Enter The OTP'
     }).then((res) => {
       if (res.isConfirmed) {
         let regParam = {
           "otp": res.value,
           "enctext": this.enctext,
         };
         this.api.verifyotp(regParam).subscribe(res => {
           if (res.status == 1) {
             let result = res.result;
             this.loading = false;
             let encSchemeStr = this.encDec.encText(mobileNo.toString());
             this.api.cancelBooking(params).subscribe(res => {
               if (res.status == 1) {
                 if (res.result.txnStatus == 'SUCCESS') {
                   Swal.fire({
                     text: 'Booking cancelled successfully',
                     showDenyButton: false,
                   }).then((result) => {
                     this.getApplicationDetails();
                   });

                 } else {
                   Swal.fire({
                     text: 'Unable to process request. Please try again later!',
                     showDenyButton: false,
                   });
                 }
               }
             });
           }
           else {
             this.loading = false;
             res.value = null;
             Swal.fire({
               icon: 'error',
               text: res.msg
             });
           }
         })
  }
     });
}

}
