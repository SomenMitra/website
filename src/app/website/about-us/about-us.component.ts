import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { about } from 'src/environments/about';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) { }
  about_us_content :any;
  ngOnInit(): void {
    const browserLang = localStorage.getItem('locale');
    if(browserLang=='Odia'){
      this.about_us_content = this.sanitizer.bypassSecurityTrustHtml(about.about_odi);
    }else{
      this.about_us_content = this.sanitizer.bypassSecurityTrustHtml(about.about_eng);
    }
    
  }

}
