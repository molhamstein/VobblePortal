import { Component, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import {fuseAnimations} from "../../../../../core/animations";
import {FuseConfirmDialogComponent} from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import {MatDialogRef, MatDialog} from "@angular/material";
import {ProgressBarService} from "../../../../../core/services/progress-bar.service";
import {Product} from "../product.model";
import {ProductsService} from "../products.service";

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss'],
  animations   : fuseAnimations
})
export class ProductsViewComponent implements OnInit {

  item: Product;
  onItemChanged: Subscription;

  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(private productsService: ProductsService,
              private progressBarService: ProgressBarService,
              public dialog: MatDialog){}

  ngOnInit(){
    this.onItemChanged =
      this.productsService.onItemChanged
        .subscribe(item => {
          this.item = new Product(item);
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
        this.productsService.deleteItem(this.item);
      }
      this.confirmDialogRef = null;
    });

  }


}
