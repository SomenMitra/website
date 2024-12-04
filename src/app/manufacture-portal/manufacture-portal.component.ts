import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, NavigationEnd } from '@angular/router';
import { CitizenAuthService } from './service-api/citizen-auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-manufacture-portal',
  templateUrl: './manufacture-portal.component.html',
  styleUrls: ['./manufacture-portal.component.css']
})
export class ManufacturePortalComponent implements OnInit {
  isLogin = false;
  mobileReq=false;
  routerPath = null;
  constructor(private authService: CitizenAuthService, private router: Router) {
    //console.log(this.router.events);

       
    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationEnd) {
            let rootFiles = ['/manufacture-portal/login','/manufacture-portal/registration','/manufacture-portal/registration-confirmation/:id','/manufacture-portal/forgotpassword','/manufacture-portal/mobilepage','/manufacture-portal/odishaone'];
            if (rootFiles.includes(event.url)) {
              this.isLogin = false;
            }
            else {
              this.isLogin = true;
              let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
              if(farmerInfo)
              {
                this.mobileReq = (typeof(farmerInfo.MOBILE_REQUEST)!='undefined')?farmerInfo.MOBILE_REQUEST:false;
              } 
            }
          }
        });


  }

  ngOnInit(): void {
  }
  onActivate(event) {
    window.scroll(0,0);
 
}
}
