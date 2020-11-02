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
  bottleType: string; 
  owner: User;
  bottleId: string;
  repliesUserCount: number;
  userComplete = [];
  userSeen = [];
  userReplaies = [];
  viewStatus: string ; 
  totalWeight: number ; 
  addedScores: number ; 

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
    this.userComplete = bottle.userComplete || [];
    this.userSeen = bottle.userSeen || [];
    this.userReplaies = bottle.userReplaies || [];
    this.bottleType = bottle.bottleType || "" ;
    this.viewStatus = bottle.viewStatus || "" ; 
    this.addedScores = bottle.addedScores || 0 ;
    this.totalWeight = bottle.totalWeight || this.addedScores + this.weight ;  
  }
}
