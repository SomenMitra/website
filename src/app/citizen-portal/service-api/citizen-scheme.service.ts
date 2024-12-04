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
    let serviceUrl = environment.serviceURL+'getAllServiceList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

   // get scheme section list
   schemeMainSctns(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchemeMainSection';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  // get scheme controls
  schemeDynCtrls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDynmCntrls';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  // apply for scheme
  schemeApply(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'schemeApply';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }
  //given completion
  completion(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'completion';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }

  // get scheme document list
  getSchmDocList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchmDocList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // for final scheme submit
  schemeFnlSubmit(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'schemeFnlSubmit';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }

   // get scheme applied list
   getAppldSchmLst(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'appliedSchemeList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
     // get scheme applied list
     getAckknowlegedmentDetails(params:any):Observable<any>{
      let serviceUrl = environment.serviceURL+'acknowledgementSlip';
      let serviceRes = this.Http.post(serviceUrl,params);
      return serviceRes;
    }
    // get IFSC Code list
    getIfscCode(params:any):Observable<any>{
      let serviceUrl = environment.serviceURL+'getBankDist';
      let ifscRes = this.Http.post(serviceUrl,params);
      return ifscRes;
    }

 // get IFSC Details
    getifscDetails(params:any):Observable<any>{
      let serviceUrl = environment.serviceURL+'ifsc_branch';
      let ifscDetailsRes = this.Http.post(serviceUrl,params);
      return ifscDetailsRes;
    }

// get application track status
    getTrackApplication(params:any):Observable<any>{
      let serviceUrl = environment.serviceURL+'appliedSchemeList';
      let getApplicationTrackRes = this.Http.post(serviceUrl,params);
      return getApplicationTrackRes;
    }
  // get application Activity status
  getApplicationActivityStatus(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getApplicationActivityStatus';
    let getApplicationActivity = this.Http.post(serviceUrl,params);
    return getApplicationActivity;
  }
  // update application Activity status
  updateSchmActivitySts(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'updateActivity';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // update payment receipt
  updatePaymentReceipt(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'updatePaymentReceipt';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  async getApplicationActivityStatusNew(params:any):Promise<any>{
    let serviceUrl = environment.serviceURL+'getApplicationActivityStatus';
    let getApplicationActivity = await this.Http.post(serviceUrl,params).toPromise();
    return getApplicationActivity;
  }

  getDirectorates(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDirectorates';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getRedirectQueryAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectQueryAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  schemeFnlSubmitSujog(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'schemeFnlSubmitSujog';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  getSchmPayList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchmPayList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  schemePaySubmit(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'schemePaySubmit';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  getVoucherDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getVoucherDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getTotTarget(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getTotTarget';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getGovtPrice(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getGovtPrice';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getLandAreaValidate(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getLandAreaValidate';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getMI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getSprinklerSpace(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSprinklerSpace';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
}


