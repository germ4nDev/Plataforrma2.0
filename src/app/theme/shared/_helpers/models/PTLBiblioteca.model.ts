export class PTLBiblioteca {
  constructor(
    public bibliotecaId?: number,
    public codigoAplicacion?: string,
    public codigoBiblioteca?: string,
    public nombreBiblioteca?: string,
    public descripcionBiblioteca?: string,
    public estadoBiblioteca?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
