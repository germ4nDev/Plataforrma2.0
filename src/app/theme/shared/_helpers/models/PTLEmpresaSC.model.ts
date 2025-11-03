export class PTLEmpresaSC {
  constructor(
    public empresaId: number,
    public suscriptorId: number,
    public nombreEmpresa: string,
    public descripcionEmpresa: string,
    public estadoEmpresa: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
