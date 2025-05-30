export class PTLSeguimientoRQ {
    constructor (
        public seguimientoId : number,
        public requerimientoId : number,
        public nombreSeguimiento : string,
        public descripcionSeguimiento : string,
        public estadoSeguimiento : number
   ) {}
}
