import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitizenSchemeActivityService {

  constructor(private Http: HttpClient) { }

  // get scheme query details by application id
  getSchmQueryDtls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchmQueryDtls';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }  
  // submit query reply by farmer
  doQryReply(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'doQryReply';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  
  // get scheme query reply list by application id
  getSchmQryRlyList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchmQueryList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }  

  // get scheme resubmission history details by application id
  schemeRsmHist(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchmRsmHistList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }  

}
