export class PTLSitiosAPModel {
    constructor (
        public sitioId? : number,
        public aplicacionId? : number,
        public nombreSitio? : string,
        public descripcionSitio? : string,
        public urlSitio? : string,
        public puertoSitio? : number,
        public estadoSitio? : boolean,
        public nomEstado? : string,
        public nomAplicacion? : string
   ) {}
}
