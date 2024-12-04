import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManufactureSchemeService {
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
      let serviceUrl = environment.serviceAPICOLURL+'appliedSchemeList';
      let getApplicationTrackRes = this.Http.post(serviceUrl,params);
      return getApplicationTrackRes;
    }
  // get application Activity status
  getManufactureApplicationActivityStatus(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getManufactureApplicationActivityStatus';
    let getApplicationActivity = this.Http.post(serviceUrl,params);
    return getApplicationActivity;
  }
  // update application Activity status for not prepost
  updateMSchmActivitySts(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'updateMActivity';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // update payment receipt
  updatePaymentReceipt(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'updatePaymentReceipt';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  async getManufactureApplicationActivityStatusNew(params:any):Promise<any>{
    let serviceUrl = environment.serviceURL+'getManufactureApplicationActivityStatus';
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

  getItemGroup(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getItemGroup';
    let getItemGroup = this.Http.post(serviceUrl,params);
    return getItemGroup;
  }

  getItem(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getItemList';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  saveItemPrice(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'saveItemPrice';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getTrackManufactureApplication(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'appliedManufactureSchemeList';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getTrackMApplication(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'appliedManufactureSchemeList';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getAppldManufactureSchmLst(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'appliedManufactureSchemeList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  schemeDynCtrls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getManufactureDynmCntrls';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getManufactureItem(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getManufactureItem';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getDepartmentItem(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDepartmentItem';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  updateBoq(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'updateBoq';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }

  getComponent(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getComponent';
    let getItemGroup = this.Http.post(serviceUrl,params);
    return getItemGroup;
  }
  getPMKSYScheme(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getPMKSYScheme';
    let getItemGroup = this.Http.post(serviceUrl,params);
    return getItemGroup;
  }

  getSubcomponent(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSubcomponent';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getSpace(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSpace';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getDepartmentPriceOne(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDepartmentPriceOne';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getPriceDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getPriceDetails';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  saveManufactureItemPrice(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'saveManufactureItemPrice';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  saveManufactureMasterPrice(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'saveManufactureMasterPrice';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }

  getBOQdetail(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getBOQdetail';
    let getItemGroup = this.Http.post(serviceUrl,params);
    return getItemGroup;
  }
  getItemList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getItemList';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getDistList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDistList';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getMIBlockdtls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMIBlockdtls';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getAllDist(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllDist';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getMIBlocks(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMIBlocks';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  //get Grievance Schemelist
  getSchemeList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchemeList';
    let getItemGroup = this.Http.post(serviceUrl,params);
    return getItemGroup;
  }
  // get scheme section list
  grievance(params:any):Observable<any>{
    let serviceUrl = environment.helpedeskserviceUrl+'lodgeGrievance';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  //getPreview
  getpreView(params:any):Observable<any>{
    let serviceUrl = environment.helpedeskserviceUrl+'getpreView';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  //get Grievance TrackStatus
  grievancetrackstatus(params:any):Observable<any>{
    let serviceUrl = environment.helpedeskserviceUrl+'grievancetrackstatus';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  //get GrievanveDashboardData
  getDashboardData(params:any):Observable<any>{
    let serviceUrl = environment.helpedeskserviceUrl+'getDashboardData';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  //Submit Feedback by Rohan Agarwal 17-Jun-2024
  submitFeedback(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL +'submitFeedback';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  //Get Feedback Questionby Rohan Agarwal 17-Jun-2024
  getFeedbackQuestion(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL +'getFeedbackQuestion';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // update application Activity status
  updateManufactureSchmActivitySts(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'updateManufactureActivity';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }

  // update application Activity status
  verifyReferenceNumber(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'verifyReferenceNumber';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }

  // get Manufacture Status for registration
  getManufactureStatus(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getManufactureStatus';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }

  // get Manufacture Detials
  getManufactureDetails(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getManufactureDetails';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  // get Manufactured Item Detials
  getManufacturedItem(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getManufacturedItem';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  // get Procured Manufactured Item Detials
  getProcuredItem(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getProcuredItem';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  // get Technical Staff Detials
  getTechnicalStaffDetails(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getTechnicalStaffDetails';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  // get Technical Staff Detials
  getPerformanceDetails(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getPerformanceDetails';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  //get component list for BIS no.
  getComponentItem(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getComponentItem';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  //get procured component list for BIS no.
  getProcureItem(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getProcureItem';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  //get all state name list for technical staff page
  getState(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getState';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  //get component list for BIS no.
  updateManufacturedItem(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'updateManufacturedItem';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  //Check Duplicate Data entry
  checkDuplicateValue(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'checkDuplicateValue';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  //Get Manufacture Re-apply Details
  getReapplyDetails(params: any): Observable<any> {
    let serviceUrl = environment.servicePMKSYURL + 'getReapplyDetails';
    let serviceRes = this.Http.post(serviceUrl, params);
    return serviceRes;
  }
  //for pre post separate function
  getTrackMApplicationNotPrePost(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'appliedManufactureSchemeListNotPrePost';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  //End for pre post separate function
}

