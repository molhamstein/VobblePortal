import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersListComponent } from "./users-list/users-list.component";
import { SharedModule } from "../../../../core/modules/shared.module";
import { UsersService } from "./users.service";
import { UsersEditComponent } from "./users-edit/users-edit.component";
import { UsersNewComponent } from "./users-new/users-new.component";
import { UsersViewComponent } from "./users-view/users-view.component";

const routes: Routes = [
  {
    path: "list",
    component: UsersListComponent,
    resolve: {
      items: UsersService
    },
    data: { resolverType: "list", page: 0, itemsPerPage: 100 }
  },
  {
    path: "new",
    component: UsersNewComponent
  },
  {
    path: "edit/:id",
    component: UsersEditComponent,
    resolve: {
      data: UsersService
    },
    data: { resolverType: "edit" }
  },
  {
    path: "view/:id",
    component: UsersViewComponent,
    resolve: {
      data: UsersService
    },
    data: { resolverType: "view" }
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "users/list"
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UsersService],
  declarations: [
    UsersListComponent,
    UsersEditComponent,
    UsersViewComponent,
    UsersNewComponent,
  ]
})
export class UsersModule { }
