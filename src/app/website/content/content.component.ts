import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WebsiteApiService } from '../website-api.service';
import { environment } from '../../../environments/environment';
import { EventService } from 'src/app/eventService';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {


  error: any;
  siteURL = environment.siteURL;
  pageName: any;
  page_info: page_info = {
    vchContent: '',
    vchPageName: ''
  }
  bodyData: any;
  navigationSubscription:any;
  public loading = false;

  language:any;
  filter: any;

  constructor(
    private router: Router,
    private menulist:WebsiteApiService,
    private route: ActivatedRoute,
    public EventService: EventService<any>,
    public ref: ChangeDetectorRef,
  ) { 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
     
        this.pageName = this.route.snapshot.params['id'];
        this.language=localStorage.getItem('locale')
       
        this.getContents();
    });


  }

  ngOnInit(): void {
    this.language=localStorage.getItem('locale')
    this.getContents();
  }
  getContents() {


    let params = {
          "pgAlias": this.pageName,
          "lang": localStorage.getItem('locale')
    };
    this.loading = true;
    this.menulist.contanPage(params).subscribe(res=>{
      if(res['status']=='200'){
  
        this.page_info = res['result'][0]; 
        this.loading = false;
        
        //console.log(res.result);
  
      }else{
       
        this.loading = false;
      }
      
      
    },
    error => {this.error = error; this.loading = false; }
  );


}
}

interface page_info {
  vchContent?: any,
  vchPageName?: string
}