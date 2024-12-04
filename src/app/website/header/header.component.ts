import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';  
import * as $ from 'jquery';
import { AccessibilityFormComponent } from '../accessibility-form/accessibility-form.component';

import { WebsiteApiService } from '../website-api.service';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { FormGroup, FormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  siteURL = environment.siteURL;
  domainURL=environment.domainUrl;
  windowWidth:any =$(window).width();
  fontSize = 16;
  clickLimit = 3;
  ClickCount = 0;
  ClickCountminus=0;
  citizenNm = '';
  loginSts  = false;
  language:any = 'English';
  languageNew:any = 'English';
  selectLanguage = false;
  public loading = false;
  applicantId:any;
  respSts:any;
  menuitems:any;
  textSearch:any="";
  isSettingDivVisible: boolean = false;
  isDivVisible = false;
  // searchform =new FormGroup({});
  searchform = new UntypedFormGroup({});
  isDropdownOpen: boolean;
  isOpen: boolean;
  constructor(private authService: CitizenAuthService,
     private router: Router,
     public translate: TranslateService,
     private menulist:WebsiteApiService,
     private activatedRoute: ActivatedRoute,
     private formBuilder: FormBuilder
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

  


    toggleSettingDiv() {
      this.isSettingDivVisible = !this.isSettingDivVisible;
    }
  ngOnInit(): void {

    this.languageNew = localStorage.getItem('locale');
  //   this.searchform = this.formBuilder.group({
  //     txtSearch: ['', Validators.required]
     
  // });

    this.loginSts = this.authService.isLoggedIn();
    if(this.loginSts)
    {
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      this.applicantId = farmerInfo.USER_ID;
      let nmPrfx=farmerInfo.USER_NAME_PRFX;
      let fullNm=farmerInfo.USER_FULL_NAME;
      //this.citizenNm=nmPrfx+'. '+fullNm;
      this.citizenNm=fullNm;
    }



  //   if (localStorage.getItem('theme') === 'theme-dark') {
  //     this.setTheme('theme-dark');
  //     $('#slider').prop("checked", true)
    
  // } else {
  //     this.setTheme('theme-light');
  //     $('#slider').prop("checked", false)
  // }
  

    //this.getMenu();

    if(this.windowWidth < 800 ){
      //header:not(.search input)
       $('header:not(.search input)').on("click", function(event){
        
           $('.navbar-collapse').removeClass('show');
               
     });
       }
      //  this.showModalOnPageLoad();
  }
 
  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
    window.location.reload();
 }

  IncreaseFontSize() {
    if(this.ClickCount>=this.clickLimit) {
       
        return false;
      }
      else
      {
        this.fontSize = (this.fontSize + 1);
        document.body.style.fontSize = this.fontSize + 'px';
        this.ClickCount++;
        return true;
      }
     
    }
  DecreaseFontSize() {
  if(this.ClickCountminus>=this.clickLimit) {
   
		return false;
	}
	else
	{
    this.fontSize = (this.fontSize - 1);
    document.body.style.fontSize = this.fontSize + 'px'; 
    this.ClickCountminus++;
    return true;
  }
 
}

ResetFontSize(){

 
  document.body.style.fontSize = '16px';
  this.ClickCount = 0;
this.ClickCountminus=0;
}

/*getMenu()
{
  let params = {
    "mType": 1,
    "lang": localStorage.getItem('locale')
  };
  this.loading = true;
  this.menulist.headerMenu(params).subscribe(res=>{
    if(res['status']=='200'){

      this.respSts  = res.status;
      this.menuitems = res.result;

      this.loading = false;
      
      //console.log(res.result);

    }else{
     
      this.loading = false;
    }
    
    
  });
}*/


doLogout() {
  this.authService.logout();
}

// setTheme(themeName:any) {
//   localStorage.setItem('theme', themeName);
//   document.documentElement.className = themeName;
// }
// function to toggle between light and dark theme
// toggleTheme() {

// if (localStorage.getItem('theme') === 'theme-dark') {
//     this.setTheme('theme-light');
// } else {
//     this.setTheme('theme-dark');
// }
// }





// priyaranjan



toggleDiv() {
  if (this.isOpen) {
    this.isOpen = false;
  }
  this.isDivVisible = !this.isDivVisible;
}

closeDiv() {
  this.isDivVisible = false;
  this.isOpen = false;
}

closeDropdown(event: Event) {
  event.preventDefault();
  this.isOpen = false;
  this.isDivVisible = false; 
}

// Toggle dropdown state
toggleDropdown() {
  if (this.isDivVisible) {
    this.isDivVisible = false;
  }
  this.isOpen = !this.isOpen;
}




// priyaranjan

}
