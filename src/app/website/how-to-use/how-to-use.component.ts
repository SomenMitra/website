import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.css']
})
export class HowToUseComponent implements OnInit {
  siteURL = environment.siteURL;
  how_to_use_yt_link = environment.how_to_use_yt_link;
  languageNew:any = 'English';
  constructor() { }

  ngOnInit(): void {
    this.languageNew = localStorage.getItem('locale');
    console.log(this.how_to_use_yt_link);
  }

}
