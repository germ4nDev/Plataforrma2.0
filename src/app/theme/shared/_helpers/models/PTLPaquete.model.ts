export class PTLPaquetesModel {
    constructor (
        public paquetesId? : number,
        public nombrePaquetes? : string,
        public descripcionPaquetes? : string,
        public costoPquete? : number,
        public precioPaquete? : number,
        public promocion? : boolean,
        public precioPromocion? : number,
        public acuerdoLicencia? : string,
        public estadoPaquetes? : boolean
   ) {}
}
