export class Hosts {

    id: string ;
    name: string ;
    agency: string ; 
    callTotalCost: number ; 
    callCount : number ; 
    callTotalDuration : number ; 
    giftTotalCost : number ; 
    itemTotalCost : number ;
    total : number ;

    constructor(host: any) {
         this.id = host.id ;
         this.name = host.name; 
         this.agency = host.agency ; 
         this.callTotalCost = host.callTotalCost ; 
         this.callCount = host.callCount ; 
         this.callTotalDuration = host.callTotalDuration ; 
         this.giftTotalCost = host.giftTotalCost ;
         this.itemTotalCost = host.itemTotalCost ;
         this.total = host.total ; 
    }
}
