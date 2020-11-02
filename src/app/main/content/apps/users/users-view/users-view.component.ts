import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/startWith";
import { Subscription } from "rxjs/Subscription";
import { fuseAnimations } from "../../../../../core/animations";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { User } from "../user.model";
import { UsersService } from "../users.service";

@Component({
  selector: "app-users-view",
  templateUrl: "./users-view.component.html",
  styleUrls: ["./users-view.component.scss"],
  animations: fuseAnimations
})
export class UsersViewComponent implements OnInit, OnDestroy {
  item: User;
  onItemChanged: Subscription;
  bottles: any[];
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private usersService: UsersService,
    private progressBarService: ProgressBarService,
    public dialog: MatDialog
  ) {
    this.bottles = this.usersService.bottles;
  }

  ngOnInit() {
    this.onItemChanged = this.usersService.onItemChanged.subscribe(item => {
      this.item = new User(item);
    });
  }

  ngOnDestroy() {
    this.onItemChanged.unsubscribe();
  }

  deleteItem() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to delete?";
    this.progressBarService.toggle();
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUser(this.item);
      }
      this.confirmDialogRef = null;
    });
  }
}
