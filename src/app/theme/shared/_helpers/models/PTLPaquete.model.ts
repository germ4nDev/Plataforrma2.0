export class PTLPaquetesModel {
    constructor (
        public paqueteId? : number,
        public nombrePaquete? : string,
        public descripcionPaquete? : string,
        public estadoPaquete? : boolean,
        public costoPaquete? : number,
        public precioPaquete? : number,
        public promocion? : boolean,
        public precioPromocion? : number,
        public acuerdoLicencia? : string
   ) {}
}
