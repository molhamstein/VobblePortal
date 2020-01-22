export class Calls {

    conversationId: string;
    createdAt: string ; 
    relatedUserId: string; 
    ownerId : string ; 
    id : string  ;
    startAt: string; 
    endAt: string; 
    duration: string;
    coins: number;  
    status: string;
    owner: any; 
    relatedUser : any; 

    

    constructor(call: any) {
        this.startAt = call.startAt ;
        this.endAt = call.endAt ;
        this.duration = Math.floor(call.duration / 60) + ":" + (call.duration % 60) ; 
        this.coins = call.cost;
        this.status = call.status ;
        this.owner = call.owner ;
        this.relatedUser = call.relatedUser ; 
        this.conversationId = call.conversationId ; 
        this.createdAt = call.createdAt; 
        this.relatedUserId = call.relatedUserId ;
        this.ownerId = call.ownerId;  
        this.id = call.id ; 
    }
}


