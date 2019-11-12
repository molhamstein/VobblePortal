import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'fuse-view-user',
    templateUrl: './view-user.component.html',
    styleUrls: ['./view-user.component.scss']
})
export class FuseViewUserComponent implements OnInit {
    public users = [];
    public isOwner;
    constructor(public dialogRef: MatDialogRef<FuseViewUserComponent>, @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.users = data.data;
        this.isOwner = data.isOwner;
        console.log("this.users")
        console.log(this.users)
    }

    ngOnInit() {
    }

}
