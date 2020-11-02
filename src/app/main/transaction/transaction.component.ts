import { Component, Input } from '@angular/core';
import { UsersService } from '../content/apps/users/users.service';

@Component({
    selector: 'app-transaction',
    templateUrl: 'transaction.component.html',
    styleUrls: ['transaction.component.scss']
})
export class TransactionComponent {
    @Input() userId: string;
    data;
    currentTab = 'item'
    constructor(
        private usersService: UsersService,
    ) {
    }

    async ngOnInit() {
        this.data = await this.usersService.getTransctionUser(this.userId)
    }

}
