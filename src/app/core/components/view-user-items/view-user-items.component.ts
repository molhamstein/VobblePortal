import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'fuse-view-user-items',
    templateUrl: './view-user-items.component.html',
    styleUrls: ['./view-user-items.component.scss']
})
export class FuseViewUserItemsComponent implements OnInit {
    public user;
    public items = [];
    constructor(public dialogRef: MatDialogRef<FuseViewUserItemsComponent>, @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.items = data.data;
        this.user = data.owner;
    }

    ngOnInit() {
    }

}
