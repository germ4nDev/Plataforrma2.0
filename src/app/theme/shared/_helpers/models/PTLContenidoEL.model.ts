export class PTLContenidoELModel {
    constructor (
        public contenidoId? : number,
        public enlaceId? : number,
        public nombreContenido? : string,
        public descripcionContenido? : string,
        public contenido? : string,
        public estadoContenido? : boolean,
        public nomEstado? : string,
        public nomEnlace? : string
    ) {}
}
