import { TypeGoodsService } from './../../content/apps/type-goods/type-goods.service';
import { countries } from 'typed-countries';
import { startWith, map } from 'rxjs/operators';
import { FuseTranslationLoaderService } from './../../../core/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { filter } from 'rxjs/operator/filter';
import { Observable } from 'rxjs';
import { ShoresService } from '../../content/apps/shores/shores.service';



@Component({
    selector: 'filter',
    templateUrl: 'filter.component.html',
    styleUrls: ['filter.component.scss']
})
export class FilterComponent {
    rateFilterForm: FormGroup;
    userFilterForm: FormGroup;
    filteredOptions: Observable<string[]>;
    filterForm: FormGroup = new FormGroup({});
    filterKey = { "status": false, "gender": false, "type": false, "shoreId": false, "country": false, "lastLoginFrom": false, "createdFrom": false, "createdTo": false };
    filter = {};
    // rate
    minRate;
    maxRate;
    // user
    isoCode = []
    statues = ['active', 'deactive', 'pending']

    tripStatues = ['pending', 'approved', 'active', 'deactive', 'finished']
    booleanStatues = [null, true, false]
    locations = []
    shores = []
    type_goods = []
    constructor(
        public shoresService: ShoresService,
        public typeGoodsService: TypeGoodsService,
        public dialogRef: MatDialogRef<FilterComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private _formBuilder: FormBuilder,
    ) {
        this.filterKey = data['filterKey'];
        this.filter = data['filter'];
        console.log(this.filter)

        if (this.filterKey['gender']) {
            this.filterForm.addControl('gender', new FormControl(this.filter['gender']))
        }

        if (this.filterKey['status']) {
            this.filterForm.addControl('status', new FormControl(this.filter['status']))
        }

        if (this.filterKey['country']) {
            this.filterForm.addControl('country', new FormControl(this.filter['country']))
            this.filteredOptions = this.filterForm.controls.country.valueChanges.pipe(
                startWith(""),
                map(val => this.filterC(val))
            );
        }

        if (this.filterKey['lastLoginFrom']) {
            this.filterForm.addControl('lastLoginFrom', new FormControl(this.filter['lastLoginFrom']))
        }

        if (this.filterKey['createdFrom']) {
            this.filterForm.addControl('createdFrom', new FormControl(this.filter['createdFrom']))
        }

        if (this.filterKey['createdTo']) {
            this.filterForm.addControl('createdTo', new FormControl(this.filter['createdTo']))
        }

        if (this.filterKey['shoreId']) {
            this.getShores()
            this.filterForm.addControl('shoreId', new FormControl(this.filter['shoreId']))
        }
        if (this.filterKey['type']) {
            this.getTypeGoods()
            this.filterForm.addControl('type', new FormControl(this.filter['type']))
        }

    }


    getShores() {
        this.shoresService.getItems().then(
            items => {
                this.shores = items;
            },
            error => { }
        );
    }

    getTypeGoods() {
        this.typeGoodsService.getItems().then(items => {
            this.type_goods = items;
        });
    }

    isEnLang() {
        // if (this.mainServ.loginServ.getLang() == "ar")
        //     return false
        // else
        //     return true
    }

    filterC(val: string): any[] {
        return countries.filter(option => option.iso.toLowerCase().includes(val));
    }

    ngOnInit() {

    }

    saveFilter() {

        this.dialogRef.close(this.filterForm.value);
    }

}
