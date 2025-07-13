export class PTLSuscriptorModel {
    constructor (
        public suscriptorId? : number,
        public nombreSuscriptor? : string,
        public descripcionSuscriptor? : string,
        public estadoSuscriptor? : boolean,
        public conexionId? : number,
        public nomEstado?: string
   ) {}
}
