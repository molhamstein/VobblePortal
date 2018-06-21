export class Item
{
  id: string;
  storeType  : string;
  storeToken  : string;
  isConsumed  : boolean;
  valid  : boolean;
  startAt  : string;
  endAt  : string;
  productId  : string;
  ownerId  : string;
  product: {name_ar:'', name_en:'', icon:''};
  owner: {username:'', image:''};

  constructor(shore)
  {
    this.id = shore.id; // || FuseUtils.generateGUID();
    this.storeType  = shore.storeType  || '';
    this.storeToken  = shore.storeToken  || '';
    this.isConsumed  = shore.isConsumed  || false;
    this.valid  = shore.valid  || false;
    this.startAt  = shore.startAt  || '';
    this.endAt  = shore.endAt  || '';
    this.productId  = shore.productId  || '';
    this.ownerId  = shore.ownerId  || '';
    this.product  = shore.product  ||  {name_ar:'', name_en:'', icon:''};
    this.owner  = shore.owner  ||  {username:'', image:''};
  }
}
