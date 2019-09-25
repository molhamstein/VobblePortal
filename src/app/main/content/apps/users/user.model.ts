import { AppConfig } from "../../../shared/app.config";

export class User {
  id: string;
  username: string;
  userId: string;
  gender: string;
  image: string;
  extraBottlesCount: number;
  bottlesCount: number;
  email: string;
  typeLogIn: string;
  socialId: string;
  nextRefill: string;
  ISOCode: string;
  country: { name: string; code: string };
  token: string;
  createdAt: string;
  status: string;
  totalBottlesThrown: number;
  foundBottlesCount: number;
  repliesBottlesCount: number;
  lastLogin: Date;
  isActive: boolean;
  deviceId:string;
  device:any

  constructor(user) {
    this.id = user.id; // || FuseUtils.generateGUID();
    this.username = user.username || "";
    this.image = user.image || AppConfig.defaultAvatar;
    this.userId = user.userId || "";
    this.gender = user.gender || "";
    this.extraBottlesCount = user.extraBottlesCount || 0;
    this.bottlesCount = user.bottlesCount || 0;
    this.typeLogIn = user.typeLogIn || "";
    this.email = user.email || "";
    this.socialId = user.socialId || "";
    this.nextRefill = user.nextRefill || "";
    this.ISOCode = user.ISOCode || "";
    this.token = user.token || "";
    this.country = user.country || {};
    this.createdAt = user.createdAt || "";
    this.status = user.status || "";
    this.lastLogin = user.lastLogin || "";
    this.totalBottlesThrown = user.totalBottlesThrown || 0;
    this.repliesBottlesCount = user.repliesBottlesCount || 0;
    this.foundBottlesCount = user.foundBottlesCount || 0;
    this.isActive = user.isActive || false;
    this.deviceId = user.deviceId || null;
    this.device = user.device || null;
  }
}
