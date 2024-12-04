import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class CitizenAuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'text/html',
      'Authorization': environment.my_bearer_auth,
    })
  };
  isAuthenticate = false;
  siteURL = environment.siteURL;


  login(params): Observable<any> {
    console.log(params);
    let serviceURL = environment.serviceURL + 'userLogin';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }

  //MI LOGIN
  miLogin(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'manufactureLogin';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }
  commonLogin(params): Observable<any> {
    console.log(params);
    let serviceURL = environment.serviceURL + 'commonUserLogin';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }

  getAddressDetls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAddressDetls';
    let loginResponse = this.http.post(serviceUrl,params);
    return loginResponse;
  }
 
 
  logoutOdishaOne(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'logoutOdishaOne';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }

  aadharVerify(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'generateAadhaarOtpVerify';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }
  reVerifyAadhaarOtp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'reVerifyAadhaarOtp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }
  verifyAadhaarOtp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'verifyAadhaarOtp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }
  sendotp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'sendotp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }
  verifyotp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'verifyotp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  register(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'userRegistration';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  public isLoggedIn() {
    return sessionStorage.getItem('FFS_SESSION') !== null;
  }

  public logout() {
    sessionStorage.removeItem('FFS_SESSION');
    sessionStorage.removeItem('USER_SESSION_KO_DATA');
    sessionStorage.removeItem('FFS_SESSION_SCHEME');
    localStorage.clear();
    this.router.navigateByUrl('/citizen-portal/login');
  }

  public getCaptcha() {
    let serviceURL = environment.serviceURL + 'getCaptcha';
    let loginResponse = this.http.post(serviceURL, null);
    return loginResponse;
  }

  mobilelogin(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'farmerMobileLogin';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }
  changePasswordUpdate(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'changePasswordUpdate';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }

  sendKOotp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'sendKOotp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  getAadharLoginAddressDetls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAadharLoginAddressDetls';
    let loginResponse = this.http.post(serviceUrl,params);
    return loginResponse;
  }
  manufactureRegister(params): Observable<any> {
    let serviceURL = environment.servicePMKSYURL + 'manufactureRegister';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  // get Manufacture Status for redirect
  checkDocUpload(params: any): Observable<any> {
    let serviceURL = environment.servicePMKSYURL + 'checkDocUpload';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  checkMobileExist(params: any): Observable<any> {
    let serviceURL = environment.servicePMKSYURL + 'checkMobileExist';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }
  checkEmailIdExist(params: any): Observable<any> {
    let serviceURL = environment.servicePMKSYURL + 'checkEmailIdExist';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  checkRegMobileExist(params: any): Observable<any> {
    let serviceURL = environment.serviceURL + 'checkRegMobileExist';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  sendEmailOtp(params): Observable<any> {
    let serviceURL = environment.servicePMKSYURL + 'sendEmailOtp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }
  constructor(private http: HttpClient, private router: Router) { }
}
