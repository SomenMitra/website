import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitizenSchemeService {
  getApplicationTrack(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  constructor(private Http: HttpClient) { }
  // get scheme list
  schemeList(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getAllServiceList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

   // get scheme section list
   schemeMainSctns(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getSchemeMainSection';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  // get scheme controls
  schemeDynCtrls(params:any):Observable<any>{
    // console.log(environment.serviceAPICOLURL);
    let serviceUrl = environment.serviceAPICOLURL+'getDynmCntrls';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  schemeAnnexureDetails(params:any):Observable<any>{
    // console.log(environment.serviceAPICOLURL);
    let serviceUrl = environment.serviceAPICOLURL+'schemeAnnexureDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  // apply for scheme
  schemeApply(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'schemeApply';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }

  // get scheme document list
  getSchmDocList(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getSchmDocList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // for final scheme submit
  schemeFnlSubmit(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'schemeFnlSubmit';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }
  completion(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'completion';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }
  completeAnnexure(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'completeAnnexure';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }
   // get scheme applied list
   getAppldSchmLst(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'appliedSchemeList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
     // get scheme applied list
     getAckknowlegedmentDetails(params:any):Observable<any>{
      let serviceUrl = environment.serviceAPICOLURL+'acknowledgementSlip';
      let serviceRes = this.Http.post(serviceUrl,params);
      return serviceRes;
    }
    // get IFSC Code list
    getIfscCode(params:any):Observable<any>{
      let serviceUrl = environment.serviceAPICOLURL+'getBankDist';
      let ifscRes = this.Http.post(serviceUrl,params);
      return ifscRes;
    }

 // get IFSC Details
    getifscDetails(params:any):Observable<any>{
      let serviceUrl = environment.serviceAPICOLURL+'ifsc_branch';
      let ifscDetailsRes = this.Http.post(serviceUrl,params);
      return ifscDetailsRes;
    }

// get application track status
    getTrackApplication(params:any):Observable<any>{
      let serviceUrl = environment.serviceAPICOLURL+'appliedSchemeList';
      let getApplicationTrackRes = this.Http.post(serviceUrl,params);
      return getApplicationTrackRes;
    }
  // get application Activity status
  getApplicationActivityStatus(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getApplicationActivityStatus';
    let getApplicationActivity = this.Http.post(serviceUrl,params);
    return getApplicationActivity;
  }
  // update application Activity status
  updateSchmActivitySts(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'updateActivity';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // update payment receipt
  updatePaymentReceipt(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'updatePaymentReceipt';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  async getApplicationActivityStatusNew(params:any):Promise<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getApplicationActivityStatus';
    let getApplicationActivity = await this.Http.post(serviceUrl,params).toPromise();
    return getApplicationActivity;
  }

  getDirectorates(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getDirectorates';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getRedirectQueryAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getRedirectQueryAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  schemeFnlSubmitSujog(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'schemeFnlSubmitSujog';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  getSchmPayList(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getSchmPayList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  schemePaySubmit(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'schemePaySubmit';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  getVoucherDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getVoucherDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getTotTarget(params:any):Observable<any>{
    let serviceUrl = environment.serviceAPICOLURL+'getTotTarget';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
}


