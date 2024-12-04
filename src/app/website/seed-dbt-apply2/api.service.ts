import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
// get scheme controls
constructor(private Http: HttpClient) { }
getCropVarietyList(params:any):Observable<any>{
  let serviceUrl = environment.domainUrl+'integration/getCropVarietyList'//environment.serviceURL+'getCropVarietyList';
  let serviceRes = this.Http.post(serviceUrl,params);
  return serviceRes;
}
getCropList(params:any):Observable<any>{
  let serviceUrl = environment.domainUrl+'integration/getCropList'//environment.serviceURL+'getCropVarietyList';
  let serviceRes = this.Http.post(serviceUrl,params);
  return serviceRes;
}
getVarietyList(params:any):Observable<any>{
  let serviceUrl = environment.domainUrl+'integration/getVarietyList'//environment.serviceURL+'getCropVarietyList';
  let serviceRes = this.Http.post(serviceUrl,params);
  return serviceRes;
}
getAllSeed(params:any):Observable<any>{
  let serviceUrl = environment.domainUrl+'integration/getAllSeed'//environment.serviceURL+'getCropVarietyList';
  let serviceRes = this.Http.post(serviceUrl,params);
  return serviceRes;
}
getSeedAvailablity(params:any):Observable<any>{
  let serviceUrl = environment.domainUrl+'integration/getSeedAvailablity'//environment.serviceURL+'getCropVarietyList';
  let serviceRes = this.Http.post(serviceUrl,params);
  return serviceRes;
}
getVarietyPriceList(params:any):Observable<any>{
  let serviceUrl = environment.domainUrl+'integration/getVarietyPriceList'//environment.serviceURL+'getCropVarietyList';
  let serviceRes = this.Http.post(serviceUrl,params);
  return serviceRes;
}

 // apply for scheme
 schemeDBTApply(schemeParam:any):Observable<any>{
 
  let serviceUrl = environment.serviceURL+'schemeSeedDBTServiceApply';//environment.serviceURL+'schemeSeedDBTServiceApply';
   let serviceRes = this.Http.post(serviceUrl,schemeParam);
  return serviceRes;
}

getSeedSchemePaymentDetails(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSeedSchemePaymentDetails';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
}
getSeedDBTReapplyStatus(schemeParam:any):Observable<any>{
  let serviceUrl = environment.serviceURL+'getSeedDBTReapplyStatus';
  let serviceRes = this.Http.post(serviceUrl,schemeParam);
  return serviceRes;
  }

  getVoucherDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getVoucherDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  getSeedPreviewApplication(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSeedPreviewApplication';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }


}
