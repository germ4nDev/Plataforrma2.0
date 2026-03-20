export class PTLModuloPQModel {
  constructor(
    public moduloPQId?: number,
    public codigoAplicacion?: string,
    public codigoSuite?: string,
    public codigoModulo?: string,
    public codigoPaquete?: string,
    public estadoModulo?: boolean,
    public nomPaquete?: string,
    public nomEstado?: string,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
