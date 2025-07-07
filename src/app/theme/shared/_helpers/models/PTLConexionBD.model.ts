export class PTLConexionBD {
    constructor (
        public conexionId : number,
        public aplicacionId : number,
        public suscriptorId : number,
        public paqueteId : number,
        public nombreConexion : string,
        public descripcionConexion : string,
        public nombreServidor : string,
        public BDNombre : string,
        public BDUser : string,
        public BDPassword : string,
        public BDPort : string,
        public estadoConexion : boolean
    ) {}
}
