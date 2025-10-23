export class PTLConexionBDModel {
    constructor (
        public conexionId? : number,
        public codigoSuscriptor? : string,
        public codigoPaquete? : string,
        public nombreConexion? : string,
        public nombreServidor? : string,
        public BDNombre? : string,
        public BDUser? : string,
        public BDPassword? : string,
        public BDPort? : string,
        public descripcionConexion? : string,
        public estadoConexion? : boolean,
        public nombreSuscriptor? : string,
        public nomEstado? : string,
    ) {}
}
