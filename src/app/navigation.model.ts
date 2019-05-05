export class NavigationModel {
  public model: any[];

  constructor() {
    this.model = [
      {
        id: "applications",
        title: "Applications",
        type: "group",
        icon: "apps",
        children: [
          {
            id: "dashboard",
            title: "Dashboard",
            type: "item",
            icon: "dashboard",
            url: "/dashboard"
          },
          {
            id: "users",
            title: "Users",
            type: "collapse",
            icon: "account_box",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/users/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/users/new"
              }
            ]
          },
          {
            id: "bottles",
            title: "Bottles",
            type: "collapse",
            icon: "opacity",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/bottles/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/bottles/new"
              }
            ]
          },
          {
            id: "shores",
            title: "Shores",
            type: "collapse",
            icon: "directions_boat",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/shores/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/shores/new"
              }
            ]
          },
          {
            id: "items",
            title: "Items",
            type: "collapse",
            icon: "view_week",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/items/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/items/new"
              }
            ]
          },
          {
            id: "products",
            title: "Products",
            type: "collapse",
            icon: "style",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/products/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/products/new"
              }
            ]
          },
          {
            id: "topics",
            title: "Topics",
            type: "collapse",
            icon: "contact_support",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/topics/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/topics/new"
              }
            ]
          },
          {
            id: "testBottle",
            title: "Test Bottle",
            type: "collapse",
            icon: "warning",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/testBottles/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/testBottles/new"
              }
            ]
          },
          {
            id: "reports",
            title: "Reports",
            type: "collapse",
            icon: "report",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/reports/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/reports/new"
              }
            ]
          },
          {
            id: "extend-message",
            title: "Extend Message",
            type: "item",
            icon: "dashboard",
            url: "/extend-message"
          }
        ]
      }
    ];
  }
}
