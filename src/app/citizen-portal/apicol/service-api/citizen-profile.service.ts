import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitizenProfileService {
  constructor(private Http: HttpClient) { }
  profileBuild(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'profileBuild';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  logoutOdishaOne(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'logoutOdishaOne';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  profileUpdate(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'profileUpdate';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectFarmerAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectFarmerAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectCityAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectCityAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectSujogRegAPI(params:any):Observable<any>{
    //let serviceUrl = 'https://sujog-dev.odisha.gov.in/user-otp/v1/_send?tenantId=od';
    let serviceUrl = environment.serviceURL+'getRedirectSujogRegAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectSujogRegOTPAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectSujogRegOTPAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectSujogLoginAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectSujogLoginAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectSujogLoginOTPAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectSujogLoginOTPAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectLocationAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectLocationAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getRedirectWardAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectWardAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getSujogFileUpload(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSujogFileUpload';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getAadharOTP(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAadharOTP';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getAadharDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAadharDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getAddressDetls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAddressDetls';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  sendotp(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'sendotp';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  verifyotp(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'verifyotp';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  getSPDPDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSPDPDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getAadharSPDPOTP(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAadharSPDPOTP';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getAadharOTPAPICOL(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getAadharOTP';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  checkAadhaarValidation(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'checkAadhaarValidation';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getAadharDetailsAPICOL(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getAadharDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  profileUpdateAPICOL(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'profileUpdate';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  profileBuildAPICOL(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'profileBuild';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
}
