import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanLoad {

  constructor(private router: Router, private authService: AuthService) { }

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    if(this.authService.isAuthenticated()){
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

}
