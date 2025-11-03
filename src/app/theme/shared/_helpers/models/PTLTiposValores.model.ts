export class PTLTiposValoresModel {
  constructor(
    public tipoValorId?: number,
    public nombreTipo?: string,
    public descripcionTipo?: string,
    public estadoTipo?: boolean,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
