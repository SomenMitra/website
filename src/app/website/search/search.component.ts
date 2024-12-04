import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { WebsiteApiService } from '../website-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  navigationSubscription:any;
  searchText: any;
  SearchInfo: any[] = [];
  error: any;
  bodyData: any;
  public loading = false;

  isSearchFlag=false;
  siteURL = environment.siteURL;


  constructor(private router: Router,
    private webapi: WebsiteApiService,
    private route: ActivatedRoute) { 

      this.route.queryParams
      .subscribe(params => {
        this.searchText = params.query;
      });
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        this.route.queryParams
        .subscribe(params => {
          this.searchText = params.query;
        });
        // console.log('this text : ', this.searchText);
        if (e instanceof NavigationEnd) {
          this.callSearchInfo();
        }
      });

    }
    private callSearchInfo() {
      let params = {
        "searchText": this.searchText 
      };
      this.loading = true;
      this.webapi.getSearchDetails(params).subscribe(res=>{
        if(res['status']=='200' &&  res.result.length > 0){
          this.SearchInfo = res.result;
           this.loading = false;
           this.isSearchFlag = true
        }else{
          this.isSearchFlag = false;
          this.loading = false;
        }
      });
    }
  ngOnInit(): void {
  }

}
