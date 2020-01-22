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
import { AgenciesService } from '../../content/apps/agencies/agencies.service';
import { User } from '../../content/apps/users/user.model';
import { UsersService } from '../../content/apps/users/users.service';



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
    filterKey = { "status": false, "gender": false, "type": false, "shoreId": false, "country": false, "lastLoginFrom": false, "createdFrom": false, "createdTo": false, "isVip": false, "bottleType": false, };
    filter = {};
    // rate
    minRate;
    maxRate;
    agencies;
    // user
    isoCode = []
    statues = ['active', 'deactive', 'pending']

    tripStatues = ['pending', 'approved', 'active', 'deactive', 'finished']
    booleanStatues = [null, true, false]
    locations = []
    shores = []
    type_goods = []

    users: User[] = [];
    filteredUsers: Observable<User[]>;
    filteredOwners: Observable<User[]>;

    constructor(
        public shoresService: ShoresService,
        public typeGoodsService: TypeGoodsService,
        public agenciesService: AgenciesService,
        public dialogRef: MatDialogRef<FilterComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private _formBuilder: FormBuilder,
        private userServ: UsersService,
    ) {
        this.filterKey = data['filterKey'];
        this.filter = data['filter'];

        if (this.filterKey['gender']) {
            this.filterForm.addControl('gender', new FormControl(this.filter['gender']))
        }

        if (this.filterKey['isHost']) {
            this.filterForm.addControl('isHost', new FormControl(this.filter['isHost']));
        }

        if (this.filterKey['agency']) {
            this.getAgencies();
            this.filterForm.addControl('agency', new FormControl(this.filter['agency']));
        }

        if (this.filterKey['isVip']) {
            this.filterForm.addControl('isVip', new FormControl(this.filter['isVip']))
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

        if (this.filterKey['bottleType']) {
            this.filterForm.addControl('bottleType', new FormControl(this.filter['bottleType']));
        }

        // Calls Log Filter

        if (this.filterKey['startFrom']) {
            this.filterForm.addControl('startFrom', new FormControl(this.filter['startFrom']));
        }

        if (this.filterKey['startTo']) {
            this.filterForm.addControl('startTo', new FormControl(this.filter['startTo']));
        }

        if (this.filterKey['callStatus']) {
            this.filterForm.addControl('callStatus', new FormControl(this.filter['callStatus']));
        }

        if (this.filterKey['owner']) {
            this.filterForm.addControl('owner', new FormControl(this.filter['owner']));

            this.filteredOwners = this.filterForm["controls"].owner.valueChanges.pipe(
                startWith(""),
                map(val => this.filterUsers(val))
            );
        }

        if (this.filterKey['relatedUser']) {
            this.filterForm.addControl('relatedUser', new FormControl(this.filter['relatedUser']));

            this.filteredUsers = this.filterForm["controls"].relatedUser.valueChanges.pipe(
                startWith(""),
                map(val => this.filterUsers(val))
            );
        }

        if (this.filterKey['relatedUserIsHost']) {
            this.filterForm.addControl('relatedUserIsHost', new FormControl(this.filter['relatedUserIsHost']));
        }

        if (this.filterKey['relatedUserAgencyId']) {
            this.filterForm.addControl('relatedUserAgencyId', new FormControl(this.filter['relatedUserAgencyId']));
        }
    }

    async getAgencies() {
        await this.agenciesService.getAgencies().subscribe(res => {
            this.agencies = res;
        });
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

    onSearch(keyword) {
        this.userServ.getUsersAutocpmlete(keyword).then(items => {
            this.users = items;
        });
    }

    displayFn(user: User): string {
        return (user ? user.username : "");
    }

    filterUsers(val): User[] {
        if (val && typeof val == "string") {
            return this.users.filter(option =>
                option.username.toLowerCase().includes(val.toLowerCase())
            );
        }
    }

}
