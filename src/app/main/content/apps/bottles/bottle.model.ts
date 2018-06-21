export class Bottle
{
  id: string;
  file: string;
  status: string;
  thumbnail : string;
  createdAt : string;
  weight : number;
  shoreId : string;
  shore : {name_en:'', name_ar:''};
  ownerId : string;
  owner : {username: ''};
  bottleId : string;


  constructor(bottle)
  {
    this.id = bottle.id; // || FuseUtils.generateGUID();
    this.file = bottle.file || '';
    this.status = bottle.status || '';
    this.thumbnail = bottle.thumbnail || '';
    this.createdAt = bottle.createdAt || '';
    this.weight = bottle.weight || 0;
    this.shoreId = bottle.shoreId || '';
    this.ownerId = bottle.ownerId || '';
    this.bottleId = bottle.bottleId || '';
    this.owner = bottle.owner || {};
    this.shore = bottle.shore || {};
  }
}
