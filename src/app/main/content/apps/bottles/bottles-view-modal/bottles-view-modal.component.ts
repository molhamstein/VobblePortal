import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Bottle } from '../bottle.model';
import { FormControl } from '@angular/forms';
import { BottlesService } from '../bottles.service';
import { PageAction } from '../../../../shared/enums/page-action';
import { HelpersService } from '../../../../shared/helpers.service';

@Component({
  selector: 'app-bottles-view-modal',
  templateUrl: './bottles-view-modal.component.html',
  styleUrls: ['./bottles-view-modal.component.scss']
})
export class BottlesViewModalComponent implements OnInit {


  bottleType: string;
  item: Bottle;
  video: string = "";
  status: FormControl;

  constructor(public dialogRef: MatDialogRef<BottlesViewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private bottleService: BottlesService,
    private helpersService: HelpersService) {

    this.item = data.bottle;

    this.video = this.item.file;
    this.bottleType = this.item.bottleType;
  }

  ngOnInit() {
    this.status = new FormControl(this.item.status);
    this.status.valueChanges.subscribe(res => {

      if (res == 'active') {
        let data = [];
        data.push(this.item.id);
        this.bottleService.updateViewStatus(data);
      }

      this.item.status = res;

      this.bottleService.editItem(this.item).then(
        val => {

          this.helpersService.showActionSnackbar(PageAction.Update, true, "bottle"
          );
        },
        error => {
          this.helpersService.showActionSnackbar(PageAction.Update, false, "bottle"
            , { style: "failed-snackbar" }
          );
        })
    });
  }

}
