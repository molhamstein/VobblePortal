import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { Subscription } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { AgenciesService } from '../agencies.service';
import { Agency } from '../agency.model';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.model';
import { AppConfig } from '../../../../shared/app.config';

@Component({
  selector: 'app-view-agency',
  templateUrl: './view-agency.component.html',
  styleUrls: ['./view-agency.component.scss'],
  animations: fuseAnimations
})
export class ViewAgencyComponent implements OnInit {

  item: Agency;
  users: User[] = [];
  onItemChanged: Subscription;
  onUsersChanged: Subscription;

  defaultAvatar: string;

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private agencyService: AgenciesService,
    private userService: UsersService,
    public dialog: MatDialog) {


  }

  ngOnInit() {

    this.defaultAvatar = AppConfig.defaultAvatar;

    this.onItemChanged = this.agencyService.onItemChanged.subscribe(item => {
      this.item = new Agency(item);
    });

    let filter = { agency: this.item.id };

    this.userService.getItemsPaging(0, 100, filter, "").then(
      this.onUserChange.bind(this)
    );
  }

  onUserChange() {
    this.onUsersChanged = this.userService.onUsersChanged.subscribe(users => {
      for (let user of users) {
        this.users.push(new User(user));
      }
    });
  }


  deleteItem() {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.agencyService.deleteItem(this.item);
      }
      this.confirmDialogRef = null;
    });
  }

  isNewUser(date) {
    var diff = Math.abs(new Date().getTime() - new Date(date).getTime()) / 3600000;

    if (diff > 24 * 7)
      return "notActiveUser"
    else if (diff > 24)
      return "fewActiveUser"
    else if (diff > 6)
      return "meniActiveUser"
    else
      return "activeUser"
  }

  ngOnDestroy() {
    this.onItemChanged.unsubscribe();
  }

}
