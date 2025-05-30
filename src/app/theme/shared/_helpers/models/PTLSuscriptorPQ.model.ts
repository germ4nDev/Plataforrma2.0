export class PTLSuscriptorPQ {
    constructor (
        public suscriptoPaqueteId : number,
        public suscriptorId : number,
        public paqueteId : number,
        public fechaInicio : Date,
        public fechaVencimiento : Date,
        public cdigoLicencia : string,
        public estadoLicencia : boolean
   ) {}
}
