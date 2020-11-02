import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfig } from "../../../shared/app.config";
import { AppException } from "../../../shared/app.exception";
import { User } from "../../apps/users/user.model";
import { FuseSplashScreenService } from "../../../../core/services/splash-screen.service";

@Injectable()
export class AuthService {
  me: User;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loadingScreen: FuseSplashScreenService
  ) {
    const meStr = localStorage.getItem("me");
    if (meStr != null) this.me = JSON.parse(meStr);
  }

  register(registrationForm): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders().set("Content-Type", "application/json");
      this.http
        .post(
          AppConfig.apiUrl + "users",
          {
            username: registrationForm.username,
            email: registrationForm.email,
            password: registrationForm.password,
            gender: registrationForm.gender
          },
          {
            headers: headers
          }
        )
        .subscribe(
          data => {
            //  
            resolve(true);
          },
          err => {
            
            reject(new AppException("Failed registration"));
          }
        );
    });
  }

  checkUsername(username): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders().set("Content-Type", "application/json");
      this.http
        .post(
          AppConfig.apiUrl + "users/checkUsername",
          {
            newUsername: username
          },
          {
            headers: headers
          }
        )
        .subscribe(
          data => {
            // 
            resolve(true);
          },
          err => {
            // 
            reject(new AppException("Failed"));
          }
        );
    });
  }

  getUser(data): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<User>(
          AppConfig.apiUrl + "users/" + data.userId + "?access_token=" + data.id
        )
        .subscribe(
          me => {
            this.me = me;
            this.me.token = data.id;
            localStorage.setItem("me", JSON.stringify(this.me));
            resolve(me);
            this.loadingScreen.hide();
          },
          error => {
            
            reject(new AppException("unknown error"));
            this.loadingScreen.hide();
          }
        );
    });
  }

  loginUser(loginForm): Promise<User> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders().set("Content-Type", "application/json");
      this.http
        .post<User>(
          AppConfig.apiUrl + "users/login",
          {
            email: loginForm.email,
            password: loginForm.password
          },
          {
            headers: headers
          }
        )
        .subscribe(
          data => {
            resolve(data);
          },
          error => {
            reject(new AppException("email or password is wrong"));
          }
        );
    });
  }

  login(loginForm): Promise<User> {
    return new Promise((resolve, reject) => {
      this.loginUser(loginForm).then(
        data => {
          if (data) this.getUser(data).then(data => resolve(data));
          else reject(false);
        },
        error => {
          reject(false);
        }
      );
    });
  }

  logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.me = null;
      localStorage.clear();
      resolve(true);
    });
  }
  /*
  reset_password(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
      this.http.post(AppConfig.apiUrl + '/users/reset',{email : email}, {
        headers: headers
      })
        .subscribe(
          data => {
            
          })
    })
  }*/

  forgot_password(email: string): Promise<any> {
    // 
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders().set("Content-Type", "application/json");
      this.http
        .post(
          AppConfig.apiUrl + "users/reset",
          { email: email },
          {
            headers: headers
          }
        )
        .subscribe(
          data => {
            //
            resolve(data);
          },
          error => {
            
            reject(false);
          }
        );
    });
  }

  getToken() {
    if (this.me != null) return this.me.token;
    return "";
  }

  getCurrentUser() {
    //
    if (this.me != null) return this.me;
    return "";
  }

  isAuthenticated() {
    return this.me != null;
  }
}

interface LoginResponse {
  id: string;
  ttl: number;
  created: string;
  userId: string;
}
