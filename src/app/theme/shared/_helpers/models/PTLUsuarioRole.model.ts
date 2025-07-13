export class PTLUsuarioRoleAP {
    constructor (
        public usuarioRoleId? : number,
        public usuarioId? : number,
        public aplicacionId? : number,
        public suiteId? : number,
        public codigoSuite? : string,
        public roleId? : number,
        public estadoUsuarioRole?: boolean,
        public checked?: boolean
   ) {}
}
