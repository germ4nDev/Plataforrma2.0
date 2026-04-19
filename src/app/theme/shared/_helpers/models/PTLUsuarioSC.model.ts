export class PTLUsuarioSCModel {
  constructor(
    public usuarioId?: number,
    public codigoUsuarioSC?: string,
    public codigoSuscriptor?: string,
    public codigoUsuario?: string,
    public nombreUsuario?: string,
    public nombreSuscriptor?: string,
    public estadoUsuario?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
