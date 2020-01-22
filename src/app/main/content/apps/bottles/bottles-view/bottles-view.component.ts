import { Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import {fuseAnimations} from "../../../../../core/animations";
import {Bottle} from "../bottle.model";
import {BottlesService} from "../bottles.service";
import {MatDialogRef, MatDialog} from "@angular/material";
import {FuseConfirmDialogComponent} from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";

@Component({
  selector: 'app-bottles-view',
  templateUrl: './bottles-view.component.html',
  styleUrls: ['./bottles-view.component.scss'],
  animations   : fuseAnimations
})
export class BottlesViewComponent implements OnInit, OnDestroy
{
  item: Bottle;
  onItemChanged: Subscription;

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private bottlesService: BottlesService,
              private progressBarService: ProgressBarService,
              public dialog: MatDialog){}

  ngOnInit(){
    this.onItemChanged =
      this.bottlesService.onItemChanged
        .subscribe(item => {
          this.item = new Bottle(item);
        });
  }

  ngOnDestroy(){
    this.onItemChanged.unsubscribe();
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
