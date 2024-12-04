import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebsiteApiService } from '../website-api.service';

@Component({
  selector: 'app-fup',
  templateUrl: './fup.component.html',
  styleUrls: ['./fup.component.css']
})
export class FupComponent implements OnInit {
  token: string;
  constructor(private route:ActivatedRoute,private router: Router, private websiteApi:WebsiteApiService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      //console.log(this.token); // Use the token as needed
    });
    this.getFupTokenData();
  }
  
  getFupTokenData(){
    const params={
      // 'verifyToken':this.route.snapshot.paramMap.get('token')
      'verifyToken':this.token
    };
    this.websiteApi.getFupTokenData(params).subscribe(
      (res) => {
        if (res.result != '' && res.result.profileId > 0) {
          this.doTokenExpire(params);
          let result = res.result;
          let profileId = res.result.profileId;
          let namePrfx = res.result.namePrefix;
          let appName = res.result.vchApplicantName;
          let appMobile = res.result.vchMobileNo;
          let profPicUrl = res.result.vchProfilePic;
          let userSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["USER_ID"] = profileId;
          userSesnArr["USER_NAME_PRFX"] = namePrfx;
          userSesnArr["USER_FULL_NAME"] = appName;
          userSesnArr["USER_PROF_PIC"] = profPicUrl;
          userSesnArr["MOBILE_REQUEST"] = false;
          userSesnArr["USER_MOBILE"] = appMobile;
          userSesnArr["LOGIN_THROUGH_FUP"] = 1;
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          this.router.navigateByUrl('/citizen-portal/dashboard');
        } else {
          console.error('Error:', res.message);
          this.router.navigateByUrl('/token_expired');
        }
      } 
    );
  }
  doTokenExpire(params){
    this.websiteApi.setTokenExpire(params).subscribe(
      (res) => {
        console.log(res);
      });
  }
   
  
}

