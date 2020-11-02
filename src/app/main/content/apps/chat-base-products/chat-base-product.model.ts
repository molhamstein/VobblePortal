import { AppConfig } from "../../../shared/app.config";

export class ChatBaseProduct {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string;
  status: string;

  constructor(chatBaseProduct) {
    this.id = chatBaseProduct.id; // || FuseUtils.generateGUID();
    this.name_ar = chatBaseProduct.name_ar || "";
    this.name_en = chatBaseProduct.name_en || "";
    this.status = chatBaseProduct.status || "";
    this.icon = chatBaseProduct.icon || AppConfig.defaultProductIcon;
  }
}
