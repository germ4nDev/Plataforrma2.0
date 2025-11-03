export class PTLEstadoModel {
  constructor(
    public estadoId?: number,
    public tipoEstado?: number,
    public nombreEstado?: string,
    public siglaEstado?: string,
    public codigoUsuarioCreacion?: string,
    public fechaCreacion?: string,
    public codigoUsuarioModificacion?: string,
    public fechaModificacion?: string
  ) {}
}
