export class PTLPaquetesSCModel {
    constructor (
        public suscriptorPaqueteId? : number,
        public codigoSuscriptor? : string,
        public codigoPaquete? : string,
        public nombrePaquete? : string,
        public fechaInicio? : Date,
        public fechaVencimiento? : Date,
        public codigoLicencia? : string,
        public estadoLicencia? : boolean
   ) {}
}
