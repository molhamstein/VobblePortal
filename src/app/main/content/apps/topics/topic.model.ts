import { AppConfig } from "../../../shared/app.config";

export class Topic {
  id: string;
  text_ar: string;
  text_en: string;
  bottleCount: number
  status: string;

  constructor(topic) {
    this.id = topic.id; // || FuseUtils.generateGUID();
    this.text_ar = topic.text_ar || "";
    this.text_en = topic.text_en || "";
    this.bottleCount = topic.bottleCount || 0
    this.status = topic.status || "";
  }
}
