import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApicolService {
  getApplicationTrack(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  constructor(private Http: HttpClient) { }
  // get scheme list
   cancelRequestApplication(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'cancelRequestApplication';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  
   // get scheme applied list
   getAppldSchmLst(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'appliedSchemeList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  doCancelApplication(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'doCancelApplication';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
   
}


