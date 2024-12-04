import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import { UntypedFormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, NgbTooltip, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ValidatorchklistService } from '../../validatorchklist.service';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { NgModule } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  citizenUserId = null;
  citizenPassword = null;
  mailLength = 30;
  siteURL = environment.siteURL;

  userIdStatus = true;
  OTPStatus = false;
  submitted = false;
  mobileNo = "";
  maxLghMob = 10;
  minLghMob = 10;
  loading = false;
  textOTP = "";
  maxLghotp = 6;
  minLghotp = 6;
  verifyForm: UntypedFormGroup;
  reverify: any = 0;
  resend = 0;
  public editable = false;
  sendOTP='';
  enctext='';
  timeLeft: number = 30;
  interval;

  @ViewChild('someModal') someModalRef:ElementRef;

  constructor(public authService: CitizenAuthService, 
    private router: Router, 
    public vldChkLst: ValidatorchklistService,
    private modalService: NgbModal,
    private encDec: EncryptDecryptService,
    public translate: TranslateService) {
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
  //this.authService.logout();
    
  }
  



  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
    window.location.reload();
  }
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
        this.editable= true;
      }
    },1000)
  }

  resendOtp(){
    let textOTP = this.textOTP;
    this.timeLeft = 120;
    this.startTimer();
    let mobileNo = this.mobileNo;
    this.textOTP=null;
    let regParam = {
       "mobileNo": mobileNo,
     };
     this.loading = true;
     this.authService.sendotp(regParam).subscribe(res => {
       if (res.status == 1) {
         let result = res.result;
         this.enctext=result['enctext'];
        
       }
       else {
         this.loading = false;
      
       }
     });
  
  
  
   }

  verifyOTP(){
    //console.log(this.sendOTP);
    let textOTP = this.textOTP;
    let vSts = true;
    let otpTime=this.timeLeft;
    let enctext=this.enctext;
    let mobileNo = this.mobileNo;
    //let sendotp='123456';
    if (!this.vldChkLst.blankCheck(textOTP, "Otp")) {
      vSts = false;
        this.textOTP=null;
    }
    else if (otpTime === 0) {
      this.textOTP=null;
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
          let result = res.result;       
          this.loading = false;
          //this.router.navigateByUrl('/citizen-portal/login');
          let encSchemeStr = this.encDec.encText(mobileNo.toString());
          this.router.navigate(['/manufacture-portal/changeforgotpassword/',encSchemeStr]);
        }
        else {
          this.loading = false;
          this.textOTP=null;
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      });
  
    }
  }

  forgorPassword(){
    let mobileNo = this.mobileNo;
    console.log(mobileNo);
    let vSts = true;
     if (!this.vldChkLst.blankCheck(mobileNo, "Mobile No.")) {
      vSts = false;
    }else if (!this.vldChkLst.maxLength(mobileNo, this.maxLghMob, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(mobileNo, this.minLghMob, "Mobile Number")) {
      vSts = false;
    }
    
    else{
      this.userIdStatus=false;
      this.OTPStatus = true;

      this.startTimer();
     
      let regParam = {
       
        "mobileNo": mobileNo,
       
      };


      this.loading = true;
      this.authService.sendotp(regParam).subscribe(res => {
        console.log(res);
        if (res.status == 1) {
          let result = res.result;
          this.enctext=result['enctext'];        
        }
        else {
          this.loading = false;
       
        }
      });
      
      
    }

    }
    
    

}







