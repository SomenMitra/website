import { Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Observable, of, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CitizenAuthService } from './citizen-portal/service-api/citizen-auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idle$: Observable<any>;
  private userActivity$: Observable<any>;
  private idleTime = 45* 60 * 1000; // 30 minutes in milliseconds

  constructor(private ngZone: NgZone,private authService: CitizenAuthService) {
    this.userActivity$ = merge(
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'mousedown'),
      fromEvent(window, 'keypress'),
      fromEvent(window, 'touchmove'),
      fromEvent(window, 'scroll')
    );

    this.idle$ = this.userActivity$.pipe(
      switchMap(() => {
        return timer(this.idleTime).pipe(
          tap(() => this.ngZone.run(() => this.onIdle()))
        );
      })
    );
  }

  startWatching() {
    this.idle$.subscribe();
  }

  onIdle() {
    let loginSts = this.authService.isLoggedIn();
    if(loginSts){
        if ('caches' in window) {
            caches.keys().then(function(names) {
                for (let name of names) {
                    caches.delete(name);
                }
            });
        }
       // window.location.href = environment.siteURL+ '?cacheClear=' + new Date().getTime();        
        this.authService.logout();
       // console.log("first ckck");
    }
    // Add your logic here (e.g., log out the user, show a modal, etc.)
  }
}
