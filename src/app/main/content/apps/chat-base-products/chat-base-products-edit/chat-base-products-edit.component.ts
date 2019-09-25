import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { FuseUtils } from './../../../../../core/fuseUtils';
import { ChatBaseProduct } from './../chat-base-product.model';
import { Subscription, Observable } from "rxjs";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { fuseAnimations } from "../../../../../core/animations";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HelpersService } from "../../../../shared/helpers.service";
import { PageAction } from "../../../../shared/enums/page-action";
import { ProgressBarService } from "../../../../../core/services/progress-bar.service";
import { AppConfig } from "../../../../shared/app.config";
import { UploadFileService } from "../../../../shared/upload-file.service";
import { TypeGoodsService } from "../../type-goods/type-goods.service";
import { ChatBasrProductsService } from '../chat-base-products.service';
import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: "app-chat-base-products-edit",
  templateUrl: "./chat-base-products-edit.component.html",
  styleUrls: ["./chat-base-products-edit.component.scss"],
  animations: fuseAnimations
})
export class ChatBaseProductsEditComponent implements OnInit {
  item: ChatBaseProduct;
  onItemChanged: Subscription;

  form: FormGroup;
  formErrors: any;
  type_goods: any[];
  defaultIcon: string;
  icon: string = "";

  @ViewChild("file") fileSelector: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private helpersService: HelpersService,
    private progressBarService: ProgressBarService,
    private typeGoodsService: TypeGoodsService,
    private productsService: ChatBasrProductsService,
    private uploadFileService: UploadFileService
  ) {
    this.defaultIcon = AppConfig.defaultShoreIcon;

    this.formErrors = {
      name_ar: { required: true },
      name_en: { required: true },
      price: { required: true },

      description_ar: { required: true },
      description_en: { required: true }
    };
  }

  ngOnInit() {
    this.onItemChanged = this.productsService.onItemChanged.subscribe(item => {
      this.item = new ChatBaseProduct(item);
    });
    this.getChatProduct()
    this.defaultProductIcon = AppConfig.defaultProductIcon;
    this.itemsCount = this.productsService.itemsCount;


    this.icon = this.item.icon;

    this.form = this.formBuilder.group({
      id: [this.item.id],
      name_ar: [this.item.name_ar, Validators.required],
      name_en: [this.item.name_en, Validators.required],
      status: [this.item.status, Validators.required],
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  ngOnDestroy() {
    this.onItemChanged.unsubscribe();
  }

  onFormValuesChanged() {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }
      this.formErrors[field] = {};
      const control = this.form.get(field);
      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }



  readFile(inputValue: any): void {
    this.form.value.icon = inputValue.files[0];
    let reader: FileReader = new FileReader();

    reader.onloadend = e => {
      this.icon = reader.result;
    };
    reader.readAsDataURL(this.form.value.icon);
  }

  browseFiles() {
    this.fileSelector.nativeElement.click();
    return false;
  }

  removeFile() {
    this.icon = "";
    this.form.value.icon = "";
  }

  onFileChange(event) {
    //console.log(event);
    this.readFile(event.target);
  }

  uploadImage(image) {
    if (image && image !== "") {
      const formData: FormData = new FormData();
      //console.log('typeof images[i] ', typeof image);
      if (typeof image !== "string") {
        formData.append("file", image);
        this.uploadFileService.uploadFile(formData).then(
          val => {
            // console.log('val ', val);
            this.form.value.icon = val[0].file;
            this.submit();
          },
          reason => {
            console.log("error ", reason);
          }
        );
      } else {
        this.form.value.icon = image;
        this.submit();
      }
    } else {
      this.submit();
    }
  }

  submit() {
    this.progressBarService.toggle();
    //console.log('onSubmit ', this.form.value);
    this.productsService.editItem(this.form.value).then(
      val => {
        this.helpersService.showActionSnackbar(
          PageAction.Update,
          true,
          "Chat Base Product"
        );
        this.router.navigate(["/chat-base-products/list"]);
        this.progressBarService.toggle();
      },
      reason => {
        this.helpersService.showActionSnackbar(
          PageAction.Update,
          false,
          "Chat Base Product",
          { style: "failed-snackbar" }
        );
        this.progressBarService.toggle();
        console.log("error ", reason);
      }
    );
  }

  onSubmit() {
    this.progressBarService.toggle();
    var icon = "";
    if (this.icon !== "") icon = this.form.value.icon;
    else {
      this.form.value.icon = "";
      this.icon = "";
    }
    this.uploadImage(icon);
  }



  dataSource: FilesDataSource | null;
  displayedColumns = [
    "icon",
    "name_en",
    "name_ar",
    "status",
    "price",
    "productSold",
    "btns"
  ];
  itemsCount: number = 0;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild("filter")
  filter: ElementRef;
  @ViewChild(MatSort)
  sort: MatSort;
  defaultProductIcon: string;

  getChatProduct() {
    this.productsService
      .getChatProduct(this.item.id)
      .then(items => {
        this.dataSource = new FilesDataSource(
          this.productsService
        );
        return items;
      });
  }

}

export class FilesDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject("");
  _filteredDataChange = new BehaviorSubject("");

  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(
    private productsService: ChatBasrProductsService,
  ) {
    super();
    this.filteredData = this.productsService.items;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this.productsService.onItemsChanged,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this.productsService.items.slice();

      data = this.filterData(data);

      this.filteredData = [...data];

      return data;
    });
  }

  filterData(data) {
    if (!this.filter) {
      return data;
    }
    return FuseUtils.filterArrayByString(data, this.filter);
  }


  disconnect() { }

}
