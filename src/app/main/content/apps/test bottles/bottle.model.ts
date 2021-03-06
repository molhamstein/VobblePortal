import { Shore } from "../shores/shore.model";
import { User } from "../users/user.model";
export class Bottle {
  id: string;
  file: string;
  status: string;
  thumbnail: string;
  createdAt: string;
  weight: number;
  shoreId: string;
  shore: Shore;
  ownerId: string;
  owner: User;
  bottleId: string;
  repliesUserCount: number;

  constructor(bottle) {
    this.id = bottle.id; // || FuseUtils.generateGUID();
    this.file = bottle.file || "";
    this.status = bottle.status || "";
    this.thumbnail = bottle.thumbnail || "";
    this.createdAt = bottle.createdAt || "";
    this.weight = bottle.weight || 0;
    this.repliesUserCount = bottle.repliesUserCount || 0;
    this.shoreId = bottle.shoreId || "";
    this.ownerId = bottle.ownerId || "";
    this.bottleId = bottle.bottleId || "";
    this.owner = bottle.owner || {};
    this.shore = bottle.shore || {};
  }
}
