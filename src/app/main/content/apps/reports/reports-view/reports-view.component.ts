import { Component, OnInit } from "@angular/core";
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
import { BottlesService } from "../../bottles/bottles.service";
import { UsersService } from "../../users/users.service";
import { Report } from "../report.model";
import { ReportsService } from "../reports.service";

@Component({
  selector: "app-reports-view",
  templateUrl: "./reports-view.component.html",
  styleUrls: ["./reports-view.component.scss"],
  animations: fuseAnimations
})
export class ReportsViewComponent implements OnInit {
  item: Report;
  onItemChanged: Subscription;

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private reportsService: ReportsService,
    private progressBarService: ProgressBarService,
    private usersService: UsersService,
    private bottlesService: BottlesService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.onItemChanged = this.reportsService.onItemChanged.subscribe(item => {
      this.item = new Report(item);
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
        this.reportsService.deleteItem(this.item);
      }
      this.confirmDialogRef = null;
    });
  }

  deactivateOwner() {
    this.item.owner.status = "deactivated";
    this.usersService.editItem(this.item.owner);
  }

  deactivateBottle() {
    this.item.bottle.status = "deactive";
    this.usersService.editItem(this.item.owner);
    this.bottlesService.editItem(this.item.bottle);
  }
}
