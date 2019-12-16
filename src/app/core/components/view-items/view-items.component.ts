import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'fuse-view-items',
    templateUrl: './view-items.component.html',
    styleUrls: ['./view-items.component.scss']
})
export class FuseViewItemsComponent implements OnInit {
    public items = [];
    constructor(public dialogRef: MatDialogRef<FuseViewItemsComponent>, @Inject(MAT_DIALOG_DATA) public data,
    ) {
        data.data.forEach(element => {
            if (element != null)
                this.items.push(element);
        });
    }

    ngOnInit() {
    }

}
