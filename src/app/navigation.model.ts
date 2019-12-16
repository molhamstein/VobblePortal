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
            id: "chat-base-products",
            title: "Chat Base Product",
            type: "collapse",
            icon: "chat_bubble",
            children: [
              {
                id: "list",
                title: "List",
                type: "item",
                url: "/chat-base-products/list"
              },
              {
                id: "new",
                title: "New",
                type: "item",
                url: "/chat-base-products/new"
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
            id: "purchasesReports",
            title: "Purchases Reports",
            type: "collapse",
            icon: "report",
            children: [
              {
                id: "list",
                title: "per user",
                type: "item",
                url: "/purchasesReports/perUser"
              },
              {
                id: "list",
                title: "per day",
                type: "item",
                url: "/purchasesReports/perDay"
              }
            ]
          },
          {
            id: "extend-message",
            title: "Chat Extend",
            type: "item",
            icon: "add_alarm",
            url: "/extend-message"
          },
          {
            id: "gift-items",
            title: "Gift Items",
            type: "item",
            icon: "card_giftcard",
            url: "/gift-items"
          },
          {
            id: "block",
            title: "Block",
            type: "item",
            icon: "block",
            url: "/block/list"
          }
        ]
      }
    ];
  }
}
