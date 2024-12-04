import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { TranslateService } from '@ngx-translate/core';
import { OdishaoneRedirectService } from '../../odishaoneredirect.service';

@Component({
  selector: 'app-odishaone',
  templateUrl: './odishaone.component.html',
  //template: '<ul><ng-content></ng-content></ul>',
  styleUrls: ['./odishaone.component.css'],
  providers: [CitizenAuthService]
})
export class OdishaoneComponent implements OnInit {

  constructor(public authService: CitizenAuthService,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    private router: Router,
    public vldChkLst: ValidatorchklistService,
    public translate: TranslateService,
    private objRedirectOdishaone: OdishaoneRedirectService
  ) { }

  ngOnInit(): void {
    //this.authService.logout();
    let whetherOdishaOne = 0;
    let userId   = this.route.snapshot.paramMap.get('id');

    // let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
     sessionStorage.removeItem('FFS_SESSION');
     sessionStorage.removeItem('FFS_SESSION_SCHEME');

    let jsonData =  JSON.parse(atob(userId));
    let schemeExist = jsonData.schemeExist;
    let aadharNumber = jsonData.aadharNumber;
    let intProcessId = jsonData.schemeID;
    let processName = jsonData.processName;
    let integrationId = jsonData.integrationId;
    let odishaonecallback = jsonData.odishaonecallback;
    let ODISHAONE_encData = jsonData.ODISHAONE_encData;
    let vchRequest = jsonData.vchRequest;

    if(aadharNumber || integrationId){
      whetherOdishaOne =1;
    }else{
       whetherOdishaOne =0;
    }

    if (userId != '') {
      let loginParam = {
        "userId": jsonData.mobileNo,
        "passWord": "Admin@123",
        "captcha": "captcha",
        "captchaData": "captcha",
        "odishaone": "yes",


      };
      this.authService.login(loginParam).subscribe(res => {

        if (res.status == 1) {

          let result = res.result;
          let profileId = result.profileId;
          let namePrfx = result.namePrefix;
          let appName = result.applicantName;
          let appMobile = result.applicantMobile;
          let profPicUrl = result.profPicUrl;
          //let intProcessId = result.intProcessId;
         // console.log(result); return false;
          let encAppCtnId = this.encDec.encText((intProcessId ).toString());

          let userSesnArr = {};
          let schmSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["USER_ID"] = profileId;
          userSesnArr["USER_NAME_PRFX"] = namePrfx;
          userSesnArr["USER_FULL_NAME"] = appName;
          userSesnArr["USER_PROF_PIC"] = profPicUrl;
          userSesnArr["MOBILE_REQUEST"] = false;
          userSesnArr["USER_MOBILE"] = appMobile;
          userSesnArr["ODISHAONE_AADHAR"] = aadharNumber;
          userSesnArr["WHETHERODISHAONE"] = whetherOdishaOne;
          userSesnArr["ODISHAONE"] = 1;
          userSesnArr["ODISHAONE_INTEGRATIONID"] = integrationId;
          schmSesnArr["FFS_APPLY_SCHEME_NAME"]    =  processName;
          schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    =  'Scheme';
          schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] =  intProcessId;

          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
          //this.router.navigateByUrl('/citizen-portal/profile-update/VTJGc2RHVmtYMTgzbVM5bHdJbnpmL3ZxblI0VUxTL3VwYlk5VytnTVJsUT0%3D');
          if(schemeExist == 1){
            this.router.navigate(['/citizen-portal/dashboard']);
          }else{
             this.router.navigate(['/citizen-portal/profile-update', encAppCtnId]);
          }

        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });

          // this.citizenPassword = null;
          // this.captchaInput = null;
          // this.reloadCaptcha();
        }
      });


    }

  }


}
