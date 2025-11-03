export class PTLUsuarioEmpresaSC {
  constructor(
    public usuarioEmpresaId: number,
    public usuarioSCId: number,
    public empresaId: number,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
