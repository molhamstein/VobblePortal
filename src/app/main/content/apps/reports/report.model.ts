import { Bottle } from "../bottles/bottle.model";
import { User } from "../users/user.model";

export class Report {
  id: string;
  createdAt: string;
  bottleId: string;
  reportTypeId: string;
  ownerId: string;
  owner: User;
  bottle: Bottle;
  report_Type: { reportName_ar: ""; reportName_en: "" };

  constructor(report) {
    this.id = report.id; // || FuseUtils.generateGUID();
    this.createdAt = report.createdAt || "";
    this.bottleId = report.bottleId || "";
    this.reportTypeId = report.reportTypeId || "";
    this.ownerId = report.ownerId || "";
    this.report_Type = report.report_Type || {
      reportName_ar: "",
      reportName_en: ""
    };
    this.bottle = report.bottle || {
      id: "",
      owner: { username: "", image: "" },
      shore: { name_ar: "", name_en: "", icon: "" },
      createdAt: "",
      file: "",
      ownerId: "",
      shoreId: ""
    };
    this.owner = report.owner || { username: "", image: "" };
  }
}
