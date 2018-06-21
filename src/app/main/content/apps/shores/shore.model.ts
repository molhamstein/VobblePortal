import {AppConfig} from "../../../shared/app.config";
export class Shore
{
  id: string;
  name_ar : string;
  name_en: string;
  cover : string;
  icon : string;

  constructor(shore)
  {
    this.id = shore.id; // || FuseUtils.generateGUID();
    this.cover  = shore.cover  || AppConfig.defaultShoreCover;
    this.icon  = shore.icon   || AppConfig.defaultShoreIcon;
    this.name_ar = shore.name_ar || '';
    this.name_en = shore.name_en || '';
  }
}
