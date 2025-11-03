export class PTLUsuarioRoleAP {
  constructor(
    public usuarioRoleId?: number,
    public usuarioId?: number,
    public aplicacionId?: number,
    public suiteId?: number,
    public codigoSuite?: string,
    public roleId?: number,
    public estadoUsuarioRole?: boolean,
    public checked?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
