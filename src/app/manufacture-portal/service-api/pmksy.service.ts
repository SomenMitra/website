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
  // submit Manufacture extension
  submitManufactureExtension(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'submitManufactureExtension';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  submitManufactureNoExtension(params:any):Observable<any>{
    let serviceUrl = environment.servicePMKSYURL+'submitManufactureNoExtension';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
}


