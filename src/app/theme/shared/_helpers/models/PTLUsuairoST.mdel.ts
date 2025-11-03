export class PTLUsuarioST {
  constructor(
    public usuarioId: number,
    public suscriptorId: number,
    public nombreUsuario: string,
    public claveUsuario: string,
    public correoUsuario: string,
    public estadoUsuario: number,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
