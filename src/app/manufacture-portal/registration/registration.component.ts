import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
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
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  siteURL = environment.siteURL;

  //Form Field
  verifyForm: UntypedFormGroup;
  firmName = '';
  companyRegNo = '';
  companyHeadName = '';
  gstin = '';
  emailId = '';
  mobileNo = '';
  txtAddress = '';

  //Loader
  loading = false;

  //OTP
  resend = 0;
  public editable = false;
  sendOTP = '';
  textOTP = '';
  enctext = '';
  timeLeft: number = 600;
  timeInMin = '';
  interval;
  otp: string[] = ['', '', '', ''];

  //Mobile and Email Verify
  isMobileVerified: boolean = false;
  @ViewChild('verifyMobileNo') verifyMobileNo: ElementRef;
  isEmailVerified: boolean = false;
  @ViewChild('verifyEmailId') verifyEmailId: ElementRef;
  resp: any;
  //Mobile and Email Verify
  
  //Validation Length
  maxRefNoLghNm = 18;
  minRefNoLghNm = 18;
  maxFirmLghNm = 100;
  minFirmLghNm = 5;
  maxCompanyRegLghNm = 21;
  minCompanyRegLghNm = 21;
  maxComHeadLghNm = 50;
  minComHeadLghNm = 5;
  maxLghMob = 10;
  minLghMob = 10;
  maxLghEmail = 50;
  minLghEmail = 10;
  maxLghGSTIN = 15;
  minLghGSTIN = 15;
  maxAddressLgh = 200;
  minAddressLgh = 10;

  //Others
  referenceNo = '';
  profileId: any;
  @ViewChild('verifyReferenceNumber') verifyReferenceNumber: ElementRef;
  mobileNoRef: any;
  constructor(public authService: CitizenAuthService,
    private router: Router,
    private encDec: EncryptDecryptService,
    public vldChkLst: ValidatorchklistService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private manufactureService: ManufactureSchemeService,
    public translate: TranslateService,
    private renderer: Renderer2
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


  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    this.otp[index] = input.value;

    if (input.value.length > 1) {
      input.value = input.value.charAt(0);
    }

    if (index < this.otp.length - 1 && input.value) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    // Handle backspace key press
    if (event.key === 'Backspace' && input.value.length === 0) {
      const prevInput = input.previousElementSibling as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        this.otp[index - 1] = '';
      }
    }

    // Handle delete key press
    if (event.key === 'Delete' && input.value.length === 0) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
        this.otp[index] = '';
      }
    }


    if (!['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key) && isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  getConcatenatedOtp(): string {
    return this.otp.join('');
  }




  ngOnInit(): void {
  }
  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
    window.location.reload();
  }
  resendOtp() {
    const concatenatedOtp = this.getConcatenatedOtp();
    this.otp = ['', '', '', ''];
    let textOTP = concatenatedOtp;
    this.timeLeft = 600;
    this.startTimer();
    let mobileNo = this.mobileNo;
    textOTP = '';
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

  // Method to copy text to clipboard using a fallback method


  // copyToClipboard(text) {
  //   // Create a temporary textarea element
  //   const textarea = document.createElement('textarea');
  //   textarea.value = text;
  //   document.body.appendChild(textarea);

  //   // Select the text and execute the copy command
  //   textarea.select();
  //   try {
  //     document.execCommand('copy');
  //     console.log('Text copied to clipboard');
  //   } catch (err) {
  //     console.error('Failed to copy text: ', err);
  //   }

  //   // Remove the temporary textarea
  //   document.body.removeChild(textarea);
  // }


  




  //MODAL OPEN
  open(content: any) {
    this.modalService.open(content, { size: 'md', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  //MODAL OPEN

  //Verify Reference Number
  verifyReferenceNo() {
    let referenceNo = this.referenceNo;
    let vSts = true;
    if (!this.vldChkLst.blankCheck(referenceNo, "Reference Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(referenceNo, this.maxRefNoLghNm, "Reference Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(referenceNo, this.minRefNoLghNm, "Reference Number")) {
      vSts = false;
    } else {
      vSts = true;
    }
    if (!vSts) {
      return vSts;
    } else {
      this.loading = true;
      let regParam = {
        "referenceNo": this.referenceNo,
      };
      this.manufactureService.verifyReferenceNumber(regParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          this.mobileNoRef = result.mobileNo;
          this.profileId = result.profileId;
          this.referenceNo = result.referenceNo;
          this.loading = false;
          this.getOTPForReference();
        }
        if (res.status == 3) {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
          this.referenceNo = '';
        }
        if (res.status == 4) {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
          this.referenceNo = '';
        }
        if (res.status == 5) {
          this.loading = false;
          Swal.fire({
            icon: 'info',
            text: res.msg
          });
          this.referenceNo = '';
        }
        else {
          this.loading = false;
        }
      });
    }
  }
  //Verify Reference Number
  //Get OTP For Reference Number Login
  getOTPForReference() {
    let mobileNo = this.mobileNoRef;
    this.startTimerForReference();
    this.otp = ['', '', '', ''];
    this.timeLeft = 600;
    this.open(this.verifyReferenceNumber);
    let regParam = {
      "mobileNo": mobileNo,
    };

    this.loading = true;
    this.authService.sendotp(regParam).subscribe(res => {
      if (res.status == 1) {
        let result = res.result;
        this.enctext = result['enctext'];
        this.loading = false;
      }
      else {
        this.loading = false;
      }
    });

  }
  //Get OTP For Reference Number Login
  startTimerForReference() {
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
  //VERIFY OTP OF REFERENCE NUMBER
  verifyOTPForReference() {
    const concatenatedOtp = this.getConcatenatedOtp();
    let textOTP = concatenatedOtp;
    let vSts = true;
    let otpTime = this.timeLeft;
    let enctext = this.enctext;
    let otpLength = textOTP.length;
    if (!this.vldChkLst.blankCheck(textOTP, "OTP")) {
      vSts = false;
      this.otp = ['', '', '', ''];
    }
    else if (otpLength != 4) {
      vSts = false;
      Swal.fire({
        icon: 'error',
        text: 'Invalid OTP'
      });
      this.otp = ['', '', '', ''];
    }
    else if (otpTime === 0) {
      this.otp = ['', '', '', ''];
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
          const checkParam = {
            "mobileNo": this.mobileNo,
            "profileId": this.profileId,
            "referenceNo": this.referenceNo
          };
          this.authService.checkDocUpload(checkParam).subscribe(res => {
            if (res.status == 1) {
              let result = res.result;
              if (result[0].checkStatus == 1) {
                let profileId = result[0].profileId;
                let appName = result[0].vchApplicantName;
                let appMobile = result[0].vchMobileNo;
                let appEmail = result[0].vchEmail;
                let mivchReferenceNo = result[0].vchReferenceNo;
                let miComponentId = result[0].intComponentId;

                let userSesnArr = {};
                userSesnArr["USER_SESSION"] = "access_token";
                userSesnArr["IS_MIREG"] = 1;
                userSesnArr["USER_ID"] = profileId;
                userSesnArr["USER_FULL_NAME"] = appName;
                userSesnArr["USER_EMAIL"] = appEmail;
                userSesnArr["MOBILE_REQUEST"] = false;
                userSesnArr["USER_MOBILE"] = appMobile;
                userSesnArr["MI_REFERENCE_NO"] = mivchReferenceNo;
                userSesnArr["MI_COMPONENT_ID"] = miComponentId;
                sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
                this.modalService.dismissAll();
                this.redirectToManufactureApp()
              } else {
                let profileId = result[0].profileId;
                let appName = result[0].vchApplicantName;
                let appMobile = result[0].vchMobileNo;
                let appEmail = result[0].vchEmail;
                let mivchReferenceNo = result[0].vchReferenceNo;
                let miComponentId = result[0].intComponentId;

                let userSesnArr = {};
                userSesnArr["USER_SESSION"] = "access_token";
                userSesnArr["IS_MIREG"] = 1;
                userSesnArr["USER_ID"] = profileId;
                userSesnArr["USER_FULL_NAME"] = appName;
                userSesnArr["USER_EMAIL"] = appEmail;
                userSesnArr["MOBILE_REQUEST"] = false;
                userSesnArr["USER_MOBILE"] = appMobile;
                userSesnArr["MI_REFERENCE_NO"] = mivchReferenceNo;
                userSesnArr["MI_COMPONENT_ID"] = miComponentId;
                sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
                this.modalService.dismissAll();
                this.redirectToDocumentPage()
              }
            }
            else {
              this.loading = false;
            }
          });
        }
        else {
          this.loading = false;
          this.otp = ['', '', '', ''];
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      });

    }
  }
  //VERIFY OTP OF REFERENCE NUMBER

  //REDIRECT TO DOCUMENT PAGE
  redirectToDocumentPage() {
    const upload = 1;
    let params = this.encDec.encText((this.profileId + ':' + this.referenceNo + ':' + this.mobileNo + ':' + upload).toString());
    this.router.navigate(['/manufacture-portal/manufacture-doc-upload/' + params])
  }
  //REDIRECT TO DOCUMENT PAGE

  //REDIRECT TO MANUFACTURE APPLICATION VIEW
  redirectToManufactureApp() {
    let params = this.encDec.encText((this.profileId + ':' + this.referenceNo + ':' + this.mobileNo).toString());
    this.router.navigate(['/manufacture-portal/manufacture-applied/' + params])
  }
  //REDIRECT TO MANUFACTURE APPLICATION VIEW

  //VERIFY MOBILE NUMBER BY OTP
  onMobileNumberChange() {
    this.isMobileVerified = false;
  }
  mobileVerify() {
    let mobileNo = this.mobileNo;
    let vSts = true;
    if (!this.vldChkLst.blankCheck(mobileNo, "Official Mobile No.")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validMob(mobileNo)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(mobileNo, this.maxLghMob, "Official Mobile No.")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(mobileNo, this.minLghMob, "Official Mobile No.")) {
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
        "mobileNo": mobileNo,
      };
      this.authService.checkMobileExist(regParam).subscribe(res => {
        this.resp = res.result[0];
        if (this.resp.status == 1) {
          this.otp = ['', '', '', ''];
          this.authService.sendotp(regParam).subscribe(res => {
            if (res.status == 1) {
              let result = res.result;
              this.enctext = result['enctext'];
              this.loading = false;
              this.timeLeft = 600;
              this.startTimer();
              this.open(this.verifyMobileNo);
            }
            else {
              this.loading = false;
            }
          });
        }
        else {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            text: this.resp.msg
          });
        }
      });
    }
  }

  verifyMobileOTP() {
    const concatenatedOtp = this.getConcatenatedOtp();
    let textOTP = concatenatedOtp;
    let vSts = true;
    let otpTime = this.timeLeft;
    let enctext = this.enctext;
    let otpLength = textOTP.length;

    if (!this.vldChkLst.blankCheck(textOTP, "OTP")) {
      vSts = false;
      this.otp = ['', '', '', ''];
    }
    else if (otpLength != 4) {
      vSts = false;
      Swal.fire({
        icon: 'error',
        text: 'Invalid OTP'
      });
      this.otp = ['', '', '', ''];
    }
    else if (otpTime === 0) {
      this.otp = ['', '', '', ''];
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
          this.modalService.dismissAll();
          this.isMobileVerified = true;
          this.loading = false;
        }
        else {
          this.loading = false;
          this.otp = ['', '', '', ''];
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      });

    }
  }
  //VERIFY MOBILE NUMBER BY OTP

  //VERIFY EMAILID BY OTP
  onEmailIdChange() {
    this.isEmailVerified = false;
  }
  emailIdVerify() {
    let emailId = this.emailId;
    let vSts = true;
    if (!this.vldChkLst.blankCheck(emailId, "Official E-mail Id")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validEmail(emailId)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(emailId, this.maxLghEmail, "Official E-mail Id")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(emailId, this.minLghEmail, "Official E-mail Id")) {
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
        "emailId": emailId,
      };
      this.authService.checkEmailIdExist(regParam).subscribe(res => {
        this.resp = res.result[0];
        if (this.resp.status == 1) {
          
          this.otp = ['', '', '', ''];
          this.authService.sendEmailOtp(regParam).subscribe(res => {
            if (res.status == 1) {
              let result = res.result;
              this.enctext = result['enctext'];
              this.loading = false;
              this.timeLeft = 600;
              this.startTimer();
              this.open(this.verifyEmailId);
            }
            else {
              this.loading = false;
            }
          });
        }
        else {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            text: this.resp.msg
          });
        }
      });
    }
  }

  verifyEmailIdOTP() {
    const concatenatedOtp = this.getConcatenatedOtp();
    let textOTP = concatenatedOtp;
    let vSts = true;
    let otpTime = this.timeLeft;
    let enctext = this.enctext;
    let otpLength = textOTP.length;

    if (!this.vldChkLst.blankCheck(textOTP, "OTP")) {
      vSts = false;
      this.otp = ['', '', '', ''];
    }
    else if (otpLength != 4) {
      vSts = false;
      Swal.fire({
        icon: 'error',
        text: 'Invalid OTP'
      });
      this.otp = ['', '', '', ''];
    }
    else if (otpTime === 0) {
      this.otp = ['', '', '', ''];
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
          this.modalService.dismissAll();
          this.isEmailVerified = true;
          this.loading = false;
        }
        else {
          this.loading = false;
          this.otp = ['', '', '', ''];
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      });

    }
  }
  //VERIFY EMAILID BY OTP


  //REGISTER API CALL
  register() {
    let namePrfx = '';
    let firmName = this.firmName;
    let companyRegNo = this.companyRegNo;
    let companyHeadName = this.companyHeadName;
    let emailId = this.emailId;
    let mobileNo = this.mobileNo;
    let gstin = this.gstin;
    let txtAddress = this.txtAddress;

    let regParam = {
      "namePrfx": namePrfx,
      "firmName": firmName,
      "companyRegNo": companyRegNo,
      "companyHeadName": companyHeadName,
      "mobileNo": mobileNo,
      "emailId": emailId,
      "txtGstin": gstin,
      "txtAddress": txtAddress
    };
    
    this.loading = true;
    this.authService.manufactureRegister(regParam).subscribe(res => {
      if (res.status == 1) {
        let result = res.result;
        let profileId = result['profileId'];
        let referenceNo = result['referenceNo'];
        let mobileNo = result['mobileNo'];
        let appName = result['vchApplicantName'];
        let appEmail = result['vchEmail'];
        let mivchReferenceNo = result['vchReferenceNo'];
        this.loading = false;
        Swal.fire({
          icon: 'success',
          html: `
            <div class="verify__modals">
                <div class="verification__success">
                  <h5>Registration Successful</h5>
                  <p class="mb-1">Your Application Reference Number is</p>
                  <div class="app__no">${referenceNo} 
                  <span title="Copy" id="copyButton" (click)="copyToClipboard(${referenceNo})"> <i class="bi bi-clipboard"></i> </span>
                  </div>
                </div>
                <hr>
                <p>You can use this reference number to log in to your account</p>
            </div>
        `,
          showCancelButton: true,
          confirmButtonText: 'Proceed to Next',
          cancelButtonText: 'Skip',
          confirmButtonColor: '#5B9F68',
          cancelButtonColor: '#6E6E6E',
          customClass: {
            confirmButton: 'swal-button',
            cancelButton: 'swal-cancel'
          },
          allowOutsideClick: false, // Prevent closing when clicking outside
          allowEscapeKey: false, // Optional: Prevent closing with the escape key
          allowEnterKey: false // Optional: Prevent closing with the enter key
        }).then((result) => {
          this.loading = false;
          if (result.isConfirmed) {
            let userSesnArr = {};
            userSesnArr["USER_SESSION"] = "access_token";
            userSesnArr["IS_MIREG"] = 1;
            userSesnArr["USER_ID"] = profileId;
            userSesnArr["USER_FULL_NAME"] = appName;
            userSesnArr["USER_EMAIL"] = appEmail;
            userSesnArr["MOBILE_REQUEST"] = false;
            userSesnArr["USER_MOBILE"] = mobileNo;
            userSesnArr["MI_REFERENCE_NO"] = mivchReferenceNo;
            sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
            const upload = 1;
            let params = this.encDec.encText((profileId + ':' + referenceNo + ':' + mobileNo + ':' + upload).toString());
            this.router.navigate(['/manufacture-portal/manufacture-doc-upload/' + params]);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.router.navigateByUrl('/manufacture-portal/registration');
            this.firmName = '';
            this.companyRegNo = '';
            this.companyHeadName = '';
            this.emailId = '';
            this.mobileNo = '';
            this.gstin = '';
            this.txtAddress = '';
            this.isMobileVerified = false;
            this.isEmailVerified = false;
          }
        });
        setTimeout(() => {
          document.getElementById('copyButton').addEventListener('click', () => {
            this.copyToClipboard(referenceNo);
          });
        }, 0);
      }
      else {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          text: res.msg
        });
      }
    });
  }
  //REGISTER API CALL


  copyToClipboard(referenceNo): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referenceNo).then(() => {
        Swal.fire({
          title: 'Success!',
          text: 'Copied to clipboard!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }).catch(err => {
        console.error('Failed to copy: ', err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to copy!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
    } else {
      //  older browsers
      const textarea = document.createElement('textarea');
      textarea.value = referenceNo;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        Swal.fire({
          //title: 'Success!',
          text: `Your Application Reference Number Copied Succesfully`,
          // text: `Your Application Reference Number is ${this.numberToCopy}`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (err) {
        console.error('Fallback: Failed to copy: ', err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to copy!',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
      document.body.removeChild(textarea);
    }
  }


  //Registration of Manufacture
  miRegister() {
    let namePrfx = '';
    let firmName = this.firmName;
    let companyRegNo = this.companyRegNo;
    let companyHeadName = this.companyHeadName;
    let emailId = this.emailId;
    let mobileNo = this.mobileNo;
    let gstin = this.gstin;
    let txtAddress = this.txtAddress;
    let vSts = true;
    if (!this.vldChkLst.blankCheck(firmName, "Name of Firm")) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(firmName, this.maxFirmLghNm, "Name of Firm")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(firmName, this.minFirmLghNm, "Name of Firm")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(companyRegNo, "Company Reg. No")) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(companyRegNo, this.maxCompanyRegLghNm, "Company Reg. No")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(companyRegNo, this.minCompanyRegLghNm, "Company Reg. No")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(companyHeadName, "Name of the Company Head")) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(companyHeadName, this.maxComHeadLghNm, "Name of the Company Head")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(companyHeadName, this.minComHeadLghNm, "Name of the Company Head")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(gstin, "GSTIN")) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(gstin, this.maxLghGSTIN, "GSTIN")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(gstin, this.minLghGSTIN, "GSTIN")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(txtAddress, "Address")) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(txtAddress, this.maxAddressLgh, "Addess")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(txtAddress, this.minAddressLgh, "Addess")) {
      vSts = false;
    }
    else {
      vSts = true;
    }
    if (!vSts) {
      return vSts;
    }
    else {
      this.register();
      
    }

  }
  //Registration of Manufacture
}
