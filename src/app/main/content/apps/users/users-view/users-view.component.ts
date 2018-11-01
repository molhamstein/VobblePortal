import { Component, OnDestroy, OnInit } from "@angular/core";
import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/fromEvent";
import { Subscription } from "rxjs/Subscription";
import { fuseAnimations } from "../../../../../core/animations";
import { User } from "../user.model";
import { UsersService } from "../users.service";
import { FuseConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef, MatDialog } from "@angular/material";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";

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
