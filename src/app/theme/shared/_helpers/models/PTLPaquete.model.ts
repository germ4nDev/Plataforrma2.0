export class PTLPquete {
    constructor (
        public paqueteId : number,
        public nombrePaquete : string,
        public descripcionPaquete : string,
        public costoPaquete : number,
        public preciooPaquete : number,
        public promocionPaquete : boolean,
        public promocionPromocion : boolean,
        public acuerdoLicencia : string,
        public estadoPaquete : boolean
   ) {}
}
