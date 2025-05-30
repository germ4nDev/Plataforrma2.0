export class PTLLcenciaST {
    constructor (
        public licenciaId : number,
        public suscriptorId : number,
        public aplicacionId : number,
        public nombreLicencia : string,
        public descripcionLicencia : string,
        public estadoLicencia : boolean,
        public fechaCreacion :Date,
        public fechaVencimiento : Date
    ) {}
}
