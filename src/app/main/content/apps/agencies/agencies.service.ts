import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../shared/app.config';

@Injectable()
export class AgenciesService {

  constructor(private http: HttpClient) { }


  getAgencies() : Observable<any> { 
      return this.http.get(AppConfig.apiUrl + "/agencies"); 
  }

}
