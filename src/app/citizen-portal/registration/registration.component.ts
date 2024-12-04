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




@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  buttonDisabled: boolean;
  siteURL = environment.siteURL;
  captchaImg = '';
  captchaData = '';
  captchaImgDisplay = false;

  applicantName = '';
  applicantAddress='';

  emailId = '';
  mobileNo = '';
  password = '';
  confirmPwd = '';
  captcha = '';
  textOTP='';
  maxLghNm = 100;
  minLghNm = 5;
  maxLghEmail = 50;
  minLghEmail = 10;
  maxLghMob = 10;
  minLghMob = 10;
  maxLghPwd = 15;
  minLghPwd = 8;
  loading = false;

  maxLghotp = 4;
  minLghotp = 4;
  verifyForm: UntypedFormGroup;
  reverify: any = 0;
  resend = 0;
  public editable = false;
sendOTP='';
enctext='';
timeLeft: number = 600;
timeInMin='';
  interval;
  timer = 1000;

  @ViewChild('someModal') someModalRef:ElementRef;
  resp: any;
  constructor(public authService: CitizenAuthService,
     private router: Router,
      private encDec: EncryptDecryptService, 
      public vldChkLst: ValidatorchklistService,
      private modalService: NgbModal,
      private formBuilder: UntypedFormBuilder,
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



// priayaranjan
otp: string[] = ['', '', '', ''];

onInput(event: any, index: number) {
  const input = event.target as HTMLInputElement;
  this.otp[index] = input.value;

  if (input.value.length === 1) {
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

  
// priayaranjan

  ngOnInit(): void {



    this.buttonDisabled = false;
    


  }
  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
    window.location.reload();
 }
//  resendOtp(){
//   let textOTP = this.textOTP;
//   this.timeLeft = 600;
//   this.startTimer();
//   let mobileNo = this.mobileNo;
//   this.textOTP=null;
//   let regParam = {
//      "mobileNo": mobileNo,
//    };
//    this.loading = true;
//    this.authService.sendotp(regParam).subscribe(res => {
//      if (res.status == 1) {
//        let result = res.result;
//        this.enctext=result['enctext'];
//        this.resend = 1;
//      }
//      else {
//        this.loading = false;
    
//      }
//    });
//   }
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
        this.loading = false;
      }
      else {
        this.loading = false;

      }
    });
  }

  getOTP(){
    let namePrfx = '';
    let applicantName = this.applicantName;
    let emailId = this.emailId;
    let mobileNo = this.mobileNo;
    let password = this.password;
    let confirmPwd = this.confirmPwd;
    let applicantAddress=this.applicantAddress;
   
    let vSts = true;
    // console.log(this.id);
    //  if (!this.vldChkLst.blankCheck(aadhaarNumber, "Aadhaar Number")) {
    //   vSts = false;
    // }
    if (!this.vldChkLst.blankCheck(applicantName, "Name as in Aadhaar",'txtApplicantName')) {
      vSts = false;
    }
    else if (!this.vldChkLst.spaceFirstValidate(applicantName, "Invalid Name",'txtApplicantName')) {
      vSts = false;
    }
    else if (!this.vldChkLst.isBlankCheckSpaceVAlidation(applicantName, "Invalid Name",'txtApplicantName')) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(applicantName, this.maxLghNm, "Name as in Aadhaar")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(applicantName, this.minLghNm, "Name as in Aadhaar")) {
      vSts = false;
    }

    else if (!this.vldChkLst.spaceFirstValidate(emailId, "Invalid Email Id",'txtEmail')) {
      vSts = false;
    }
    else if (!this.vldChkLst.validEmail(emailId,'txtEmail')) {
      vSts = false;
    }       
    else if (!this.vldChkLst.maxLength(emailId, this.maxLghNm, "Email Id",'txtEmail')) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(emailId, this.minLghNm, "Email Id",'txtEmail')) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(mobileNo, "Mobile Number",'txtMobile')) {
      vSts = false;
    }
    else if (!this.vldChkLst.validMob(mobileNo,'txtMobile')) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(mobileNo, this.maxLghMob, "Mobile Number",'txtMobile')) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(mobileNo, this.minLghMob, "Mobile Number",'txtMobile')) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(applicantAddress, "Communication Address",'txtApplicantAddress')) {
      vSts = false;
    }
    else if (!this.vldChkLst.isBlankCheckSpaceVAlidation(applicantAddress, "Invalid Communication Address",'txtApplicantAddress')) {
      vSts = false;
    }
    else if (!this.vldChkLst.spaceFirstValidate(applicantAddress, "Invalid Communication Address",'txtApplicantAddress')) {
      vSts = false;
    }
    else if (password == '' || typeof (password) == undefined || password == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter Password'
      }).then(function(){
          window.setTimeout(function () { 
          document.getElementById('txtPassword').focus();
          }, 500); 
      });
      vSts = false;
    }
    else if (!this.vldChkLst.validPassword(password,'txtPassword')) {
      vSts = false;
    }

    else if (confirmPwd == '' || typeof (confirmPwd) == undefined || confirmPwd == null) {
      Swal.fire({
        icon: 'error',
        text: 'Enter Confirm Password'
      }).then(function(){
        window.setTimeout(function () { 
        document.getElementById('txtConfirmPassword').focus();
        }, 500); 
    });
      vSts = false;

    }
    else if (password != confirmPwd) {
      Swal.fire({
        icon: 'error',
        text: 'Password and Confirm password are not matching'
      }).then(function(){
        window.setTimeout(function () { 
        document.getElementById('txtConfirmPassword').focus();
        }, 500); 
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
        "mobileNo": mobileNo,
      };
      this.authService.checkRegMobileExist(regParam).subscribe(res => {
        this.resp = res.result[0];
        if (this.resp.status == 1) {
          this.loading = false;
          this.timeLeft = 600;
          this.startTimer();
          this.open(this.someModalRef);
          this.otp = ['', '', '', ''];
          this.authService.sendotp(regParam).subscribe(res => {
            if (res.status == 1) {
              let result = res.result;
              this.enctext = result['enctext'];
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
      // this.authService.sendotp(regParam).subscribe(res => {
      //   if (res.status == 1) {
      //     let result = res.result;
      //     this.enctext=result['enctext'];
      //     this.textOTP = res.result.otp;
      //   }
      //   else {
      //     this.loading = false;  
      //   }
      // });      
    }
  }
  
  
  showPassword(): void {
    const passwordInput = document.querySelector('.password') as HTMLInputElement;
    const passImg = document.querySelector('.show__password') as HTMLElement;

    if (passwordInput.type === "password") {
      passImg.innerHTML = "<i class='icon-eye'></i>";
      passwordInput.type = "text";
    } else {
      passImg.innerHTML = "<i class='icon-eye-slash'></i>";
      passwordInput.type = "password";
    }
  }


  showCPassword(): void {
    const passwordInput = document.querySelector('.password2') as HTMLInputElement;
    const passImg = document.querySelector('.show__password2') as HTMLElement;

    if (passwordInput.type === "password") {
      passImg.innerHTML = "<i class='icon-eye'></i>";
      passwordInput.type = "text";
    } else {
      passImg.innerHTML = "<i class='icon-eye-slash'></i>";
      passwordInput.type = "password";
    }
  }


  startTimer() {
    let timer = 1000;
    this.clearTimer();
    this.editable= false;
    this.interval = setInterval(() => {
     
      if(this.timeLeft > 0) {
        this.timeLeft--;
        let minutes: number = Math.floor(this.timeLeft / 60);
        this.timeInMin = ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(this.timeLeft - minutes * 60)).slice(-2);
        if(minutes <= 7){
          this.editable= true;
        }
      } else {
        this.timeLeft = 0;
        this.editable= true;
      }
    },timer)
  }
  // Function to clear the interval
clearTimer() {
  if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
  }
}
// verifyOTP(){
//   //console.log(this.sendOTP);
//   let textOTP = this.textOTP;
//   let vSts = true;
//   let otpTime=this.timeLeft;
//   let enctext=this.enctext;
//   //let sendotp='123456';
//   if (!this.vldChkLst.blankCheck(textOTP, "Otp")) {
//     vSts = false;
//       this.textOTP=null;
//   }
//   else if (otpTime === 0) {
//     this.textOTP=null;
//     Swal.fire({
//       icon: 'error',
//       text: 'OTP expired, Click resend to get OTP'
//     });
//     vSts = false;
//   }
//   else {
//     vSts = true;
//   }


//   if (!vSts) {
//     return vSts;
//   }
//   else {
//     this.loading = true;
//     let regParam = {
       
//       "otp": textOTP,
//       "enctext": enctext,
//     };
//     this.authService.verifyotp(regParam).subscribe(res => {
//       if (res.status == 1) {
//         this.modalService.dismissAll();
//         this.register()
//       }
//       else {
//         this.loading = false;
//         this.textOTP=null;
//         Swal.fire({
//           icon: 'error',
//           text: res.msg
//         });
//       }
//     });

//   }
  //   }
  getConcatenatedOtp(): string {
    return this.otp.join('');
  }
  verifyOTP() {
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
          this.register()
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



  register() {
    let namePrfx = '';
    // let aadhaarNumber = this.aadhaarNumber;
    let applicantName = this.applicantName;
    // let applicantDob = this.applicantDob;
    let emailId = this.emailId;
    let mobileNo = this.mobileNo;
    let password = this.password;
    let confirmPwd = this.confirmPwd;
    let applicantAddress=this.applicantAddress;
    // let captcha = this.captcha;


    let regParam = {
      "namePrfx": namePrfx,
      "fullName": applicantName,
      "txtApplicantAddress": applicantAddress,
      "mobileNo": mobileNo,
      "emailId": emailId,
      "password": password,
      "cPassword": confirmPwd,
     
    };
    //console.log(regParam);
    this.loading = true;
    this.authService.register(regParam).subscribe(res => {
      if (res.status == 1) {
        let result = res.result;
        let profileId = result['profileId'];
        let encProfId = this.encDec.encText((profileId).toString());
        this.loading = false;
        this.router.navigateByUrl('/citizen-portal/registration-confirmation/' + encProfId);
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
  open(content:any) {
  
    this.modalService.open(content, {size: 'md',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
