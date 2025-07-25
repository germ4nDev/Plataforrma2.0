export class PTLServidorModel {
    constructor (
        public servidorId? : number,
        public nombreServidor? : string,
        public descripcionServidor? : string,
        public rutaServidor? : string,
        public estadoServidor? : boolean,
        public nomEstado? : string
    ) {}
}
