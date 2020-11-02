import { AppConfig } from "../../../shared/app.config";

export class ChatProduct {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string;
  baseProductId:string;
  price: number;
  productSold: number;
  status: string;

  constructor(chatProduct) {
    this.id = chatProduct.id; // || FuseUtils.generateGUID();
    this.name_ar = chatProduct.name_ar || "";
    this.name_en = chatProduct.name_en || "";
    this.status = chatProduct.status || "";
    this.baseProductId = chatProduct.baseProductId || "";
    this.price = chatProduct.price || 0;
    this.productSold = chatProduct.productSold || 0;
    this.icon = chatProduct.icon || AppConfig.defaultProductIcon;
  }
}
