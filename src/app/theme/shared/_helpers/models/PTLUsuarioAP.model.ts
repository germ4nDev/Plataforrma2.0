export class PTLUsuarioAP {
    constructor (
        public usuarioId : number,
        public aplicacionId : number,
        public nombreUsuario : string,
        public claveUsuario : string,
        public correoUsuario : string,
        public estadoUsuario : boolean,
        public serviceToken : string
   ) {}
}
