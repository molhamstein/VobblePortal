import { Injectable } from '@angular/core';
//import {Subject} from "rxjs";

@Injectable()
export class ProgressBarService {

  progressBar: boolean = false;

  //progressBarVisibilityChange : Subject<boolean> = new Subject<boolean>();

  constructor()  {
    /*this.progressBarVisibilityChange.subscribe((value) => {
      this.progressBar = value
    });*/
  }

  public toggle() {
    this.progressBar = !this.progressBar;
    //this.progressBarVisibilityChange.next(!this.progressBar);
  }

}
