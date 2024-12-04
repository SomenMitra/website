import { Component, OnInit,ElementRef ,ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbTooltip, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-citizen-login',
  templateUrl: './citizen-login.component.html',
  styleUrls: ['./citizen-login.component.css'],
  providers: [CitizenAuthService]
})
export class CitizenLoginComponent implements OnInit {
  citizenUserId = null;
  aadharUserId = null;
  citizenPassword = null;
  mailLength = 30;
  siteURL = environment.siteURL;
  captchaImg = '';
  captchaInput = '';
  captchaData = '';
  captchaImgDisplay = false;
  
  aadharLogin: boolean = false; 
  useridPasswordLogin: boolean = true;
  showDiv1: boolean = false;
  showDiv2: boolean = true;
  hasSentOtp = 0;
  hasSendingOpt = 'Send OTP';
  otp = '';
  textOTP = '';
  enctext = '';
  public editable = false;
  timeLeft: number = 600;
  timeInMin='';
  interval: any;
  timer = 1000;
  enableTimer = false;
  KMobile='';
  CrossMOb = '';
  resend = 0;
  mobileNo = '';
  //MI LOGIN
  micitizenUserId = null;
  micitizenPassword = null;
  micaptchaImg = '';
  micaptchaInput = '';
  micaptchaData = '';
  micaptchaImgDisplay = false;
  domainURL = environment.domainUrl;
  loading = false;
  //MI LOGIN
  @ViewChild('someModal') someModalRef:ElementRef;
  constructor(public authService: CitizenAuthService, 
    private router: Router, 
    private modalService: NgbModal,
    public vldChkLst: ValidatorchklistService,
    public translate: TranslateService
  
  ) {    translate.addLangs(['English', 'Odia']);
  if (localStorage.getItem('locale')) {
    const browserLang = localStorage.getItem('locale');
    translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
  } else {
    localStorage.setItem('locale', 'English');
    translate.setDefaultLang('English');
  } }


  openDomainURL(): void {
    window.open(this.domainURL, '_blank');
  }

  // priyaranjan


  ngOnInit(): void {
    this.authService.logout();
    this.authService.getCaptcha().subscribe((res: any) => {
      if (res.status == 1) {
        this.captchaImg = 'data:image/jpg;base64,' + res.img;
        this.captchaData = res.data;
        this.captchaImgDisplay = true;
      }
      //MI Login
      if (res.status == 1) {
        this.micaptchaImg = 'data:image/jpg;base64,' + res.img;
        this.micaptchaData = res.data;
        this.micaptchaImgDisplay = true;
      }
    }); 
    this.toggleDivVisibility(1);
  } 

  toggleDivVisibility(id) {
    if(id == 1){
      this.showDiv1 = false;
      this.showDiv2 = true;
    }else {
       this.showDiv1 = true;
      this.showDiv2 = false;
    }
  }

  reloadCaptcha() {
    this.captchaImgDisplay = false;
    this.authService.getCaptcha().subscribe((res: any) => {
      if (res.status == 1) {
        this.captchaImg = 'data:image/jpg;base64,' + res.img;
        this.captchaData = res.data;
        this.captchaImgDisplay = true;
      }
    });
  }

  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
    window.location.reload();
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

doAadharLogin(){
  this.timeLeft = 600;
  let aadharNumber = this.aadharUserId;
  this.hasSendingOpt = 'Sending...';
  if (aadharNumber == '' || typeof (aadharNumber) == undefined || aadharNumber == null) {
    Swal.fire({
      icon: 'error',
      text: 'Enter Aadhar Number'
    }).then(function(){
      window.setTimeout(function () { 
      document.getElementById('vchAadharNumber').focus();
      }, 500); 
  });
  }
  else if (!this.vldChkLst.validAadhar(aadharNumber,'vchEmailId')) {
    Swal.fire({
      icon: 'error',
      text: 'Enter Valid Aadhaar Number'
    })
      //$("#vchAadharNumber").val('');
    this.hasSendingOpt = 'Send OTP';
    return false;
  } else {    
    let loginParam = {
      "aadharId": aadharNumber 
    };
    this.authService.getAddressDetls(loginParam).subscribe(res => {
      if(res.status=='1' && res.result.resultInfo.statusCode=='200'){
      
        this.mobileNo=res.result.resultInfo.mobileno;
        this.KMobile = res.result.resultInfo.mobileno;
        this.CrossMOb=String(this.KMobile).slice(-4);
        let otpParam={
          "mobileNo":this.mobileNo,
          // "mobileNo":9777548585
          "autoBindVerifyOtp":environment.AUTO_BIND_VERIFY_OTP
        }
        
        this.authService.sendKOotp(otpParam).subscribe(reslt=>{
          this.startTimer();
          this.open(this.someModalRef);
          this.hasSendingOpt = 'Send OTP';
          this.enctext=reslt.result.enctext;
// console.log(enctext);
          //sessionStorage.setItem('USER_SESSION_KO', JSON.stringify(res.result.resultInfo.response));
          // this.koOTPValidate(this.enctext);
          // this.doAadharOtpVerify(enctext);
          this.hasSentOtp = 1;
         this.textOTP = reslt.result.otp;

        });
        }
        else{
          this.hasSendingOpt = 'Send OTP';
          Swal.fire({
            icon: 'error',
            text: 'Please register yourself Krushak Odisha to apply for schemes on GO-SUGAM'
          })
         // $("#vchAadharNumber").val('');
        }
    });

  }
}

 
  doLogin() {
    let userId = this.citizenUserId;
    let password = this.citizenPassword;
    let captcha = this.captchaInput;

  
  
    if (userId == '' || typeof (userId) == undefined || userId == null) {
      
      Swal.fire({
        icon: 'error',
        text: 'Enter Mobile Number'
      }).then(function(){
        window.setTimeout(function () { 
        document.getElementById('vchEmailId').focus();
        }, 500); 
    });
    }
    else if (!this.vldChkLst.validMob(userId,'vchEmailId')) {
      return false;
    }
    else if (password == '' || typeof (password) == undefined || password == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter Password'
      }).then(function(){
        window.setTimeout(function () { 
        document.getElementById('Upassword').focus();
        }, 500); 
    });
    }
    else if (captcha == '' || typeof (captcha) == undefined || captcha == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter Captcha Code'
      }).then(function(){
        window.setTimeout(function () { 
        document.getElementById('mathcaptcha').focus();
        }, 500); 
    });
    }
    else {

    
      let loginParam = {
        "userId": userId,
        "passWord": password,
        "captcha": captcha,
        "captchaData": this.captchaData
      };
      this.authService.login(loginParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          let profileId = result.profileId;
          let namePrfx = result.namePrefix;
          let appName = result.applicantName;
          let appMobile = result.applicantMobile;
          let profPicUrl = result.profPicUrl;

          let userSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["USER_ID"] = profileId;
          userSesnArr["USER_NAME_PRFX"] = namePrfx;
          userSesnArr["USER_FULL_NAME"] = appName;
          userSesnArr["USER_PROF_PIC"] = profPicUrl;
          userSesnArr["MOBILE_REQUEST"] = false;
          userSesnArr["USER_MOBILE"] = appMobile;
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          this.router.navigateByUrl('/citizen-portal/dashboard');
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });

          this.citizenPassword = null;
          this.captchaInput = null;
          this.reloadCaptcha();
        }
      });

    }
  }
  cancelVeryfiOpt(){
    this.hasSentOtp = 0;
    this.hasSendingOpt = 'Send Otp';
  }

  doAadharOtpVerify(){
    let otpReference = this.textOTP;
    let enctext = this.enctext;
    let Adharvalue = (document.getElementById('vchAadharNumber') as HTMLTextAreaElement).value;
    let apiParam={
      "otp":otpReference,
      "enctext":enctext
    }
    this.authService.verifyotp(apiParam).subscribe(res => {
      let apiParam={
        "aadharId":Adharvalue
      }
      if( res.status == 1 ){
        this.authService.getAadharLoginAddressDetls(apiParam).subscribe(res => {
          this.modalService.dismissAll();
          this.mobileNo = '';
          let result = res.result;
          let profileId = result.profileId;
          let namePrfx = result.namePrefix;
          let appName = result.applicantName;
          let appMobile = result.applicantMobile;
          let profPicUrl = result.profPicUrl;

          let userSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["LOGIN_THROUGH"] = 1;  // LOGIN_THROUGH 1 -  Aadhaar , 2 - User Id / Password
          userSesnArr["USER_ID"] = profileId;
          userSesnArr["USER_NAME_PRFX"] = namePrfx;
          userSesnArr["USER_FULL_NAME"] = appName;
          userSesnArr["USER_PROF_PIC"] = profPicUrl;
          userSesnArr["MOBILE_REQUEST"] = false;
          userSesnArr["USER_MOBILE"] = appMobile;  
          userSesnArr["USER_AADHAAR"] = Adharvalue;  
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          // sessionStorage.setItem('USER_SESSION_KO_DATA', JSON.stringify(res.result.resultInfo.response_data));
          this.router.navigateByUrl('/citizen-portal/dashboard');
          
        });
      } else{
        this.textOTP = '';
        Swal.fire({
          icon: 'error',
          text: 'Please Enter Valid OTP'
        });
      }
    });
  }

resendOtp(){
  //  this.mobileNo = (document.getElementById('mobileNo') as HTMLTextAreaElement).value;
   this.mobileNo = (document.getElementById('mobileNo') as HTMLTextAreaElement).value;
  let otpParam={
    // "mobileNo":mobileNo,
    "mobileNo": this.mobileNo
    // "mobileNo": 9777548585
  }
  this.textOTP = '';
  this.authService.sendKOotp(otpParam).subscribe(reslt=>{
    this.startTimer();
    this.enctext=reslt.result.enctext;
    this.resend = 1 ;
    //this.textOTP = reslt.result.otp;
  });
}
startTimer() {
  this.enableTimer = true;
  let timer = 1000;
  this.timeLeft = 600;
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
      this.enableTimer = false;
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
  open(content:any) {
    this.modalService.open(content, {size: 'md',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //MI LOGIN

  showMiPassword(): void {
    const passwordInput = document.querySelector('.mipassword') as HTMLInputElement;
    const passImg = document.querySelector('.mishow__password') as HTMLElement;

    if (passwordInput.type === "password") {
      passImg.innerHTML = "<i class='icon-eye'></i>";
      passwordInput.type = "text";
    } else {
      passImg.innerHTML = "<i class='icon-eye-slash'></i>";
      passwordInput.type = "password";
    }
  }

  doMiLogin() {
    let userId = this.micitizenUserId;
    let password = this.micitizenPassword;
    let captcha = this.micaptchaInput;



    if (userId == '' || typeof (userId) == undefined || userId == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter User Id'
      });
    }
    // else if (!this.vldChkLst.validMob(userId)) {
    //   return false;
    // }
    else if (password == '' || typeof (password) == undefined || password == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter Password'
      });
    }
    else if (captcha == '' || typeof (captcha) == undefined || captcha == null) {

      Swal.fire({
        icon: 'error',
        text: 'Enter Captcha Code'
      });
    }
    else {

      this.loading = true;
      let loginParam = {
        "userId": userId,
        "passWord": password,
        "captcha": captcha,
        "captchaData": this.micaptchaData
      };
      this.authService.miLogin(loginParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          let profileId = result.profileId;
          let namePrfx = result.namePrefix;
          let appName = result.applicantName;
          let appMobile = result.applicantMobile;
          let profPicUrl = result.profPicUrl;
          let miSchemeId = result.miSchemeId;
          let miComponentId = result.miComponentId;
          let tinApplicationStatus = result.tinApplicationStatus;
          let expiryDate = result.expiryDate;
          let reApplyDate = result.reApplyDate;
          
          let userSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["USER_ID"] = profileId;
          userSesnArr["IS_MIREG"] = 2;
          userSesnArr["USER_NAME_PRFX"] = namePrfx;
          userSesnArr["USER_FULL_NAME"] = appName;
          userSesnArr["USER_PROF_PIC"] = profPicUrl;
          userSesnArr["MOBILE_REQUEST"] = false;
          userSesnArr["USER_MOBILE"] = appMobile;
          userSesnArr["MI_SCHEME_ID"] = miSchemeId;
          userSesnArr["MI_COMPONENT_ID"] = miComponentId;
          userSesnArr["APPLICATION_STATUS"] = tinApplicationStatus;
          userSesnArr["MI_REAPPLY_DATE"] = reApplyDate;
          userSesnArr["MI_EXPIRY_DATE"] = expiryDate;
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          this.loading = false;
          if (tinApplicationStatus == 1) {
            this.router.navigateByUrl('/manufacture-portal/changepassword');
          }
          else {
            this.router.navigateByUrl('/manufacture-portal/mi-dashboard');
          }
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
          this.loading = false;
          this.micitizenPassword = null;
          this.captchaInput = null;
          this.reloadCaptcha();
        }
      });

    }
  }
  reloadMiCaptcha() {
    this.micaptchaImgDisplay = false;
    this.authService.getCaptcha().subscribe((res: any) => {
      if (res.status == 1) {
        this.micaptchaImg = 'data:image/jpg;base64,' + res.img;
        this.micaptchaData = res.data;
        this.micaptchaImgDisplay = true;
      }
    });
  }
  //MI LOGIN
}



