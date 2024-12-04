import { Component, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { about } from 'src/environments/about';




// import { Navigation, Pagination, Autoplay } from 'swiper'; // Import Navigation and Pagination correctly
// Swiper.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-about-new',
  templateUrl: './about-new.component.html',
  styleUrls: ['./about-new.component.css'],
})
export class AboutNewComponent  {
  about_us_content: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const browserLang = localStorage.getItem('locale');
    if (browserLang === 'Odia') {
      this.about_us_content = this.sanitizer.bypassSecurityTrustHtml(about.about_odia_new);
    } else {
      this.about_us_content = this.sanitizer.bypassSecurityTrustHtml(about.about_eng_new);
    }
  }



}
