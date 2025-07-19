export class PTLSeguimientoRQModel {
    constructor (
        public seguimientoId? : number,
        public requerimientoId? : number,
        public nombreSeguimiento? : string,
        public descripcionSeguimiento? : string,
        public estadoSeguimiento? : boolean,
        public estadoRequerimiento? : number,
   ) {}
}
