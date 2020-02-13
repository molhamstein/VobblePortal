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
import { Shore } from "../shore.model";
import { ShoresService } from "../shores.service";

@Component({
  selector: 'app-shores-view',
  templateUrl: './shores-view.component.html',
  styleUrls: ['./shores-view.component.scss'],
  animations   : fuseAnimations
})
export class ShoresViewComponent implements OnInit, OnDestroy
{
  item: Shore;
  onItemChanged: Subscription;

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private shoresService: ShoresService,
              private progressBarService: ProgressBarService,
              public dialog: MatDialog){}

  ngOnInit(){
    this.onItemChanged =
      this.shoresService.onItemChanged
        .subscribe(item => {
          this.item = new Shore(item);
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
      if ( result )
      {
        this.shoresService.deleteItem(this.item);
      }
      this.confirmDialogRef = null;
    });

  }
}
