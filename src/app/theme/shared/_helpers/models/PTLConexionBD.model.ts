export class PTLConexionBD {
    constructor (
        public conexionId : number,
        public aplicacionId : number,
        public suscriptorId : number,
        public nombreConexion : string,
        public descripcionConexion : string,
        public estadoConexion : boolean
    ) {}
}
