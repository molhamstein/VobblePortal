import {MatSnackBar} from '@angular/material';
import {Injectable} from '@angular/core';
import {PageAction} from './enums/page-action';

@Injectable()
export class HelpersService {

  constructor(private snackBar: MatSnackBar) {}

  showActionSnackbar(pageAction: PageAction,
                     pageActionResult: boolean,
                     resourceType: string,
                     config: any = {style : 'success-snackbar'},
                     customMgs?: string) {
    let message: string = '';
    if(customMgs){
      message = customMgs;
    }else{
      switch (pageAction) {
        case PageAction.Create:
          if (pageActionResult)
            message = 'New ' + resourceType + ' has been created successfully';
          else
            message = 'An error happened while creating the new ' + resourceType;
          break;
        case PageAction.Delete:
          if (pageActionResult)
            message = 'Selected ' + resourceType + ' has been deleted successfully';
          else
            message = 'An error happened while deleting the selected ' + resourceType;
          break;
        case PageAction.Update:
          if (pageActionResult)
            message = 'Selected ' + resourceType + ' has been updated successfully';
          else
            message = 'An error happened while updating the selected ' + resourceType;
          break;
        default :
          //if (!pageActionResult)
            //message = 'A technical exception happened, please try again later or call the technical support';
      }

    }

    this.snackBar.open(message, '', {
      duration: 5000,
      extraClasses: [config.style]
    });
  }
}
