import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  url = environment.serviceURL + "documentUpload";
  docurl = environment.serviceURL + "boqDocumentUpload";
  manufactureDocUrl = environment.servicePMKSYURL + "manufactureDocUpload";
  manufacturedDetailsUrl = environment.servicePMKSYURL + "updateManufacturedItem";
  procuredDetailsUrl = environment.servicePMKSYURL + "updateProcuredItem";
  technicalStaffDetailsUrl = environment.servicePMKSYURL + "updateTechnicalStaffItem";
  reportDetailsUrl = environment.servicePMKSYURL + "updateReportItem";
  manufacturePptUpload = environment.servicePMKSYURL + "manufacturePptUpload";
  manufactureReapply = environment.servicePMKSYURL + "manufactureReapply";
  constructor(private http: HttpClient) { }

  uploadWithProgress(formData: FormData): Observable<any> {
    // console.log(55555);
    console.log(formData);
    return this.http.post(this.url, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  uploadDocumentWithProgress(formData: FormData): Observable<any> {
    
    return this.http.post(this.docurl, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  uploadDocumentWithForManufacture(formData: FormData): Observable<any> {
    return this.http.post(this.manufactureDocUrl, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  updateManufacturedItem(formData: FormData): Observable<any> {
    return this.http.post(this.manufacturedDetailsUrl, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  updateProcuredItem(formData: FormData): Observable<any> {
    return this.http.post(this.procuredDetailsUrl, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  updateTechnicalStaffItem(formData: FormData): Observable<any> {
    return this.http.post(this.technicalStaffDetailsUrl, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  updateReportItem(formData: FormData): Observable<any> {
    return this.http.post(this.reportDetailsUrl, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  uploadPresentationOfManufacture(formData: FormData): Observable<any> {
    
    return this.http.post(this.manufacturePptUpload, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  uploadReapplyManufacture(formData: FormData): Observable<any> {
    
    return this.http.post(this.manufactureReapply, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }


  private handleError(error: any) {
    return throwError(error);
  }
}
