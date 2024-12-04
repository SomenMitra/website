import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PmksyService {
  getApplicationTrack(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  constructor(private Http: HttpClient) { }
  // get KO details when edit mode
  getKOAddressDetlseditApp(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'getKOAddressDetlseditApp';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getSubComponentEdit(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'getSubComponentEdit';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getCropEdit(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'getCropEdit';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getPreviousMIdetails(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'getPreviousMIdetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  updateSwitchManufacture(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'updateSwitchManufacture';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getAadhaarWiseAreaDetails(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'getAadhaarWiseAreaDetails';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getExistApplicationDetls(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'getExistApplicationDetls';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
   
}


