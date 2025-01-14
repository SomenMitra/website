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
    let serviceURL = environment.serviceURL + 'manufactureLogin';
    let loginResponse = this.http.post(serviceURL, params);
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
  changePassworManufacture(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'changePassworManufacture';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }

  constructor(private http: HttpClient, private router: Router) { }
}
