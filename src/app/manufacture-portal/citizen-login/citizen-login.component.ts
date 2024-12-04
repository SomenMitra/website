import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import { environment } from '../../../environments/environment';
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
  citizenPassword = null;
  mailLength = 30;
  siteURL = environment.siteURL;
  captchaImg = '';
  captchaInput = '';
  captchaData = '';
  captchaImgDisplay = false;

  constructor(public authService: CitizenAuthService, 
    private router: Router, 
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

  ngOnInit(): void {
    this.authService.logout();
    this.authService.getCaptcha().subscribe((res: any) => {
      if (res.status == 1) {
        this.captchaImg = 'data:image/jpg;base64,' + res.img;
        this.captchaData = res.data;
        this.captchaImgDisplay = true;
      }
    });
   
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

  doLogin() {
    let userId = this.citizenUserId;
    let password = this.citizenPassword;
    let captcha = this.captchaInput;

  
  
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
          let miSchemeId = result.miSchemeId;
          let miComponentId = result.miComponentId;

          let userSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["USER_ID"] = profileId;
          userSesnArr["USER_NAME_PRFX"] = namePrfx;
          userSesnArr["USER_FULL_NAME"] = appName;
          userSesnArr["USER_PROF_PIC"] = profPicUrl;
          userSesnArr["MOBILE_REQUEST"] = false;
          userSesnArr["USER_MOBILE"] = appMobile;
          userSesnArr["MI_SCHEME_ID"] = miSchemeId;
          userSesnArr["MI_COMPONENT_ID"] = miComponentId;
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          this.router.navigateByUrl('/manufacture-portal/mi-dashboard');
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
}
