export class PTLUsuarioSC {
  constructor(
    public usuarioSCId: number,
    public suscriptorId: number,
    public usuarioId: number,
    public estadoUsuario: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
