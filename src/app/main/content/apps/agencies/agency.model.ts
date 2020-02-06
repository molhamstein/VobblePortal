export class Agency {

    name: string ;
    status: string ; 
    createdAt: string ;
    id: string ; 

    constructor(agency: any) {
       this.name = agency.name ;
       this.status = agency.status ;
       this.createdAt = agency.createdAt ; 
       this.id = agency.id ; 
    }
}
