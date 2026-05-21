export class PTLTipoItemModel {
    constructor(
        public tipoItemId?: number,
        public codigoTipo?: string,
        public nombreTipo?: string,
        public descripcionTipo?: string,
        public estadoTipo?: boolean,
        public codigoUsuarioCreacion?: string,
        public fechaCreacion?: string,
        public codigoUsuarioModificacion?: string,
        public fechaModificacion?: string
    ) { }
}
