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
  constructor(private http: HttpClient) { }

  uploadWithProgress(formData: FormData): Observable<any> {
    return this.http.post(this.url, formData, { observe: 'events', reportProgress: true })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
  private handleError(error: any) {
    return throwError(error);
  }
}
