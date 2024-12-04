import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { EncryptDecryptService } from '../encrypt-decrypt.service';
import { CitizenSchemeService } from '../citizen-portal/service-api/citizen-scheme.service';
import { WebsiteApiService } from '../website/website-api.service';
import { CitizenAuthService } from '../citizen-portal/service-api/citizen-auth.service';
import Swiper from 'swiper';
declare var bootstrap: any;
@Component({
  selector: 'app-home-new',
  templateUrl: './home-new.component.html',
  styleUrls: ['./home-new.component.css']
})
export class HomeNewComponent {
  isSettingDivVisible: boolean = false;
  fontSize = 16;
  clickLimit = 3;
  ClickCount = 0;
  ClickCountminus=0;
  isDivVisible = false;
  selectLanguage = false;  
  //dirIconsNew = environment.websiteDirectorate;
  dirIconsNew = [
    { id: 1, key: "Fisheries", value: "Promotes scientific aquaculture in the state and look after the welfare of Fisher folk.", icon: "fish-new.png", bannerId: "Fisheries",darkIcon: "", odiaValue: "ରାଜ୍ଯ଼ରେ ବୈଜ୍ଞାନିକ ଜଳଚର ଚାଷକୁ ପ୍ରୋତ୍ସାହିତ କରିବା ଏବଂ ମତ୍ସ୍ଯ଼ଜୀବୀଙ୍କ କଲ୍ଯ଼ାଣ ପ୍ରତି ଧ୍ଯ଼ାନ ଦେବାକୁ ପ୍ରୋତ୍ସାହିତ କରେ।", odiaKey: "ମତ୍ସ୍ୟଚାଷ" , mobileImage:"banner-fish-mob.jpg"},
    { id: 2, key: "Animal Husbandry", value: "Promotes comprehensive support in areas such as animal husbandry, veterinary services, and livestock farming", icon: "animal-new.png", bannerId: "Animal",darkIcon: "", odiaValue:"ପଶୁପାଳନ, ପଶୁ ଚିକିତ୍ସା ସେବା ଏବଂ ପଶୁପାଳନ ପରି କ୍ଷେତ୍ରରେ ବ୍ଯ଼ାପକ ସମର୍ଥନକୁ ପ୍ରୋତ୍ସାହିତ କରେ।", odiaKey: "ପଶୁପାଳନ" , mobileImage:"banner-animal-mob.jpg" },
    { id: 3, key: "APICOL", value: "Promotes Commercial Agri Enterprises in the state in the Agriculture, Horticulture, Animal Resources Development, Agri Exports, Food Processing and Fisheries sectors", icon: "apicol-new.png", bannerId: "APICOL",darkIcon: "", odiaValue: "ରାଜ୍ଯ଼ରେ କୃଷି, ଉଦ୍ଯ଼ାନ କୃଷି, ପଶୁ ସମ୍ବଳ ବିକାଶ, କୃଷି ରପ୍ତାନୀ, ଖାଦ୍ଯ଼ ପ୍ରକ୍ରିଯ଼ାକରଣ ଏବଂ ମତ୍ସ୍ଯ଼ଚାଷ କ୍ଷେତ୍ରରେ ବାଣିଜ୍ଯ଼ିକ କୃଷି ଉଦ୍ଯ଼ୋଗକୁ ପ୍ରୋତ୍ସାହନ କରେ।", odiaKey: "ଆପିକୋଲ୍" , mobileImage:"banner-apicol-mob.jpg" },
    { id: 4, key: "Horticulture", value: "Promotes the cultivation of fruits, vegetables, spices, flowers, and other high-value crops to increase farmers' incomes and diversify agricultural production", icon: "horticulture-new.png", bannerId: "Horticulture",darkIcon: "", odiaValue: "କୃଷକଙ୍କ ଆୟ ବୃଦ୍ଧି ଏବଂ କୃଷି ଉତ୍ପାଦନରେ ବିବିଧତା ଆଣିବା ପାଇଁ ଫଳ, ପନିପରିବା, ମସଲା, ଫୁଲ ଏବଂ ଅନ୍ଯ଼ାନ୍ଯ଼ ଉଚ୍ଚ ମୂଲ୍ଯ଼ର ଫସଲ ଚାଷକୁ ପ୍ରୋତ୍ସାହିତ କରେ।", odiaKey: "ଉଦ୍ୟାନ କୃଷି"  , mobileImage:"banner-culture-mob.jpg"},
    { id: 6, key: "Agriculture", value: "Promotes agricultural productivity, ensuring food security, and improving the livelihoods of farmers", icon: "agriculture-new.png", bannerId: "Agriculture",darkIcon: "", odiaValue: "କୃଷି ଉତ୍ପାଦନଶୀଳତାକୁ ପ୍ରୋତ୍ସାହନ ଦେବା, ଖାଦ୍ଯ଼ ସୁରକ୍ଷା ସୁନିଶ୍ଚିତ କରିବା ଏବଂ କୃଷକମାନଙ୍କ ଜୀବିକା ନିର୍ବାହରେ ଉନ୍ନତି ଆଣିବାକୁ ପ୍ରୋତ୍ସାହିତ କରେ।", odiaKey: "କୃଷି" , mobileImage:"banner-agri-mob.jpg" },
    { id: 7, key: "Factories & Boilers", value: "", icon: "Factories.png", bannerId: "", darkIcon: "Factories-dark.png", odiaValue: "", odiaKey: "କାରଖାନା ଏବଂ ବଏଲର" },
    { id: 8, key: "Revenue Department", value: "", icon: "Revenue-dept.png", bannerId: "", darkIcon: "Revenue-dept-dark.png", odiaValue: "", odiaKey: "ରାଜସ୍ୱ ବିଭାଗ" },
    { id: 9, key: "Housing & Urban Development", value: "", icon: "logo-sujog.png", bannerId: "", darkIcon: "logo-sujog.png", odiaValue: "", odiaKey: "ଗୃହ ଏବଂ ସହରୀ ବିକାଶ" },
    { id: 10, key: "Energy Department", value: "", icon: "Revenue-dept.png", bannerId: "", darkIcon: "Revenue-dept-dark.png", odiaValue: "", odiaKey: "ଶକ୍ତି ବିଭାଗ" },
    { id: 11, key: "Pollution Control Board", value: "", icon: "Pollution.png", bannerId: "", darkIcon: "Pollution-dark.png", odiaValue: "", odiaKey: "ପ୍ରଦୂଷଣ ନିୟନ୍ତ୍ରଣ ବୋର୍ଡ" },
];
  siteURL = environment.siteURL;

  fileUrl = environment.fileUrl;
  dirIcons = environment.directoryListicons;
  dateVal:any;
  public loading = false;
  applicantId:any;
  respSts:any;
  respList:any;
  groupedDirectorate:any;
  otherDirectorate:any;
  announcementitems:any;
  notificationitems:any;
  closeResult = '';
  isAnnouncementFlag = false;
  isnotificationFlag = false;
  selLanguage='English';
  loginSts  = false;
  toggleDiv() {
    this.isDivVisible = !this.isDivVisible;
  }
  toggleSettingDiv() {
    this.isSettingDivVisible = !this.isSettingDivVisible;
  }

  constructor(
    public translate: TranslateService,
    private router:Router,
    private objSchm:CitizenSchemeService,
    private encDec: EncryptDecryptService,
    private servicesList:WebsiteApiService,
    public authService:CitizenAuthService
   ) {
     translate.addLangs(['English', 'Odia']);
     if (localStorage.getItem('locale')) {
        const browserLang = localStorage.getItem('locale');
        translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
        $('body').addClass(browserLang);
        this.selLanguage=browserLang;
     } else {
        localStorage.setItem('locale', 'English');
        translate.setDefaultLang('English');
     }

    }

    ngOnInit(): void {
      this.loginSts = this.authService.isLoggedIn();
      if(this.loginSts)
      {
        let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
        this.applicantId = farmerInfo.USER_ID;
      }
    
      
      this.getDirectorates()

      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const elements = document.querySelectorAll('rect.hidden, circle.hidden');
        
        if (scrollY > window.innerHeight) {
            elements.forEach(element => {
                element.classList.remove('hidden');
            });
        }
    });
    
    
    
    // this.showModalOnPageLoad();
  
   }
// swiper

ngAfterViewInit() {
  // First Swiper (e.g., for banner)
  const swiperBanner = new Swiper('.swiper-banner', {
    loop: true,
    slidesPerView: 1,
    slidesPerGroup: 1,  // Grouping slides together
    autoplay: {
   // Delay in milliseconds before switching to the next slide
      disableOnInteraction: false, // Keep autoplay running after interaction
    },
    pagination: {
      el: '.swiper-banner .swiper-pagination',
      clickable: true, // Make pagination bullets clickable
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    spaceBetween: 0, // Remove space between slides
  });
  

  // Second Swiper (e.g., for dept)
  // const swiperDept = new Swiper('.swiper-dept', {
  //   loop: true,
  //   slidesPerView: 5, // Default for larger screens
  //   spaceBetween: 0,
  //   autoplay: {
  //     delay: 3000,
  //     disableOnInteraction: false, // Allow autoplay to continue even after user interactions
  //   },
  //   pagination: {
  //     el: '.swiper-dept .swiper-pagination', // Specific to this swiper
  //     clickable: true, // Enable clickable pagination
  //   },
  //   navigation: {
  //     nextEl: '.swiper-dept .swiper-button-next', // Specific to this swiper
  //     prevEl: '.swiper-dept .swiper-button-prev', // Specific to this swiper
  //   },
  //   breakpoints: {
  //     // Adjust slides per view at different viewport widths
  //     1920: {
  //       slidesPerView: 5,
  //       spaceBetween: 0,
  //     },
  //     1440: {
  //       slidesPerView: 5,
  //       spaceBetween: 0,
  //     },
  //     1200: {
  //       slidesPerView: 5,
  //       spaceBetween: 0,
  //     },
  //     1025: {
  //       slidesPerView: 4,
  //       spaceBetween: 0,
  //     },
  //     1024: {
  //       slidesPerView: 3,
  //       spaceBetween: 0,
  //     },
  //     768: {
  //       slidesPerView: 2,
  //       spaceBetween: 0,
  //     },
  //     640: {
  //       slidesPerView: 1,
  //       spaceBetween: 0,
  //     },

  //     576: {
  //       slidesPerView: 1,
  //       spaceBetween: 0,
  //     },
  //     480: {
  //       slidesPerView: 1,
  //       spaceBetween: 0,
  //     },
  //     430: {
  //       slidesPerView: 1,
  //       spaceBetween: 0,
  //     },
  //   },
  // });
  
  
}



   showModalOnPageLoad() {
    // Get the modal element
      const modalElement = document.getElementById('exampleModalopen');
      
      if (modalElement) {
        // Initialize the Bootstrap modal
        const modalInstance = new bootstrap.Modal(modalElement);
        
        // Show the modal
        modalInstance.show();
      }
    }
    viewSchemsPage(schemeStr : any,type:any)
    {
      let encSchemeStr = this.encDec.encText(schemeStr.toString()+':'+type.toString());
      this.router.navigate(['/home/scheme-list',encSchemeStr]);
    }
    getDirectorates(){
      let params = {
       
      };
      this.loading = true;
      this.servicesList.getDirectorates(params).subscribe(res=>{
        if(res['status']==200){
    
        this.respSts  = res.status;
      
     
    this.groupedDirectorate = res.result['schemService'];
    this.otherDirectorate = res.result['other'];
        this.loading = false;
     
        }
        else{
          this.loading = true;
        }
        
      });
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
