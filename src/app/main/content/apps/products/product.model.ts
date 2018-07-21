import {AppConfig} from "../../../shared/app.config";

export class Product
{
  id: string;
  name_ar: string;
  name_en : string;
  price : number;
  bottleCount  : number;
  validity  : number;
  description : string;
  icon : string;
  androidProduct : string;
  appleProduct : string;
  typeGoodsId : string;
  typeGoods : {name_en:'', name_ar:''};


  constructor(product)
  {
    this.id = product.id; // || FuseUtils.generateGUID();
    this.name_ar = product.name_ar || '';
    this.name_en = product.name_en || '';
    this.price = product.price || 0;
    this.validity = product.validity || 0;
    this.description = product.description || '';
    this.icon = product.icon || AppConfig.defaultProductIcon;
    this.androidProduct = product.androidProduct || '';
    this.appleProduct = product.appleProduct || '';
    this.typeGoodsId = product.typeGoodsId || '';
    this.bottleCount  = product.bottleCount  || 0;
    this.typeGoods  = product.typeGoods  || {};


  }
}