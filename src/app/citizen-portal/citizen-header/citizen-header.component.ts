import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormGroup, FormControl, Validators, AbstractControl,UntypedFormBuilder } from '@angular/forms';
import { WebsiteApiService } from '../../website/website-api.service';
import * as $ from 'jquery';
import Swal from 'sweetalert2';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-citizen-header',
  templateUrl: './citizen-header.component.html',
  styleUrls: ['./citizen-header.component.css']
})
export class CitizenHeaderComponent implements OnInit {


  siteURL = environment.siteURL;

  domainURL = environment.domainUrl;
  citizenNm = '';
  citizenPic: any;
  loginSts = false;
  windowWidth: any = $(window).width();
  fontSize = 16;
  clickLimit = 3;
  ClickCount = 0;
  ClickCountminus = 0;
  language: any = 'English';
  languageNew: any = 'English';
  textSearch: any = "";
  whetherOdishaOne = 0;
  citizenUserId = '';
  odishaoneintegrationID = '';



  error: any;
  apiUrl = environment.apiUrl;
lang='';
  searchform = new UntypedFormGroup({});


  @ViewChild('someModal') someModalRef: ElementRef;

  constructor(private authService: CitizenAuthService,
    private router: Router,
    public translate: TranslateService,
    private apilist: WebsiteApiService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder
  ) {
    translate.addLangs(['English', 'Odia']);

    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
      $('body').addClass(browserLang);
    } else {
      localStorage.setItem('locale', 'English');
      translate.setDefaultLang('English');
    }
  }


  ngOnInit(): void {
    this.languageNew = localStorage.getItem('locale');
    this.searchform = this.formBuilder.group({
      txtSearch: ['', Validators.required]

  });


  if (localStorage.getItem('theme') === 'theme-dark') {
    this.setTheme('theme-dark');
    $('#slider').prop("checked", true)

} else {
    this.setTheme('theme-light');
    $('#slider').prop("checked", false)
}
    this.loginSts = this.authService.isLoggedIn();
    if(this.loginSts)
    {
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      let landInfo_data  = JSON.parse(sessionStorage.getItem('USER_SESSION_KO_DATA'));
      this.citizenNm = farmerInfo.USER_FULL_NAME;
      this.citizenPic= farmerInfo.USER_PROF_PIC;
      this.citizenUserId = farmerInfo.USER_ID;
      this.odishaoneintegrationID = farmerInfo.ODISHAONE_INTEGRATIONID;
      this.whetherOdishaOne     = farmerInfo.WHETHERODISHAONE?farmerInfo.WHETHERODISHAONE:0;

    }
    if (this.windowWidth < 800) {
      //header:not(.search input)
      $('.citizenmenu:not(.navbar-collapse)').on("click", function(event){

        $('.navbar-collapse').removeClass('show');

  });
       }
  }

  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);

    window.location.reload();
  }
  
  IncreaseFontSize() {
    if (this.ClickCount >= this.clickLimit) {

      return false;
    }
    else {
      this.fontSize = (this.fontSize + 1);
      document.body.style.fontSize = this.fontSize + 'px';
      this.ClickCount++;
      return true;
    }

  }
  DecreaseFontSize() {
    if (this.ClickCountminus >= this.clickLimit) {

      return false;
    }
    else {
      this.fontSize = (this.fontSize - 1);
      document.body.style.fontSize = this.fontSize + 'px';
      this.ClickCountminus++;
      return true;
    }

  }

  ResetFontSize() {


    document.body.style.fontSize = '16px';
    this.ClickCount = 0;
    this.ClickCountminus = 0;
  }
  doLogout() {
    this.authService.logout();
  }
  doOdishaOneLogout() {
   // this.authService.logout();
    //sessionStorage.clear();
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    sessionStorage.removeItem(farmerInfo)
    let urlOdishaOne = this.domainURL+"integration/odishaOneCallBackUrl/"+(this.odishaoneintegrationID)
    window.location.href = urlOdishaOne;
  }





  setTheme(themeName:any) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }
  // function to toggle between light and dark theme
  toggleTheme() {

  if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-light');
  } else {
      this.setTheme('theme-dark');
  }
  }

}
