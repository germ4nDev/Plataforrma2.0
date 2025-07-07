export class PTLUsuarioModel {
    constructor (
        public usuarioId?: number,
        public identificacionUsuario?: number,
        public nombreUsuario?: string,
        public correoUsuario?: string,
        public userNameUsuario?: string,
        public claveUsuario?: string,
        public descripcionUsuario?: string,
        public fotoUsuario?: string,
        public serviceToken?: string,
        public estadoUsuario?: boolean,
        public nomEstado?: string,
        public rolesAP?: any
   ) {}
}
