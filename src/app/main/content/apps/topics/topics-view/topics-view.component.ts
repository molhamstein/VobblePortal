import { Component, OnInit } from '@angular/core';
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
import { Topic } from "../topic.model";
import { TopicsService } from "../topics.service";

@Component({
  selector: 'app-topics-view',
  templateUrl: './topics-view.component.html',
  styleUrls: ['./topics-view.component.scss'],
  animations   : fuseAnimations
})
export class TopicsViewComponent implements OnInit {

  item: Topic;
  onItemChanged: Subscription;

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private topicsService: TopicsService,
              private progressBarService: ProgressBarService,
              public dialog: MatDialog){}

  ngOnInit(){
    this.onItemChanged =
      this.topicsService.onItemChanged
        .subscribe(item => {
          this.item = new Topic(item);
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
        this.topicsService.deleteItem(this.item);
      }
      this.confirmDialogRef = null;
    });

  }


}
