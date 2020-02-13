import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from "../../../../../core/animations";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { PageAction } from '../../../../shared/enums/page-action';
import { HelpersService } from '../../../../shared/helpers.service';
import { Bottle } from "../bottle.model";
import { BottlesService } from "../bottles.service";

@Component({
  selector: 'app-bottles-view',
  templateUrl: './bottles-view.component.html',
  styleUrls: ['./bottles-view.component.scss'],
  animations: fuseAnimations
})
export class BottlesViewComponent implements OnInit, OnDestroy {
  item: Bottle;
  onItemChanged: Subscription;

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private bottlesService: BottlesService, private progressBarService: ProgressBarService,
    public dialog: MatDialog, private helpersService: HelpersService) { }

  ngOnInit() {
    this.onItemChanged =
      this.bottlesService.onItemChanged
        .subscribe(item => {
          this.item = new Bottle(item);
        });
  }

  ngOnDestroy() {
    this.onItemChanged.unsubscribe();
  }

  activeViewStatus() {
    let data = [];
    data.push(this.item.id);
    this.bottlesService.updateViewStatus(data).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Update, true, "bottle"
        );
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Update, false, "bottle",
          { style: "failed-snackbar" }
        );
      }
    );
  }

  deleteItem() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';
    this.progressBarService.toggle();
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result)
        this.bottlesService.deleteItem(this.item, true);
      else
        this.bottlesService.deleteItem(this.item, false);
      this.confirmDialogRef = null;
    });

  }
}
