import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { about } from 'src/environments/about';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit, AfterViewInit  {

  constructor(private sanitizer: DomSanitizer) { }

  contact_us_content :any;
  ngOnInit(): void {
    const browserLang = localStorage.getItem('locale');
    console.log(browserLang);
    if(browserLang=='Odia'){
      this.contact_us_content = this.sanitizer.bypassSecurityTrustHtml(about.contact_us_odi);
    }else{
      this.contact_us_content = this.sanitizer.bypassSecurityTrustHtml(about.contact_us_eng);
    }
    





  }
  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    // @ts-ignore: Ignore missing type definitions for Leaflet from CDN
    const map = L.map('map').setView([20.2961, 85.8189], 14);

    // @ts-ignore: Ignore missing type definitions for Leaflet from CDN
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    // @ts-ignore: Ignore missing type definitions for Leaflet from CDN
    L.marker([20.2961, 85.8189]).addTo(map)
      .bindPopup('Fisheries & Animal Resources Development Department')
      .openPopup();

    // @ts-ignore: Ignore missing type definitions for Leaflet from CDN
    L.marker([20.2961, 85.8301]).addTo(map)
      .bindPopup('Department Of Agriculture And Farmers\' Empowerment');

    // Fix for resizing issues
    setTimeout(() => {
      map.invalidateSize();  // Ensure the map takes the full size after rendering
    }, 0);
  }

}
