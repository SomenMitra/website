import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbTooltip, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { UntypedFormGroup, FormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { TranslateService } from '@ngx-translate/core';
import { ManufactureSchemeService } from '../service-api/manufacture-scheme.service';

@Component({
  selector: 'app-reference-number-login',
  templateUrl: './reference-number-login.component.html',
  styleUrls: ['./reference-number-login.component.css']
})
export class ReferenceNumberLoginComponent {
  buttonDisabled: boolean;
  siteURL = environment.siteURL;
  referenceNo = '';
  mobileNo = '';
  profileId = '';
  textOTP = '';
  maxLghNm = 100;
  minLghNm = 5;
  loading = false;
  maxLghotp = 4;
  minLghotp = 4;
  verifyForm: UntypedFormGroup;
  reverify: any = 0;
  resend = 0;
  public editable = false;
  sendOTP = '';
  enctext = '';
  timeLeft: number = 600;
  timeInMin = '';
  interval;

  @ViewChild('someModal') someModalRef: ElementRef;

  constructor(public authService: CitizenAuthService,
    private router: Router,
    private encDec: EncryptDecryptService,
    public vldChkLst: ValidatorchklistService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private manufactureService: ManufactureSchemeService,
    public translate: TranslateService
  ) {

    translate.addLangs(['English', 'Odia']);
    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
    } else {
      localStorage.setItem('locale', 'English');
      translate.setDefaultLang('English');
    }
  }
  ngOnInit(): void {
    this.buttonDisabled = false;
  }
  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
    window.location.reload();
  }
  resendOtp() {
    let textOTP = this.textOTP;
    this.timeLeft = 600;
    this.startTimer();
    let mobileNo = this.mobileNo;
    this.textOTP = null;
    let regParam = {
      "mobileNo": mobileNo,
    };
    this.loading = true;
    this.authService.sendotp(regParam).subscribe(res => {
      if (res.status == 1) {
        let result = res.result;
        this.enctext = result['enctext'];

      }
      else {
        this.loading = false;

      }
    });
  }
  verifyReferenceNo() {
    let referenceNo = this.referenceNo;
    let vSts = true;
    if (!this.vldChkLst.blankCheck(referenceNo, "Enter Reference Number")) {
      vSts = false;
    } else {
      vSts = true;
    }
    if (!vSts) {
      return vSts;
    } else {
      let regParam = {
        "referenceNo": this.referenceNo,
      };
      this.loading = false;
      this.manufactureService.verifyReferenceNumber(regParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          this.mobileNo = result.mobileNo;
          this.profileId = result.profileId;
          this.referenceNo = result.referenceNo;
          this.getOTP();
        }
        if (res.status == 3) {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
        else {
          this.loading = false;
        }
      });
    }
  }

  getOTP() {
    let mobileNo = this.mobileNo;
      this.startTimer();
      this.open(this.someModalRef);
      let regParam = {
        "mobileNo": mobileNo,
      };

      this.loading = true;
      this.authService.sendotp(regParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          this.enctext = result['enctext'];


          // let profileId = result['profileId'];
          // let encProfId = this.encDec.encText((profileId).toString());
          // this.loading = false;
          // this.router.navigateByUrl('/citizen-portal/registration-confirmation/' + encProfId);
        }
        else {
          this.loading = false;
        }
      });

  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        let minutes: number = Math.floor(this.timeLeft / 60);
        this.timeInMin = ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(this.timeLeft - minutes * 60)).slice(-2);
      } else {
        this.timeLeft = 0;
        this.editable = true;
      }
    }, 1000)
  }
  verifyOTP() {
          console.log(this.mobileNo, this.profileId, this.referenceNo);
    //console.log(this.sendOTP);
    let textOTP = this.textOTP;
    let vSts = true;
    let otpTime = this.timeLeft;
    let enctext = this.enctext;
    //let sendotp='123456';
    if (!this.vldChkLst.blankCheck(textOTP, "Otp")) {
      vSts = false;
      this.textOTP = null;
    }
    else if (otpTime === 0) {
      this.textOTP = null;
      Swal.fire({
        icon: 'error',
        text: 'OTP expired, Click resend to get OTP'
      });
      vSts = false;
    }
    else {
      vSts = true;
    }


    if (!vSts) {
      return vSts;
    }
    else {
      this.loading = true;
      let regParam = {
        "otp": textOTP,
        "enctext": enctext,
      };
      this.authService.verifyotp(regParam).subscribe(res => {
        if (res.status == 1) {
          console.log(this.mobileNo, this.profileId, this.referenceNo);
          this.modalService.dismissAll();
          this.redirectToDocumentPage()
        }
        else {
          this.loading = false;
          this.textOTP = null;
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      });

    }
  }

  redirectToDocumentPage() {
    let params = this.encDec.encText((this.profileId + ':' + this.referenceNo +':'+this.mobileNo).toString());
      // let userSesnArr = {};
      // userSesnArr["USER_SESSION"] = "access_token";
      // userSesnArr["USER_ID"] = this.profileId;
      // userSesnArr["MOBILE_REQUEST"] = false;
      // userSesnArr["USER_MOBILE"] = this.mobileNo;
      // userSesnArr["MI_REFERENCE_NUMBER"] = this.referenceNo;
      // sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
    this.router.navigate(['/manufacture-portal/manufacture-doc-upload/' + params])
  }


  // register() {
  //   let namePrfx = '';
  //   // let aadhaarNumber = this.aadhaarNumber;
   
  //   let mobileNo = this.mobileNo;
    

  //   let regParam = {
  //     "namePrfx": namePrfx,
  //     "firmName": firmName,
  //     "companyRegNo": companyRegNo,
  //     "companyHeadName": companyHeadName,
  //     "txtGstin": gstin,
  //     "mobileNo": mobileNo,
  //     "emailId": emailId,
  //   };
  //   //console.log(regParam);
  //   this.loading = true;
  //   this.authService.manufactureRegister(regParam).subscribe(res => {
  //     if (res.status == 1) {
  //       let result = res.result;
  //       let profileId = result['profileId'];
  //       let referenceNo = result['referenceNo'];
  //       // let encProfId = this.encDec.encText((profileId).toString());
  //       this.loading = false;
  //       Swal.fire({
  //         icon: 'success',
  //         text: 'You have successfully registered on the SUGAM Portal. For future logins, please use your reference number ' + referenceNo
  //       }).then((result) => {
  //         this.loading = false;
  //         if (result.isConfirmed) {
  //           this.router.navigateByUrl('/manufacture-portal/reference-login');
  //         }
  //       });
  //     }
  //     else {
  //       this.loading = false;
  //       Swal.fire({
  //         icon: 'error',
  //         text: res.msg
  //       });
  //     }
  //   });



  // }
  open(content: any) {

    this.modalService.open(content, { size: 'md', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
