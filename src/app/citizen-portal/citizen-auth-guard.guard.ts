import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CitizenAuthService } from './service-api/citizen-auth.service';

@Injectable({
  providedIn: 'root'
})
export class CitizenAuthGuardGuard implements CanActivate {
  constructor(private authService: CitizenAuthService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn();
  }

}
