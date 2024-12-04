import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CitizenAuthService } from '../service-api/citizen-auth.service';

@Component({
  selector: 'app-mobile-page',
  templateUrl: './mobile-page.component.html',
  styleUrls: ['./mobile-page.component.css']
})
export class MobilePageComponent implements OnInit {
 
  encryptedValue: any;
  schemeType:any;
  public loading = false;

  constructor(public route:ActivatedRoute,
    public authService: CitizenAuthService, 
    private router: Router ) { }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
    
       this.encryptedValue = params.encryptedValue;
       this.schemeType = params.type;
        console.log(this.encryptedValue);
       // console.log(this.schemeType);

    }
  );
  this.doLogin() 
  }
  doLogin() {
    let userId = this.encryptedValue;
    let stype = this.schemeType;
    
  let loginParam = {
        "userId": userId
       };
       this.loading = true;
      this.authService.mobilelogin(loginParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          //console.log(result)
          let profileId = result.profileId;
          let namePrfx = result.namePrefix;
          let appName = result.applicantName;
          let appMobile = result.applicantMobile;
          //let profPicUrl = result.profPicUrl;
          

          let userSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["USER_ID"] = profileId;
          userSesnArr["USER_NAME_PRFX"] = namePrfx;
          userSesnArr["USER_FULL_NAME"] = appName;
          userSesnArr["USER_MOBILE"] = appMobile;
          userSesnArr["MOBILE_REQUEST"] = true;
         // userSesnArr["USER_PROF_PIC"] = profPicUrl;
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          if(stype == 1)
          {
            this.loading = false;
            this.router.navigateByUrl('/citizen-portal/scheme-directorate');
          }
          else{
            this.loading = false;
            this.router.navigateByUrl('/citizen-portal/dashboard');
          }
          
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });

        }
      });

   
  }
}
