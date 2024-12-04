import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebsiteApiService {

  constructor(
    private Http: HttpClient
    
  ) { }

  headerMenu(params:any):Observable<any>{
    let serviceUrl = environment.websiteserviceURL+'menu/index';
    let menuRes = this.Http.post(serviceUrl,params);
    return menuRes;
  }
  
  contanPage(params:any):Observable<any>{
    let serviceUrl = environment.websiteserviceURL+'pages/index';
    let pagesRes = this.Http.post(serviceUrl,params);
    return pagesRes;
  }

  announcements(params:any):Observable<any>{
    let serviceUrl = environment.websiteserviceURL+'news/index';
    let newsRes = this.Http.post(serviceUrl,params);
    return newsRes;
  }

  newsDetails(params:any):Observable<any>{
    let serviceUrl = environment.websiteserviceURL+'news/getDetails';
    let newsDetailsRes = this.Http.post(serviceUrl,params);
    return newsDetailsRes;
  }

  notifications(params:any):Observable<any>{
    let serviceUrl = environment.websiteserviceURL+'news/index';
    let notificationsRes = this.Http.post(serviceUrl,params);
    return notificationsRes;
  }

  submitFeedback(params:any):Observable<any>{
    let serviceUrl = environment.websiteserviceURL+'feedbacks/add';
    let feedbackRes = this.Http.post(serviceUrl,params);
    return feedbackRes;
  }


  aboutDetails(params:any):Observable<any>{
    let serviceUrl = environment.websiteserviceURL+'pages/index';
    let aboutRes = this.Http.post(serviceUrl,params);
    return aboutRes;
  }

  getIfscCode(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getBankDist';
    let ifscRes = this.Http.post(serviceUrl,params);
    return ifscRes;
  }


  getifscDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getIfscDetails';
    let ifscDetailsRes = this.Http.post(serviceUrl,params);
    return ifscDetailsRes;
  }
  
  getSearchDetails(params:any):Observable<any>{
    let serviceUrl = environment.websiteserviceURL+'masterdata/searchContent';
    let getSearchDetailsres = this.Http.post(serviceUrl,params);
    return getSearchDetailsres;
  }

  
  getApplicationTrack(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'appliedSchemeList';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }


  getDirectorates(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDirectorates';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }

  getTahasil(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getTahasil';
    let tahasilRes = this.Http.post(serviceUrl,params);
    return tahasilRes;
  }

  getRevenueCircle(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRevenueCircle';
    let tahasilRes = this.Http.post(serviceUrl,params);
    return tahasilRes;
  }
  getProjectType(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getProjectType';
    let projecttypeRes = this.Http.post(serviceUrl,params);
    return projecttypeRes;
  }


  getClusterZone(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getClusterZone';
    let tahasilRes = this.Http.post(serviceUrl,params);
    return tahasilRes;
  }

  getClusterSubZone(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getClusterSubZone';
    let tahasilRes = this.Http.post(serviceUrl,params);
    return tahasilRes;
  }

  getRevenueVillage(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRevenueVillage';
    let tahasilRes = this.Http.post(serviceUrl,params);
    return tahasilRes;
  } 
  searchBhulekhLand(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'searchBhulekhLand';
    let tahasilRes = this.Http.post(serviceUrl,params);
    return tahasilRes;
  }
  searchSubsidyCalculation(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'searchSubsidyCalculation';
    let tahasilRes = this.Http.post(serviceUrl,params);
    return tahasilRes;
  }
  searchClusterLand(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'searchClusterLand';
    let tahasilRes = this.Http.post(serviceUrl,params);
    return tahasilRes;
  }

  getVoucherDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getVoucherDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  sbiRefundSubmit(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'onlinePaySbiRefundResponse';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // feedbacks/add



  cancelBooking(params: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'bookingCancelled';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }

  sendotp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'sendotp';
    let regRes = this.Http.post(serviceURL, params);
    return regRes;
  }
  verifyotp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'verifyotp';
    let regRes = this.Http.post(serviceURL, params);
    return regRes;
  }
  getFupTokenData(params):Observable<any>{
    let serviceUrl = environment.serviceURL+'getFupTokenDetails';
    let fupTokenDtl = this.Http.post(serviceUrl,params);
    return fupTokenDtl;
  }
  setTokenExpire(params):Observable<any>{
    let serviceUrl = environment.serviceURL+'setTokenExpire';
    let expireTokenDtls = this.Http.post(serviceUrl,params);
    return expireTokenDtls;
  }
}
