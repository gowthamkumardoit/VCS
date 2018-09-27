import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  loggedIn: boolean;
  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      this.loginService.userid.subscribe((id) => {
        if (id > 0) {
          this.loggedIn = true;
        } else {
          this.router.navigate(['/login']);
          this.loggedIn = false;
        }
      });
      return this.loggedIn;
  }
}



