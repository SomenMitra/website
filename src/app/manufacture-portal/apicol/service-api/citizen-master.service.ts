import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CitizenMasterService {
  
  constructor(private Http: HttpClient) { }
  // get demographical hierarchy
  grapCalHirarchy(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrDmogHirarchy';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // get master constant list
  getMstrConstList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrConstants';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }  
  // get Veterinary officer list
  getVtOfcrList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrVtOfcrList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  grapCalTahasil(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrDmogTahasil';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  } 
  grapCalDemoBhulekh(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrDmogBhulekh';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  grapCalBhulekh(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrBhulekh';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  
}
